# GST Reconciliation Engine — Known Issues & Fixes Roadmap

This document outlines technical debt, edge cases, and improvements identified in the TaxSolver Reconciliation Engine for future sprints.

---

## 1. 🔴 High Priority: Gross Value vs. Total Tax (ITC) Mapping

### Problem
- In `pur_tem.xlsx`, there are two separate total columns:
  - **Column 19**: `GST Amount` (Sum of IGST + CGST + SGST + Cess)
  - **Column 24**: `Gross Sales Amount` (Base Taxable Value + GST Amount)
- In `be/src/services/parser.service.ts` (`HEADER_MAP`), `'gross sales amount'`, `'invoice value'`, and `'total'` all map to `total`.
- When a user uploads a purchase register containing `Gross Sales Amount` (e.g. ₹1,18,000), `purchaseRegister.total` is populated with the **Gross Invoice Value** instead of the **Total ITC** (₹18,000).
- In GSTR-2B, `gstr2b.total` represents only the **Total Tax Amount** (₹18,000).
- In the frontend summary cards and difference calculations, comparing ₹1,18,000 to ₹18,000 results in a false ₹1,00,000 discrepancy.

### Solution / Proposed Fix
1. In `parser.service.ts`, separate `taxTotal` (sum of taxes) from `invoiceTotal` (gross value).
2. Explicitly map `GST Amount` to `total` (or compute `total = igst + cgst + sgst + cess`).
3. Ensure `purchaseRegister.total` consistently represents **Total ITC (Tax Amount)** across both Books and 2B.

---

## 2. 🔴 High Priority: Credit Note Sign Inversion (`Math.abs`)

### Problem
- In `be/src/services/parser.service.ts`:
  ```ts
  function parseIndianNumber(value: any): number {
    ...
    return isNaN(num) ? 0 : Math.abs(Math.round(num * 100) / 100);
  }
  ```
  `parseIndianNumber` strips negative signs using `Math.abs()`, converting `-₹5,000` to `+₹5,000`.
- In `be/src/services/gstr2b-parser.service.ts`, Credit Notes (`CDNR`) are correctly parsed as negative amounts:
  ```ts
  const sign = note.typ === 'C' ? -1 : 1;
  ```
- **Impact**: Credit Notes in the purchase register will never match GSTR-2B, resulting in a false `AMOUNT_MISMATCH` with a **2× variance** (₹10,000 mismatch on a ₹5,000 note).

### Solution / Proposed Fix
1. Preserve negative numbers in `parseIndianNumber()` by removing `Math.abs()` when dealing with amounts.
2. In `normalizeRows()`, allow signed values (negative for credit notes/returns).

---

## 3. 🟡 Medium Priority: Multi-Line GSTR-2B Invoices Overwriting

### Problem
- In portal Excel exports, invoices with multiple tax rates (e.g., items at 12% and 18%) appear across multiple rows under the same invoice number.
- In `be/src/services/matching.service.ts`:
  ```ts
  const map2b = new Map<string, NormalizedInvoice>();
  for (const row of gstr2bRows) {
    const key = buildKey(row.supplierGstin, row.invoiceNo);
    map2b.set(key, row); // Overwrites previous line items
  }
  ```
- **Impact**: Only the last line item's tax is retained, causing false amount mismatches for multi-rate invoices.

### Solution / Proposed Fix
1. Aggregate multi-line items in `gstr2b-excel-parser.service.ts` or inside `matching.service.ts` (summing `taxableValue`, `igst`, `cgst`, `sgst`, `cess`, `total`) before building `map2b`.

---

## 4. 🟡 Medium Priority: Tax Head Mismatches (IGST vs. CGST + SGST)

### Problem
- When a supplier books an invoice under **IGST** (₹18,000) and the buyer books under **CGST + SGST** (₹9,000 + ₹9,000), the total tax matches, but the individual heads differ.
- Currently, `isDiffZero()` checks each component independently and flags this as an `AMOUNT_MISMATCH`.

### Solution / Proposed Fix
1. Add a distinct category or sub-status: `HEAD_MISMATCH` or `POS_MISMATCH` (Place of Supply mismatch).
2. Note in the breakdown: *"Total tax matches (₹18,000), but tax head differs (IGST vs CGST/SGST)."*

---

## 5. 🟡 Medium Priority: Ineligible ITC (Section 17(5) / Blocked Credit)

### Problem
- GSTR-2B includes an `itcavl` field (`Y` = Available, `N` = Ineligible / Blocked Credit).
- Currently, the engine includes `itcavl = 'N'` invoices in normal calculations without flagging them to the user.

### Solution / Proposed Fix
1. Display an `Ineligible ITC` badge on records where `itcAvailability === 'N'`.
2. Exclude or separate ineligible ITC in the dashboard summary cards to prevent over-claiming in GSTR-3B.

---

## 6. ℹ️ Low Priority: Large Dataset Virtualization & Optimization

### Problem
- Files with 20,000+ invoices pass large JSON payloads and perform per-supplier `Fuse.js` fuzzy searches in-memory.

### Solution / Proposed Fix
1. Stream or paginate large results.
2. Implement React windowing / virtualization for the discrepancy table on large datasets.
