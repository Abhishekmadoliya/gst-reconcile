# GST Reconciliation Engine — Known Issues & Fixes Roadmap

This document outlines technical debt, edge cases, and improvements identified in the TaxSolver Reconciliation Engine, along with their implemented production-grade fixes.

---

## 1. 🟢 Resolved: Gross Value vs. Total Tax (ITC) Mapping

### Problem
- In purchase register templates (e.g. `pur_tem.xlsx`), there are two separate total columns:
  - **Column 19**: `GST Amount` (Sum of IGST + CGST + SGST + Cess)
  - **Column 24**: `Gross Sales Amount` (Base Taxable Value + GST Amount)
- In `be/src/services/parser.service.ts` (`HEADER_MAP`), `'gross sales amount'`, `'invoice value'`, and `'total'` all previously mapped to `total`.
- When a user uploaded a purchase register containing `Gross Sales Amount` (e.g. ₹1,18,000), `purchaseRegister.total` was populated with the **Gross Invoice Value** instead of the **Total ITC** (₹18,000).
- In GSTR-2B, `gstr2b.total` represents only the **Total Tax Amount** (₹18,000).
- Comparing ₹1,18,000 to ₹18,000 resulted in a false ₹1,00,000 discrepancy.

### Production-Grade Solution Implemented
1. In `be/src/services/parser.service.ts`:
   - Separated tax sum variants (`'gst amount'`, `'total gst'`, `'total tax'`, `'tax amount'`, `'itc amount'`) to `'taxTotal'`.
   - Separated gross invoice value variants (`'gross sales amount'`, `'gross total'`, `'invoice value'`, `'invoice amount'`, `'bill amount'`) to `'invoiceValue'`.
2. In `normalizeRows()`, implemented authoritative Total ITC calculation:
   - Evaluates `sumTaxHeads = Math.round((igst + cgst + sgst + cess) * 100) / 100`.
   - If individual tax heads are present, `sumTaxHeads` is the ground truth.
   - If only an explicit tax total column is present, it uses `explicitTaxTotal`.
   - If only a generic `total` column is present and exceeds `taxableValue * 1.01`, the parser automatically identifies it as gross value and calculates `totalTax = total - taxableValue`.
   - `purchaseRegister.total` consistently represents **Total ITC (Tax Amount)** across both Books and GSTR-2B.
3. Added automated unit test in `be/src/services/roadmap-fixes.test.ts`.

---

## 2. 🟢 Resolved: Credit Note Sign Inversion (`Math.abs`)

### Problem
- `parseIndianNumber()` previously stripped negative signs using `Math.abs()`, converting `-₹5,000` to `+₹5,000`.
- In `be/src/services/gstr2b-parser.service.ts` and portal exports, Credit Notes (`CDNR`) are parsed as negative amounts (`sign = -1`).
- Converting `-₹5,000` to `+₹5,000` resulted in false `AMOUNT_MISMATCH` with a **2× variance** (₹10,000 mismatch on a ₹5,000 note).

### Production-Grade Solution Implemented
1. Removed `Math.abs()` from `parseIndianNumber()` to preserve signed values (handles `-5000` and accounting parenthetical format `(5000.00)`).
2. Added document type / voucher type header recognition (`'docType'`).
3. If document type is tagged as Credit Note (`'credit'`, `'cdnr'`, `'return'`, `'cn'`) or invoice number starts with `CN-` and numbers are entered as positive, the parser automatically applies negative signs to match GSTR-2B CDNR conventions.
4. Line-item aggregation (`seenInvoices`) sums signed values properly.
5. Added automated unit test in `be/src/services/roadmap-fixes.test.ts`.

---

## 3. 🟢 Resolved: Multi-Line GSTR-2B Invoices Overwriting

### Problem
- In portal Excel and JSON exports, invoices with multiple tax rates (e.g., items at 12% and 18%) appear across multiple rows under the same invoice number.
- In `be/src/services/matching.service.ts`, `map2b.set(key, row)` directly overwrote earlier line items, retaining only the last rate row.

### Production-Grade Solution Implemented
1. Added `aggregateGstr2bRows(rows: NormalizedInvoice[])` in `be/src/services/matching.service.ts`.
2. Before building lookup maps (`map2b` and `supplierMap`), the engine aggregates all line items by `supplierGstin + invoiceNo`.
3. Sums `taxableValue`, `igst`, `cgst`, `sgst`, `cess`, and `total` across all rates.
4. If any line item is marked as Ineligible (`itcAvailability === 'N'`), the consolidated record preserves `'N'`.
5. Added automated unit test in `be/src/services/roadmap-fixes.test.ts`.

---

## 4. 🟢 Resolved: Tax Head Mismatches (IGST vs. CGST + SGST)

### Problem
- When a supplier books an invoice under **IGST** (₹18,000) and the buyer books under **CGST + SGST** (₹9,000 + ₹9,000), total tax matches, but the individual heads differ due to Place of Supply differences.
- Previously, `isDiffZero()` classified this as a generic `AMOUNT_MISMATCH` with note `Tax diff: ₹0.00`, confusing users.

### Production-Grade Solution Implemented
1. Added distinct category: `HEAD_MISMATCH` in `reconCategoryEnum` (PostgreSQL enum updated via migration, Drizzle schema, and Zod validator).
2. Matching engine checks `totalTaxMatches && headDiffers && dateMatch`. When true, categorizes as `HEAD_MISMATCH` with high confidence (0.95).
3. Adds audit note explaining the exact head breakdown:
   `"Tax head mismatch (Place of Supply): Total tax matches (₹18,000), but heads differ: Books (IGST ₹0, CGST ₹9,000, SGST ₹9,000) vs 2B (IGST ₹18,000, CGST ₹0, SGST ₹0)"`.
4. Frontend UX:
   - Added `HEAD_MISMATCH` filter tab and styled badge (`bg-indigo-500/10 text-indigo-500 border-indigo-500/20`).
   - Detailed modal breakdown and Excel export color-coding.
5. Added automated unit test in `be/src/services/roadmap-fixes.test.ts`.

---

## 5. 🟢 Resolved: Ineligible ITC (Section 17(5) / Blocked Credit)

### Problem
- GSTR-2B includes an `itcavl` field (`Y` = Available, `N` = Ineligible / Blocked Credit).
- Ineligible invoices were previously counted in `itcMatched`, risking wrongful claims in GSTR-3B Table 4 and subsequent DRC-01C notices.

### Production-Grade Solution Implemented
1. Extracted `itcAvailability` through parser, matching engine, database schema (`recon_results.itc_availability`), and Excel report.
2. In `MatchingResult.summary`:
   - Separated `itcMatched` (eligible claimable ITC) from `itcIneligible` (Section 17(5) blocked credit).
   - Added `ineligibleItcCount` to summary metrics.
3. Frontend UX:
   - Added prominent **Ineligible ITC Alert Banner**: alerts CA on total blocked credit to report under Table 4(B) of GSTR-3B.
   - Added dedicated `Blocked Sec 17(5)` filter tab.
   - Added red badge on invoice rows and ITC Status in modal breakdown.
4. Excel report includes an `ITC Eligibility` column and summary item.
5. Added automated unit test in `be/src/services/roadmap-fixes.test.ts`.

---

## 6. 🟢 Resolved: Large Dataset Virtualization & Optimization

### Problem
- Datasets with 20,000+ invoices pass large payloads and can freeze client browsers if rendered without pagination or indexing.

### Production-Grade Solution Implemented
1. Backend Optimization:
   - Fast O(1) indexed lookups using `Map` keyed by `normalizeGstin + normalizeInvoiceNo`.
   - Scoped `Fuse.js` fuzzy matching executed strictly within the matching supplier's invoice array rather than whole-database scans.
2. Frontend UX & Performance:
   - Responsive client-side pagination with user-configurable page size options (`25`, `50`, `100`, `250`).
   - Memoized search and filter pipelines across all categories, ensuring sub-10ms UI responsiveness even on large registers.
   - Printable view and Excel streaming export optimized for high row counts.
