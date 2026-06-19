# API Expected by Frontend (Developer Guide)

This document outlines the APIs that the frontend expects the backend to implement, based on the current frontend architecture and pages (`fe/gst-frontend-pages.jsx` and Dashboard Layout). 

The frontend uses `/api/...` for all backend requests.

## Auth & Onboarding

### 1. `GET /api/plans`
- **Purpose**: Fetch pricing plans for the landing and pricing pages.
- **Request**: `None`
- **Response**: Array of plans (Solo, CA Starter, CA Pro) with pricing details and features.

### 2. `POST /api/auth/register`
- **Purpose**: CA firm account creation.
- **Body**: `{ name, email, password, mobile, gstin? }`
- **Response**: `{ success: true, token/session, user }`

### 3. `POST /api/auth/send-otp` & `POST /api/auth/verify-otp`
- **Purpose**: Mobile OTP verification for registration.

### 4. `POST /api/auth/login`
- **Purpose**: NextAuth credentials login.
- **Body**: `{ email, password }`
- **Response**: User object with JWT.

### 5. `POST /api/auth/forgot-password` & `POST /api/auth/reset-password`
- **Purpose**: Reset password flow.

## GSTIN Management

### 6. `GET /api/gstins`
- **Purpose**: Fetch connected GSTINs for the dashboard and sidebar.
- **Response**: 
```json
{
  "data": [
    {
      "id": "uuid",
      "gstin": "27AAAAA0000A1Z1",
      "legalName": "Acme Corp",
      "tradeName": "Acme",
      "status": "connected | pending | expired | error",
      "createdAt": "date"
    }
  ]
}
```

### 7. `POST /api/gstins`
- **Purpose**: Add a new client GSTIN.
- **Body**: `{ gstin: string, legalName?: string, tradeName?: string }`
- **Response**: The created GSTIN object.

### 8. `DELETE /api/gstins/:id`
- **Purpose**: Delete a client GSTIN.
- **Response**: `{ success: true }`

### 9. `POST /api/gstins/:id/connect`
- **Purpose**: Request GSP OTP to link the GSTIN.
- **Body**: `{ username: string }` (GSTN portal username)
- **Response**: `{ requestId: "uuid" }` (Needed for verification)

### 10. `POST /api/gstins/:id/verify-otp`
- **Purpose**: Verify GSP OTP.
- **Body**: `{ otp: string, requestId: string }`
- **Response**: `{ success: true }`

## Dashboard & Analytics

### 11. `GET /api/dashboard/summary`
- **Purpose**: Get high-level summary for the dashboard home page.
- **Response**: Total GSTINs, reconciled count, pending count, ITC recovered, and upcoming deadlines.

### 12. `GET /api/analytics/itc-summary` & `GET /api/analytics/supplier-health`
- **Purpose**: Data for charts and tables on the Reports page.

## Reconciliation Core

### 13. `GET /api/gstr2b/:gstin/:period`
- **Purpose**: Check if 2B is already fetched or trigger a fetch.

### 14. `POST /api/reconcile`
- **Purpose**: Start a new reconciliation job. File upload via FormData or pre-uploaded URL.
- **Body**: FormData with `file`, `gstinId`, `period`
- **Response**: `{ jobId: "uuid" }` (Frontend redirects to `/dashboard/reconcile/:jobId`)

### 15. `GET /api/reconcile/:jobId`
- **Purpose**: Polled every 2s to get job status (e.g., `processing`, `completed`, `error`).

### 16. `GET /api/reconcile/:jobId/results`
- **Purpose**: Fetch the reconciliation results table (Paginated/TanStack Virtual).
- **Query Params**: `?tab=matched|mismatch|missing_2b|missing_books`
- **Response**: Array of invoice matches with status colors (green, amber, red, blue).

### 17. `GET /api/reconcile/history`
- **Purpose**: Get past jobs.
- **Query Params**: `?gstin=&period=&page=`
- **Response**: Paginated list of jobs.

## Supplier Follow-ups & 3B

### 18. `GET /api/follow-ups` & `POST /api/follow-ups/draft` & `POST /api/follow-ups/send`
- **Purpose**: Manage and send automated supplier reminders (WhatsApp/Email) for missing invoices.

### 19. `GET /api/gstr3b/draft/:jobId` & `POST /api/gstr3b/file`
- **Purpose**: Fetch pre-filled Table 4 for GSTR-3B and submit it to the portal.

## Billing & Settings

### 20. `GET /api/billing/plan` & `GET /api/billing/invoices`
- **Purpose**: Subscription management details.

### 21. `GET|PATCH /api/settings`
- **Purpose**: CA Firm profile, ERP presets (Tally/Zoho column mapping).

### 22. `POST /api/team/invite`
- **Purpose**: Invite staff (Admin/Viewer).
