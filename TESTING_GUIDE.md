# Testing Guide: Role Separation & Owner Dashboard

## Quick Start

### Launch the app:
```bash
cd c:\Users\23sar\venue-vibes-ui
bun run dev
```

App runs on: **http://localhost:8080**

---

## Test Suite 1: Authentication & Auto-Redirect

### Test 1.1: Customer Login Auto-Redirects to Home
```
1. Open http://localhost:8080/auth
2. Click "Customer Demo" button
3. Credentials: customer@demo.com / demo123

EXPECTED:
✅ Login succeeds
✅ Page redirects to http://localhost:8080/
✅ Customer UI appears (venue listing, teal theme)
```

### Test 1.2: Owner Login Auto-Redirects to Dashboard
```
1. Open http://localhost:8080/auth
2. Click "Owner Demo" button
3. Credentials: owner@demo.com / demo123

EXPECTED:
✅ Login succeeds
✅ Page redirects to http://localhost:8080/owner
✅ Owner dashboard appears (dark navy theme)
```

### Test 1.3: Admin Login Auto-Redirects to Admin Panel
```
1. Open http://localhost:8080/auth
2. Click "Admin Demo" button
3. Credentials: admin@demo.com / demo123

EXPECTED:
✅ Login succeeds
✅ Page redirects to http://localhost:8080/admin
✅ Admin panel appears (dark purple theme)
```

---

## Test Suite 2: Role-Based Route Protection

### Test 2.1: Customer Cannot Access Owner Dashboard
```
1. Login as customer@demo.com
2. You're at http://localhost:8080/
3. Manually type in browser: http://localhost:8080/owner
4. Press Enter

EXPECTED:
✅ Route rejects access
✅ Redirects to http://localhost:8080/auth
✅ Shows "Please sign in" message
```

### Test 2.2: Owner Auto-Redirects from Home Page
```
1. Login as owner@demo.com
2. You're at http://localhost:8080/owner
3. Manually type in browser: http://localhost:8080/
4. Press Enter

EXPECTED:
✅ Route recognizes owner role
✅ Auto-redirects back to http://localhost:8080/owner
✅ Stays on owner dashboard
```

### Test 2.3: Customer Cannot Access Admin Panel
```
1. Login as customer@demo.com
2. You're at http://localhost:8080/
3. Manually type in browser: http://localhost:8080/admin
4. Press Enter

EXPECTED:
✅ Route rejects access
✅ Redirects to http://localhost:8080/auth
```

---

## Test Suite 3: Theme Verification

### Test 3.1: Owner Dashboard Has Dark Navy Theme
```
1. Login as owner@demo.com
2. You're at http://localhost:8080/owner
3. Right-click → Inspect Element
4. Check <div> with main content

EXPECTED:
✅ Background color is #0E1624 (deep navy)
✅ Text color is #FFFFFF (white)
✅ Card surfaces are #162238 (lighter navy)
✅ Accents are #4DA3FF (ice blue)
✅ Absolutely NO light colors
```

### Test 3.2: Customer Page Has Light Teal Theme
```
1. Logout (sign out button)
2. Login as customer@demo.com
3. You're at http://localhost:8080/
4. Right-click → Inspect Element
5. Check background color

EXPECTED:
✅ Background is light/white
✅ Primary accent is teal/cyan (#1BA6A6)
✅ Text is dark on light background
✅ Absolutely different from owner theme
```

### Test 3.3: Theme Tokens Cannot Be Overridden
```
1. Login as owner@demo.com
2. Open Developer Console (F12)
3. Try to inject CSS:
   document.body.style.backgroundColor = 'white';
4. Refresh page

EXPECTED:
✅ Page reloads with original dark theme
✅ Injected styles are overridden by React
✅ Cannot manually switch to light theme
```

---

## Test Suite 4: Navigation Isolation

### Test 4.1: Customer Sees Only Customer Navigation
```
1. Login as customer@demo.com
2. You're at http://localhost:8080/
3. Look at BOTTOM of screen

EXPECTED:
✅ See bottom navigation bar
✅ Contains: Home | Explore | Bookings | Profile
✅ NO owner features visible
✅ Can click "Profile" → goes to /profile
```

### Test 4.2: Owner Sees Only Owner Navigation
```
1. Login as owner@demo.com
2. You're at http://localhost:8080/owner
3. Look at BOTTOM of screen

EXPECTED:
✅ See bottom navigation bar
✅ Contains: Dashboard | Slots | Bookings | Earnings | More
✅ NO customer features visible (no "Home", "Explore")
✅ Current tab "Dashboard" is highlighted in blue
✅ Can click "Slots" → goes to /owner/slots (if built)
```

### Test 4.3: Owner Navigation Replaces Customer Nav
```
1. Login as customer@demo.com
2. Observe bottom navigation (customer nav)
3. Go to Profile → Click "Sign Out"
4. Login as owner@demo.com
5. Observe bottom navigation

EXPECTED:
✅ Navigation completely changed
✅ Old customer nav items gone
✅ New owner nav items present
✅ Different styling (dark navy vs light)
```

---

## Test Suite 5: Feature Isolation

### Test 5.1: Owner Cannot See Venue Listing
```
1. Login as owner@demo.com
2. You're at http://localhost:8080/owner
3. Look for:
   - Venue cards
   - Search filters
   - City selector
   - "Book Now" buttons

EXPECTED:
✅ NONE of these are visible
✅ Only see: Slot management, Revenue, Bookings
✅ No venue discovery UI anywhere
```

### Test 5.2: Customer Cannot See Slot Management
```
1. Login as customer@demo.com
2. You're at http://localhost:8080/
3. Look at bottom navigation
4. Try to access /owner/slots directly

EXPECTED:
✅ NO "Slots" tab in customer nav
✅ Manual URL access redirects to /auth
✅ Slot management UI is completely hidden
```

### Test 5.3: Owner Cannot Book Venues
```
1. Login as owner@demo.com
2. You're at http://localhost:8080/owner
3. Look for:
   - "Book Now" buttons
   - Venue detail pages
   - Booking flow
   - Payment screen

EXPECTED:
✅ NONE of these are visible
✅ Cannot access booking UI even via direct URL
```

---

## Test Suite 6: Role Guards (Component Level)

### Test 6.1: Fail-Safe Loading State
```
1. Login as owner@demo.com
2. Watch page load carefully

EXPECTED:
✅ Brief "Loading dashboard..." message appears
✅ Spinner shows for ~500ms
✅ Then dashboard loads with data
✅ Never shows error (since role is valid)
```

### Test 6.2: Invalid Role Shows Error Message
```
ADVANCED TEST (Requires code manipulation):
1. Open browser DevTools
2. Manually clear localStorage:
   localStorage.clear()
3. Refresh /owner page

EXPECTED:
✅ Shows "Access denied. Owner only." message
✅ Shows "Back to Login" button
✅ Dashboard doesn't render
✅ Cannot access owner features
```

---

## Test Suite 7: Multi-Tab Session Isolation

### Test 7.1: Owner Cannot Spoof Customer Tab
```
1. Tab A: Login as owner@demo.com
2. Tab B: Login as customer@demo.com
3. In Tab A (owner), type: http://localhost:8080/
4. Press Enter

EXPECTED:
✅ Route checks current session
✅ Recognizes owner role (not customer)
✅ Auto-redirects to /owner
✅ Cannot access customer page
```

### Test 7.2: Customer Cannot Spoof Owner Tab
```
1. Tab A: Login as customer@demo.com
2. Tab B: Login as owner@demo.com
3. In Tab A (customer), type: http://localhost:8080/owner
4. Press Enter

EXPECTED:
✅ Route checks current session
✅ Recognizes customer role (not owner)
✅ Redirects to /auth
✅ Cannot access owner dashboard
```

---

## Test Suite 8: Logout & Re-Login Role Switch

### Test 8.1: Logout Clears Role
```
1. Login as owner@demo.com
2. Click "Sign Out" button
3. You're back at /auth page
4. Try to access /owner directly

EXPECTED:
✅ Shows "Please sign in" message
✅ Redirects to /auth
✅ Role is cleared from session
```

### Test 8.2: Role Switch via Re-Login
```
1. Login as owner@demo.com
2. You're at /owner (owner dashboard)
3. Click "Sign Out"
4. Login as customer@demo.com
5. You should be at / (home page)

EXPECTED:
✅ Correctly switches roles
✅ Auto-redirects to correct home page
✅ Navigation changes from owner to customer
✅ Theme changes from dark navy to light teal
```

---

## Test Suite 9: Edge Cases

### Test 9.1: Direct URL Access Without Login
```
1. Don't login
2. Type: http://localhost:8080/owner
3. Press Enter

EXPECTED:
✅ No user session exists
✅ useOwnerGuard() detects this
✅ Redirects to /auth
✅ Shows login form
```

### Test 9.2: Session Expires (Logout)
```
1. Login as owner@demo.com
2. Right-click → Inspect
3. Find localStorage
4. Delete "demoUser" entry
5. Refresh page

EXPECTED:
✅ Page recognizes no session
✅ Shows "Access denied. Owner only."
✅ Offers "Back to Login" button
```

### Test 9.3: Rapid Role Switching
```
1. Open 2 tabs
2. Tab A: Login as owner
3. Tab B: Login as customer
4. Click links rapidly between tabs

EXPECTED:
✅ Each tab maintains its own role
✅ Routes redirect correctly per tab
✅ No cross-contamination
✅ Theme stays correct per tab
```

---

## Performance Tests

### Test P1: Theme Provider Doesn't Cause Re-renders
```
1. Login as owner@demo.com
2. Open DevTools → Performance tab
3. Start recording
4. Scroll through dashboard content
5. Stop recording

EXPECTED:
✅ No excessive re-renders
✅ Smooth 60fps scrolling
✅ Theme provider doesn't cause lag
```

---

## Visual Inspection Checklist

- [ ] Owner dashboard background is deep navy (#0E1624)
- [ ] Owner dashboard text is white (#FFFFFF)
- [ ] Owner dashboard cards have surface navy (#162238)
- [ ] Owner dashboard accents are ice blue (#4DA3FF)
- [ ] Owner dashboard has NO white backgrounds
- [ ] Owner dashboard has NO light colors
- [ ] Owner navigation shows 5 tabs (Dashboard/Slots/Bookings/Earnings/More)
- [ ] Owner navigation is dark themed
- [ ] Customer page has light/teal theme
- [ ] Customer navigation is completely different
- [ ] No customer UI appears in owner dashboard
- [ ] No owner UI appears in customer pages
- [ ] Loading state appears briefly on page load
- [ ] No console errors logged
- [ ] No TypeScript errors in IDE

---

## Bug Report Template

If you find issues, test and document:

```
ROLE SEPARATION TEST FAILURE

Test Case: [Test number from above, e.g., 2.1]
Test Name: [Test name]

Steps to Reproduce:
1. [First action]
2. [Second action]
3. [etc]

Expected Behavior:
- [What should happen]

Actual Behavior:
- [What actually happened]

Screenshots: [Include if relevant]

Browser: [Chrome/Firefox/Safari]
OS: [Windows/Mac/Linux]
```

---

## Success Criteria

All tests PASS if:
- ✅ No customer sees owner features
- ✅ No owner sees customer features
- ✅ No admin sees customer/owner features
- ✅ Theme is correctly isolated per role
- ✅ Navigation is correctly isolated per role
- ✅ All routes redirect properly
- ✅ No errors in console
- ✅ No TypeScript errors
- ✅ Smooth user experience
- ✅ Clear error messages on invalid access

**Status**: Ready for testing ✅
