# Third-Party Integrations Roadmap
_Planned for Mindy Munchs — Shiprocket + Zoho_

---

## Shiprocket (Logistics & Shipping)

### Full API Capabilities

| Feature | What it does |
|---|---|
| Order creation | Push an order to Shiprocket, get AWB (tracking number) assigned |
| Courier recommendation | Auto-select best courier based on pincode, weight, cost |
| Pickup scheduling | Schedule a pickup from your warehouse |
| Label & manifest generation | Generate shipping labels and daily manifests |
| Live shipment tracking | Real-time status — picked up, in transit, out for delivery, delivered |
| Tracking webhook | Shiprocket pushes status updates to your backend automatically |
| NDR management | Handle non-delivery reports (failed deliveries, returns) |
| Return orders | Reverse logistics — customer initiates return, Shiprocket picks up |
| Rate calculator | Get shipping cost estimate by pincode + weight before quoting |
| Pincode serviceability | Check if a delivery pincode is serviceable |
| Channel integration | Connect Amazon, Flipkart, Blinkit orders into one dashboard |

---

## Zoho (Business Operations)

### Zoho CRM

| Feature | What it does |
|---|---|
| Lead capture | Every new user/newsletter signup becomes a CRM lead |
| Contact management | Full customer profile — orders, interactions, lifetime value |
| Deal tracking | Track B2B leads (distributors, bulk buyers) through a pipeline |
| Email campaigns | Send targeted offers to customer segments |
| Automation workflows | Auto-assign follow-ups, send welcome sequences |

### Zoho Inventory

| Feature | What it does |
|---|---|
| Stock sync | Keep Zoho inventory in sync with your DB stock levels |
| Purchase orders | Manage raw material procurement |
| Multi-warehouse | Track stock across locations |
| Low stock alerts | Auto-alert when SKUs go below threshold |

### Zoho Books (Accounting)

| Feature | What it does |
|---|---|
| Invoice generation | Auto-create GST invoice on every order |
| Payment reconciliation | Match Razorpay payments to invoices automatically |
| GST returns | Generate GSTR-1/GSTR-3B data |
| Expense tracking | Log packaging, shipping, marketing costs |

### Zoho Desk (Customer Support)

| Feature | What it does |
|---|---|
| Ticket creation | Customer complaints/queries become support tickets |
| Order context in tickets | Agent sees full order history while handling a ticket |
| SLA management | Set response time targets |

---

## Recommended Implementation Plan

### Phase 1 — Integrate First (High Impact)

**Shiprocket**
- [ ] Auto-create shipment when admin marks order as "confirmed" — pushes to Shiprocket, gets AWB
- [ ] Live tracking in user dashboard — real-time status from order detail page
- [ ] Tracking webhooks — Shiprocket auto-updates order status in DB (delivered, failed, returned)
- [ ] Pincode serviceability check on checkout — validate before payment
- [ ] NDR handling — admin notified on failed delivery

**Zoho Books**
- [ ] Auto-generate GST invoice on every successful Razorpay order
- [ ] Razorpay payment reconciliation — match payments to invoices automatically

### Phase 2 — Add Soon

**Zoho CRM**
- [ ] Sync every new registered user as a CRM contact
- [ ] Log each order against the contact for lifetime value tracking
- [ ] Add newsletter subscribers as CRM leads

**Shiprocket**
- [ ] Return order flow — customer requests return from dashboard, Shiprocket schedules reverse pickup

### Phase 3 — Later

- [ ] Zoho Desk — customer support ticket system
- [ ] Zoho Inventory — procurement and multi-warehouse tracking
- [ ] Shiprocket rate calculator — show shipping cost estimate on cart page

---

## Files to Create/Modify When Implementing

### Shiprocket
- `backend/services/shiprocketService.js` — API auth, order push, tracking fetch
- `backend/controllers/shiprocketController.js` — webhook handler, manual trigger endpoints
- `backend/routes/shiprocket.js` — route definitions
- `backend/controllers/orderController.js` — trigger shipment creation on status update
- `frontend/src/pages/UserDashboard.jsx` — add tracking status + AWB to order cards
- `frontend/src/components/OrderCard.jsx` — show tracking timeline
- `backend/.env` — add `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`

### Zoho Books
- `backend/services/zohoService.js` — OAuth token management, invoice creation
- `backend/controllers/zohoController.js` — invoice trigger, webhook handler
- `backend/routes/zoho.js` — route definitions
- `backend/controllers/paymentController.js` — trigger invoice after `verifyPayment`
- `backend/.env` — add `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ORG_ID`

### Zoho CRM
- `backend/services/zohoService.js` — extend with CRM contact/lead methods
- `backend/controllers/authController.js` — sync contact on register
- `backend/controllers/paymentController.js` — log order activity against CRM contact

---

## Environment Variables Needed

```env
# Shiprocket
SHIPROCKET_EMAIL=your@email.com
SHIPROCKET_PASSWORD=your_password

# Zoho (Books + CRM share the same OAuth app)
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ORG_ID=
ZOHO_CRM_BASE_URL=https://www.zohoapis.in/crm/v2
ZOHO_BOOKS_BASE_URL=https://www.zohoapis.in/books/v3
```

---

_Last updated: 2026-07-11_
