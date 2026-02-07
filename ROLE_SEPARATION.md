# Role-Based Access Control & Owner Dashboard

## Overview
This application enforces **strict role-based access control** to ensure:
- ✅ Customers ONLY see customer features (home, booking, profile, my bookings)
- ✅ Owners ONLY see owner features (dashboard, slots, earnings)
- ✅ Admins ONLY see admin features (approvals dashboard)
- ❌ NO cross-role navigation or feature bleed

## Architecture

### 1. Authentication & Role Management

**User Roles**: `'user' | 'owner' | 'admin'`

Located in: [src/hooks/useAuth.tsx](src/hooks/useAuth.tsx)

Demo credentials:
```
Customer: customer@demo.com / demo123 → Route: /
Owner:    owner@demo.com / demo123 → Route: /owner
Admin:    admin@demo.com / demo123 → Route: /admin
```

### 2. Role Guards (Route Protection)

**File**: [src/hooks/useRoleGuard.tsx](src/hooks/useRoleGuard.tsx)

Three hooks enforce role-specific access:

```tsx
// Use in owner-only pages
const { isOwner, loading } = useOwnerGuard();
if (!isOwner) return <Navigate to="/auth" />;

// Use in customer-only pages  
const { isCustomer, loading } = useCustomerGuard();
if (!isCustomer) return <Navigate to="/auth" />;

// Use in admin-only pages
const { isAdmin, loading } = useAdminGuard();
if (!isAdmin) return <Navigate to="/auth" />;
```

### 3. App-Level Route Protection

**File**: [src/App.tsx](src/App.tsx)

Routes are wrapped in role-checking components:

```tsx
<Route path="/" element={<CustomerOnlyRoute element={<Index />} />} />
<Route path="/owner" element={<OwnerOnlyRoute element={<OwnerDashboard />} />} />
<Route path="/admin" element={<AdminOnlyRoute element={<AdminDashboard />} />} />
```

**Auto-redirect behavior**:
- Owner tries `/` → Redirects to `/owner`
- Customer tries `/owner` → Redirects to `/auth`
- Admin tries `/` → Redirects to `/admin`

### 4. Owner Theme Enforcement

**File**: [src/contexts/OwnerThemeContext.tsx](src/contexts/OwnerThemeContext.tsx)

Owner pages use **DARK NAVY THEME** (cannot fall back to customer light theme):

```tsx
const OWNER_THEME = {
  colors: {
    bg: {
      primary: '#0E1624',   // Deep navy
      surface: '#162238',   // Card surfaces
      secondary: '#1a2640', // Lighter navy
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0C4DE',  // Steel blue
      muted: '#7B8FA3',      // Muted text
    },
    accent: {
      blue: '#4DA3FF',       // Accent blue
      green: '#22C55E',      // Available/success
      blocked: '#6B7280',    // Blocked/grey
      border: 'rgba(255,255,255,0.08)',
    },
  },
};
```

**Applied via OwnerThemeProvider wrapper**:
```tsx
<OwnerThemeProvider>
  <OwnerDashboard />
</OwnerThemeProvider>
```

### 5. Owner-Only Navigation

**File**: [src/components/OwnerNavigation.tsx](src/components/OwnerNavigation.tsx)

Bottom navigation bar REPLACES customer nav when role=`owner`:

```
Dashboard | Slots | Bookings | Earnings | More
```

**Key**: Sticky bottom with active state highlighting (blue accent #4DA3FF)

### 6. Owner Dashboard

**File**: [src/pages/OwnerDashboard.tsx](src/pages/OwnerDashboard.tsx)

**Multi-layer role enforcement**:

1. **Route Guard** - `useOwnerGuard()` redirects non-owners
2. **Loading State** - Shows spinner while role is verified
3. **Fail-safe Check** - If `isOwner !== true`, shows "Access denied" message
4. **Theme Lock** - Dark theme applied via `useOwnerTheme()`

**Content (Owner-specific ONLY)**:
- ✅ Slot status management (color-coded: green/blue/grey)
- ✅ Today's revenue & payout
- ✅ Quick actions (block/unblock slots)
- ✅ Today's bookings list
- ❌ NO venue listing
- ❌ NO booking flow
- ❌ NO customer navigation

## Testing Role Separation

### Test 1: Owner Auto-Redirect
```
1. Login as owner@demo.com
2. Try to access http://localhost:8080/
   → Should redirect to /owner
```

### Test 2: Customer Cannot Access Owner
```
1. Login as customer@demo.com
2. Try to access http://localhost:8080/owner
   → Should redirect to /auth (forbidden)
```

### Test 3: Admin Cannot Access Customer
```
1. Login as admin@demo.com
2. Try to access http://localhost:8080/
   → Should redirect to /admin (forbidden)
```

### Test 4: Theme Verification
```
1. Login as owner@demo.com
2. Check /owner page
   → Background should be deep navy (#0E1624)
   → Text should be white
   → Accents should be blue (#4DA3FF)
   → Should NOT use customer light theme colors
```

### Test 5: Navigation Replacement
```
1. Login as owner@demo.com
2. Check bottom navigation
   → Should show: Dashboard | Slots | Bookings | Earnings | More
   → Should NOT show customer nav items
```

## Failure Cases (Protected)

| Scenario | Current Behavior | Protected? |
|----------|------------------|-----------|
| Owner accesses / | Redirects to /owner | ✅ Yes |
| Customer accesses /owner | Redirects to /auth | ✅ Yes |
| Admin accesses / | Redirects to /admin | ✅ Yes |
| Non-authenticated user accesses /owner | Redirects to /auth | ✅ Yes |
| Owner tries to book a venue | Not visible in nav | ✅ Yes |
| Customer sees owner nav | Not visible in nav | ✅ Yes |

## Security Checklist

- ✅ Route-level protection (App.tsx)
- ✅ Component-level guards (useOwnerGuard hook)
- ✅ Theme isolation (OwnerThemeProvider)
- ✅ Navigation isolation (OwnerNavigation replaces customer nav)
- ✅ No style bleed between roles
- ✅ Fail-safe loading state
- ✅ Redirect on unauthorized access
- ✅ Role verification on each page load

## Files Modified/Created

**New Files**:
- `src/contexts/OwnerThemeContext.tsx` - Theme provider & tokens
- `src/hooks/useRoleGuard.tsx` - Role protection hooks
- `src/components/OwnerNavigation.tsx` - Owner-only bottom nav

**Modified Files**:
- `src/App.tsx` - Added role-based route protection
- `src/pages/OwnerDashboard.tsx` - Added role guard, theme provider, navigation
- `src/hooks/useAuth.tsx` - Already had role system (unchanged)

## Future Enhancements

- [ ] Add owner-specific pages: /owner/slots, /owner/bookings, /owner/earnings, /owner/more
- [ ] Implement role permissions matrix for fine-grained access control
- [ ] Add audit logging for role-based access
- [ ] Create role switcher for testing (dev-only)
