# Mindy Munchs — Bug Audit Report
_Generated: 2026-07-11_

---

## 🔴 CRITICAL

### C-01 — Google OAuth payload is always undefined
**File:** `frontend/src/pages/Auth.jsx:117`  
**Bug:** `credentialResponse.userData` is never populated by `@react-oauth/google`. The backend always receives `undefined` and returns 400.  
**Fix:** Use `jwtDecode(credentialResponse.credential)` to extract user fields, then send `{ credential: credentialResponse.credential }` to the backend.

---

### C-02 — Password login crashes for Google accounts (HTTP 500)
**File:** `backend/controllers/authController.js` → `login`  
**Bug:** `user.comparePassword()` throws an exception when the user has no password (Google accounts). No guard exists before calling it.  
**Fix:** Before calling `comparePassword`, check `if (user.authProvider === 'google') return 400 with message "Please sign in with Google"`.

---

### C-03 — Token refresh accepts any expired JWT forever
**File:** `backend/controllers/authController.js` → `refreshToken`  
**Bug:** `{ ignoreExpiration: true }` means a stolen token from any point in the past can generate a fresh 7-day JWT indefinitely — no revocation.  
**Fix:** Add a `refreshTokenExpiry` field to the User model and reject refresh requests older than 30 days.

---

### C-04 — Google access token audience never validated
**File:** `backend/controllers/authController.js` → `verifyGoogleAccessToken`  
**Bug:** The `tokeninfo` response's `audience` field is never compared to `GOOGLE_CLIENT_ID`, so a token from any Google-integrated app passes authentication.  
**Fix:** Add `if (tokenInfo.data.aud !== process.env.GOOGLE_CLIENT_ID) return 401`.

---

### C-05 — Forgot password leaks which emails are registered
**File:** `backend/controllers/authController.js` → `forgotPassword`  
**Bug:** Returns HTTP 404 if the email isn't found — allows attackers to enumerate registered emails.  
**Fix:** Always return 200 with "If this email exists, a reset link has been sent."

---

### C-06 — OAuth redirect embeds JWT in URL
**File:** `backend/controllers/authController.js` → `googleCallback`  
**Bug:** JWT token is embedded in the redirect URL — exposed in browser history, server logs, and Referer headers.  
**Fix:** Use a short-lived one-time code in the URL and exchange it for the JWT in a POST request.

---

## 🟠 HIGH

### H-01 — Google sign-in silently overwrites password accounts
**File:** `backend/controllers/authController.js` → `verifyGoogleToken / verifyGoogleAccessToken`  
**Bug:** If a user registered with email/password and then signs in with Google using the same email, `authProvider` is silently overwritten — permanently locking them out of password login.  
**Fix:** If `existingUser.authProvider === 'local'`, return an error prompting the user to log in with their password instead.

---

### H-02 — `changePassword` crashes for Google users (HTTP 500)
**File:** `backend/controllers/authController.js` → `changePassword`  
**Bug:** Same unguarded `comparePassword` call as C-02 — Google users have no password hash, causing a crash.  
**Fix:** Add `if (user.authProvider === 'google') return 400 "Google accounts cannot change password"`.

---

### H-03 — Stock decremented at order creation, not payment confirmation
**File:** `backend/controllers/orderController.js`  
**Bug:** Inventory is reduced when the order is created, not when payment is confirmed. Failed/abandoned Razorpay payments permanently consume stock.  
**Fix:** Move stock decrement to the payment webhook handler (`/api/payment/webhook`) after `payment.captured` event.

---

### H-04 — `/auth/demo-login` publicly accessible in production
**File:** `backend/routes/auth.js:88`  
**Bug:** Demo login endpoint can create/access admin accounts in production with no environment guard.  
**Fix:** Wrap with `if (process.env.NODE_ENV !== 'development') return 404`.

---

### H-05 — `addItemLocally` permanently sets `isGuest: true` for logged-in users
**File:** `frontend/src/store/cartStore.js` → `addItemLocally`  
**Bug:** When the backend cart API fails for an authenticated user, `addItemLocally` sets `isGuest: true`, permanently breaking backend cart sync for that session.  
**Fix:** Only set `isGuest: true` if `!localStorage.getItem('token')`.

---

### H-06 — `useOrders` effect dependency array has a runtime expression
**File:** `frontend/src/hooks/useOrders.js:49`  
**Bug:** A runtime expression in the `useEffect` dependency array means the effect may not re-run when the user changes, showing stale orders.  
**Fix:** Use a stable value (e.g. `user?._id`) as the dependency.

---

### H-07 — `register` response returns full Mongoose document
**File:** `backend/controllers/authController.js` → `register`  
**Bug:** Full user document returned (including `isActive`, `authProvider`, `__v`) instead of a whitelisted subset like the `login` endpoint uses.  
**Fix:** Return only `{ _id, name, email, role }` from the register response.

---

### H-08 — Token source inconsistency + logout doesn't clear localStorage
**File:** `frontend/src/store/authStore.js` → `logout`, `frontend/src/hooks/useOrders.js`, `frontend/src/store/cartStore.js`  
**Bug:** `useOrders` reads token from Zustand store; cart reads from `localStorage`. `logout()` clears Zustand state but never calls `localStorage.removeItem('token')` — stale tokens persist across sessions.  
**Fix:** Add `localStorage.removeItem('token')` inside `logout()`.

---

## 🟡 MEDIUM

### M-01 — Razorpay amount not rounded to integer
**File:** `frontend/src/utils/razorpayUtils.js`  
**Bug:** Amount in paise may be a float (e.g. `550.5 * 100 = 55050.000000001`). Razorpay rejects non-integer amounts.  
**Fix:** `Math.round(amount * 100)`.

---

### M-02 — Promo discount calculated only on frontend
**File:** `frontend/src/pages/Cart.jsx` / `Checkout.jsx`  
**Bug:** Promo code discount is calculated client-side and sent to the backend as-is. A user can manipulate the discount amount in the request.  
**Fix:** Backend should recalculate and validate the discount from the promo code before creating the order.

---

### M-03 — `alert()` used in forgot-password modal
**File:** `frontend/src/pages/Auth.jsx` ~line 340  
**Bug:** Native `alert()` dialog blocks the browser and looks unprofessional. Also blocks the Razorpay extension (as noted in CLAUDE.md).  
**Fix:** Replace with inline success/error message in the modal UI.

---

### M-04 — `ProtectedRoute` `adminOnly` prop doesn't work correctly
**File:** `frontend/src/components/ProtectedRoute.jsx`  
**Bug:** `adminOnly` boolean is passed but `requiredRole` is derived incorrectly — the admin check falls back to a separate `isUserAdmin` computed value instead.  
**Fix:** Explicitly check `user?.role === 'admin'` when `adminOnly` is true.

---

### M-05 — Five Footer nav links produce 404s
**File:** `frontend/src/components/Footer.jsx`  
**Bug:** The following hrefs don't match actual routes:
- `/aboutus` → should be `/about`
- `/returns` → no route defined
- `/shipping-policy` → should be `/shipping`
- `/privacy-policy` → should be `/privacy`
- `/terms-and-conditions` → should be `/terms`

---

### M-06 — Duplicate newsletter form logic
**File:** `frontend/src/components/Footer.jsx` + `frontend/src/components/NewsletterSignup.jsx`  
**Bug:** Newsletter subscription logic is duplicated in two places with separate state and fetch calls — bugs fixed in one won't apply to the other.  
**Fix:** Use `<NewsletterSignup />` component inside `Footer.jsx` and remove the inline duplicate.

---

### M-07 — Star ratings hardcoded to 5 stars
**File:** `frontend/src/components/ProductCard.jsx`  
**Bug:** Renders 5 filled stars regardless of actual product rating data.  
**Fix:** Use `product.rating` or `product.averageRating` to render the correct count.

---

### M-08 — No 404 / Not Found route defined
**File:** `frontend/src/App.jsx`  
**Bug:** Unknown routes render a blank page with no feedback to the user.  
**Fix:** Add `<Route path="*" element={<NotFound />} />` at the end of the route tree.

---

## 🔵 LOW

### L-01 — `console.log` statements in production code
**Files:** `frontend/src/hooks/useOrders.js` (lines 13, 22, 23, 34, 42), `frontend/src/store/cartStore.js` (image transformation log)  
**Bug:** Debug logs leak cart and order data. The App.jsx production override suppresses `console.log` at runtime but the esbuild `drop` only applies to the production build — these run in development and staging.  
**Fix:** Remove all debug `console.log` statements.

---

### L-02 — `/payment-test` route publicly accessible
**File:** `frontend/src/App.jsx`  
**Bug:** Dev-only Razorpay test page has no auth guard — accessible by anyone in production.  
**Fix:** Wrap with `<ProtectedRoute adminOnly />` or remove entirely before production deploy.

---

### L-03 — `inviteStore` manages admin invites client-side only
**File:** `frontend/src/store/inviteStore.js`  
**Bug:** Admin invite tokens are generated and validated purely in `localStorage` — trivially forgeable.  
**Fix:** Generate and validate invite tokens server-side.

---

### L-04 — `Home.jsx` and `ProductDetail.jsx` are 45–57 KB each
**File:** `frontend/src/pages/Home.jsx`, `frontend/src/pages/ProductDetail.jsx`  
**Bug:** Oversized components hurt maintainability and initial parse time.  
**Fix:** Extract sections into sub-components (e.g. `<HeroSection>`, `<BestsellerSection>`, `<TestimonialsSection>`).

---

### L-05 — `Add to Cart` button uses non-brand colour
**File:** `frontend/src/components/ProductCard.jsx`  
**Bug:** Uses `bg-green-600` instead of `btn-primary` or brand token.  
**Fix:** Replace with `btn-primary` class.

---

### L-06 — Session secret hardcoded as fallback
**File:** `backend/server.js:45`  
**Bug:** `secret: process.env.SESSION_SECRET || 'mindy-munchs-secret-key-change-in-production'` — if `SESSION_SECRET` is missing in production, a known hardcoded secret is used.  
**Fix:** Remove the fallback and let the existing `process.exit(1)` guard handle it (it already does for `NODE_ENV=production`).

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 6 |
| 🟠 High | 8 |
| 🟡 Medium | 8 |
| 🔵 Low | 6 |
| **Total** | **28** |

**Recommended priority order:**
1. C-02, H-01, H-02 — Google/password login collision (most likely to affect real users now)
2. H-08 — Token/logout bug
3. M-05 — Footer 404 links
4. C-05 — Email enumeration
5. H-03 — Stock/payment timing
6. C-01 — Fix Google OAuth payload
