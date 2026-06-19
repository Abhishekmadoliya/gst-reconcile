# GST Reconciliation Autopilot — Backend Developer Guide & Expected APIs

This document maps out the API contract between the Next.js frontend application and the Express/Node.js backend. It details implemented endpoints, expected routes for mocked features, payload structures, and integration guidelines.

---

## 1. Dashboard State & Architecture

The frontend uses Next.js App Router (split into sub-routes under `/dashboard`) and leverages a client-side Zustand store (`fe/store/useDashboardStore.ts`) to maintain state across pages:
*   **`selectedGstinId`**: ID of the currently selected client profile.
*   **`selectedJobId`**: ID of the active reconciliation job results ledger.

All requests include session tokens inside HTTP-only cookies (`accessToken` and `refreshToken`). Token rotation is handled transparently by the proxy middleware.

---

## 2. Implemented API Inventory

These routes are already implemented in the backend controllers and active on the frontend:

### 2.1 Authentication (`/api/auth`)
*   **`POST /api/auth/register`**
    *   **Payload**: `{ name, email, password, firmName }`
    *   **Response**: `{ success: true, data: { user } }` (Sets access and refresh HttpOnly cookies)
*   **`POST /api/auth/login`**
    *   **Payload**: `{ email, password }`
    *   **Response**: `{ success: true, data: { user } }`
*   **`GET /api/auth/me`**
    *   **Response**: `{ success: true, data: { user } }`
*   **`POST /api/auth/logout`**
    *   **Response**: `{ success: true }` (Clears cookies)

### 2.2 Client GSTIN Profiles (`/api/gstins`)
*   **`GET /api/gstins`**
    *   **Response**: `{ success: true, data: [{ id, gstin, legalName, tradeName, status, createdAt }] }`
*   **`POST /api/gstins`**
    *   **Payload**: `{ gstin, legalName, tradeName }`
    *   **Response**: `{ success: true, data: { id, gstin, status } }`
*   **`DELETE /api/gstins/:id`**
    *   **Response**: `{ success: true }`
*   **`POST /api/gstins/:id/connect`** (Links client to GSP portal)
    *   **Payload**: `{ username }`
    *   **Response**: `{ success: true, data: { requestId } }` (Dispatches OTP via government portal)
*   **`POST /api/gstins/:id/verify-otp`**
    *   **Payload**: `{ otp, requestId }`
    *   **Response**: `{ success: true }` (Sets client status to `connected`)

### 2.3 Reconciliation Matching Engine (`/api/reconcile`)
*   **`POST /api/reconcile`** (Multipart file upload)
    *   **Payload**: Form-Data with file field `purchaseRegister`, and body fields `gstinId`, `month` (e.g., `"04"`), `year` (e.g., `"2026"`)
    *   **Response**: `{ success: true, data: { jobId, status: "pending" } }`
*   **`GET /api/reconcile/history`**
    *   **Query Params**: `page`, `limit`, `gstinId` (optional)
    *   **Response**: `{ success: true, data: [{ id, period, status, summary, createdAt }] }`
*   **`GET /api/reconcile/:jobId`** (Poll status)
    *   **Response**: `{ success: true, data: { id, status, summary: { matchedCount, amountMismatchCount, inBooksNot2bCount, in2bNotBooksCount, itcMatched, itcAtRisk, itcUnclaimed } } }`
*   **`GET /api/reconcile/:jobId/results`** (Paginated matching ledger)
    *   **Query Params**: `page`, `limit`, `category` (optional: `MATCHED`, `AMOUNT_MISMATCH`, etc.), `search`
    *   **Response**: `{ success: true, data: [{ id, category, supplierGstin, supplierName, invoiceNo, purchaseRegister, gstr2b, diff }] }`
*   **`GET /api/reconcile/:jobId/export`**
    *   **Response**: Binary Excel file stream containing matched invoices.

### 2.4 Analytics & Reporting (`/api/analytics`)
*   **`GET /api/analytics/itc-summary`**
    *   **Response**: `{ success: true, data: [{ period, itcMatched, itcAtRisk, itcUnclaimed }] }`
*   **`GET /api/analytics/supplier-health`**
    *   **Response**: `{ success: true, data: [{ supplierGstin, supplierName, totalInvoices, matchedCount, mismatchCount, missingCount, matchRate }] }`

---

## 3. Expected API Route Contracts (Frontend Mocked Pages)

The following APIs are currently mocked on the frontend. Backend developers must implement routes matching these path signatures, methods, payloads, and response JSON formats.

### 3.1 GSTR-3B Filing Assistant (`/api/gstr3b`)
Filing page `/dashboard/gstr3b` needs to compile Table 4 (Eligible ITC) values computed from reconciled jobs and submit them.

*   **`GET /api/gstr3b/draft/:jobId`**
    *   **Description**: Fetch Table 4 Eligible ITC pre-filled values computed from the given job's matching records.
    *   **Response**:
        ```json
        {
          "success": true,
          "data": {
            "period": "2026-04",
            "table4": {
              "importGoods": { "igst": 120000, "cgst": 0, "sgst": 0 },
              "importServices": { "igst": 15000, "cgst": 0, "sgst": 0 },
              "inwardRcm": { "igst": 5000, "cgst": 2500, "sgst": 2500 },
              "inwardIsd": { "igst": 8000, "cgst": 0, "sgst": 0 },
              "allOtherItc": { "igst": 345000, "cgst": 172500, "sgst": 172500 }
            }
          }
        }
        ```
*   **`POST /api/gstr3b/file`**
    *   **Description**: Final submission to GST portal using EVC verification (OTP signature).
    *   **Payload**:
        ```json
        {
          "gstinId": "gstin-uuid-1234",
          "period": "2026-04",
          "evcOtp": "123456"
        }
        ```
    *   **Response**:
        ```json
        {
          "success": true,
          "data": {
            "arn": "ARN-3B-98402174",
            "filedAt": "2026-06-19T11:50:00Z",
            "status": "filed"
          }
        }
        ```

### 3.2 Subscription & Billing (`/api/billing`)
Billing page `/dashboard/billing` monitors connecting quotas and Razorpay transactions.

*   **`GET /api/billing/plan`**
    *   **Description**: Returns active subscription details, active client counts, and limits.
    *   **Response**:
        ```json
        {
          "success": true,
          "data": {
            "activePlan": "CA Starter",
            "limit": 20,
            "connectedCount": 4,
            "amount": "₹4,999.00/month",
            "billingDate": "2026-07-01T00:00:00Z"
          }
        }
        ```
*   **`GET /api/billing/invoices`**
    *   **Description**: Lists payment history log invoices.
    *   **Response**:
        ```json
        {
          "success": true,
          "data": [
            { "id": "INV-2026-004", "date": "2026-04-01", "amount": "₹4,999.00", "status": "Paid" }
          ]
        }
        ```

### 3.3 Firm Settings & Team Invite (`/api/settings`)
Settings page `/dashboard/settings` manages CA firm parameters.

*   **`PATCH /api/settings`**
    *   **Description**: Updates firm name and registration number.
    *   **Payload**: `{ firmName: string, crn: string }`
    *   **Response**: `{ "success": true }`
*   **`POST /api/team/invite`**
    *   **Description**: Invites team members.
    *   **Payload**: `{ email: string, name: string, role: "admin" | "viewer" }`
    *   **Response**: `{ "success": true }`
*   **`POST /api/settings/erp-presets`**
    *   **Description**: Saves custom file header column mappings (Tally, Zoho, SAP).
    *   **Payload**: `{ invoiceIdCol: string, gstinCol: string, taxableCol: string, igstCol: string }`
    *   **Response**: `{ "success": true }`

### 3.4 Supplier follow-up AI chaser (`/api/follow-ups`)
Filing notice page `/dashboard/follow-ups` triggers custom notifications to suppliers causing discrepancies.

*   **`POST /api/follow-ups/draft`**
    *   **Description**: Uses LLM helper to draft chaser emails for mismatching supplier GSTINs.
    *   **Payload**: `{ supplierGstin: string, jobId: string }`
    *   **Response**:
        ```json
        {
          "success": true,
          "data": {
            "draftText": "Subject: URGENT: Input Tax Credit (ITC) Mismatch notice..."
          }
        }
        ```

---

## 4. Key Schemas & Validations

Keep backend validations aligned with these rules:
1.  **GSTIN Validation Format**: Must be 15 alphanumeric characters matching:
    ```javascript
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    ```
2.  **Filing Periods**: Expressed as ISO formatted date periods (`YYYY-MM`), e.g., `"2026-04"`.
3.  **Filing Status States**: Status LEDs in UI map to database fields:
    *   `connected` / `pending` / `expired` / `error`.
