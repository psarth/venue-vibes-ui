## Role Separation Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION ENTRY POINT                             │
│                            (src/App.tsx)                                    │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │ AuthProvider (Role Check)
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼───────┐         ┌────▼────────┐         ┌────▼────────┐
    │ CUSTOMER    │         │   OWNER     │         │    ADMIN    │
    │  ROUTES     │         │   ROUTES    │         │   ROUTES    │
    └────┬───────┘         └────┬────────┘         └────┬────────┘
         │                      │                      │
         │                      │                      │
    ┌────▼──────────────┐   ┌───▼────────────────┐  ┌─▼──────────────┐
    │CustomerOnlyRoute  │   │OwnerOnlyRoute      │  │AdminOnlyRoute  │
    │ (Redirects Owner) │   │(Redirects Customer)│  │(Redirects Non) │
    └────┬──────────────┘   └───┬────────────────┘  └─┬──────────────┘
         │                      │                     │
    ┌────▼──────────────┐   ┌───▼────────────────┐  ┌─▼──────────────┐
    │ Index.tsx         │   │OwnerDashboard.tsx  │  │AdminDashboard  │
    │ Profile.tsx       │   │  (LIGHT THEME)     │  │  (PURPLE)      │
    │ MyBookings.tsx    │   │                    │  │                │
    │ (TEAL THEME)      │   │ With Guards:       │  │ With Guards:   │
    │                   │   │ 1. useOwnerGuard() │  │ 1. useAdminGuard()
    │ With Customer Nav │   │ 2. Loading state   │  │ 2. Loading state
    └───────────────────┘   │ 3. Fail-safe check │  │ 3. Fail-safe   │
                            │ 4. Theme Provider  │  └────────────────┘
                            │ 5. Owner Nav       │
                            └────┬───────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │OwnerThemeProvider      │
                    │ (DARK NAVY ENFORCED)   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │ OwnerDashboardContent  │
                    │                        │
                    ├─ Header               │
                    ├─ Summary Cards        │
                    ├─ Slot Management      │
                    ├─ Today's Bookings     │
                    ├─ Payout Summary       │
                    │                       │
                    └─ OwnerNavigation      │
                      (BOTTOM BAR)          │
                      ├─ Dashboard          │
                      ├─ Slots              │
                      ├─ Bookings           │
                      ├─ Earnings           │
                      └─ More               │
                                 │
                    ┌────────────┴────────────┐
                    │  RENDER OWNER UI       │
                    │  (Dark Navy Theme)     │
                    │  (Owner Features Only) │
                    └────────────────────────┘
```

## Role Access Matrix

```
┌──────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Feature      │ Customer        │ Owner           │ Admin           │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Home Page    │ ✅ Can access   │ ❌ Auto-redirect│ ❌ Auto-redirect│
│              │ /               │ to /owner       │ to /admin       │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Owner Dash   │ ❌ Forbidden    │ ✅ Can access   │ ❌ Forbidden    │
│              │ redirects to    │ /owner          │ redirects to    │
│              │ /auth           │                 │ /auth           │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Admin Dash   │ ❌ Forbidden    │ ❌ Forbidden    │ ✅ Can access   │
│              │ redirects to    │ redirects to    │ /admin          │
│              │ /auth           │ /auth           │                 │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Theme        │ Light/Teal      │ Dark Navy       │ Dark Purple     │
│              │ (#1BA6A6)       │ (#0E1624)       │                 │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Bottom Nav   │ Customer Nav    │ Owner Nav       │ Admin Nav       │
│              │ Home/Search     │ Dashboard/      │ Venues/Users    │
│              │ Profile/Booking │ Slots/Bookings/ │ Approvals       │
│              │                 │ Earnings/More   │                 │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Can Book     │ ✅ Yes          │ ❌ No           │ ❌ No           │
│ Venues       │                 │ (Not visible)   │ (Not visible)   │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Can Manage   │ ❌ No           │ ✅ Yes          │ ❌ No           │
│ Slots        │ (Not visible)   │ (Dashboard)     │ (Not visible)   │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Can Approve  │ ❌ No           │ ❌ No           │ ✅ Yes          │
│ Venues/Users │ (Not visible)   │ (Not visible)   │ (Dashboard)     │
└──────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## Data Flow on Login

```
┌─────────────────────────────┐
│ User submits credentials    │
└──────────────┬──────────────┘
               │
        ┌──────▼──────┐
        │ useAuth()   │
        │ demoLogin() │
        └──────┬──────┘
               │
        ┌──────▼──────────────────┐
        │ Match credentials       │
        │ Set userRole in auth    │
        │ Store in localStorage   │
        └──────┬──────────────────┘
               │
    ┌──────────┴──────────┐
    │ Redirect based role │
    └──────────┬──────────┘
               │
    ┌──────────┴──────────────────────┐
    │                                  │
    ▼                                  ▼
Role="user"                    Role="owner"
    │                                  │
    ▼                                  ▼
Navigate("/")              Navigate("/owner")
    │                                  │
    ▼                                  ▼
Index.tsx                  OwnerDashboard.tsx
(Customer UI)              (Owner UI)
    │                                  │
    ▼                                  ▼
PremiumNavbar         OwnerThemeProvider
PremiumVenueCard      (Dark Navy Theme)
PremiumVenueDetail         │
    │                      ▼
    ▼                OwnerDashboardContent
Light Teal Theme    OwnerNavigation
```

## Protection Flow on Invalid Route

```
User tries /owner (Customer logged in)
            │
            ▼
    App.tsx Router
            │
            ▼
    <OwnerOnlyRoute>
            │
            ▼
    Check: userRole === 'owner'?
            │
    ┌───────┴────────┐
    │ NO             │ YES
    ▼                ▼
Navigate        Render
to /auth        OwnerDashboard
    │
    ▼
Redirect loop
prevented
```

## Theme Application Layers

```
┌─────────────────────────────────────────────────────┐
│ src/App.tsx (No theme here - role split)            │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ Customer Routes     │
        │ (No wrapper)        │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ PremiumNavbar (imports tailwind)│
        │ Default: Light/Teal via CSS     │
        └─────────────────────────────────┘

        ┌──────────────────────────────────────────┐
        │ Owner Routes                             │
        │ <OwnerThemeProvider>  ◄─── ENFORCED!    │
        └──────────────┬───────────────────────────┘
                       │
        ┌──────────────▼────────────────────────────┐
        │ <OwnerDashboardContent>                  │
        │ Wrapped in theme context                │
        │ All colors use: theme.colors.bg.*        │
        │ theme.colors.text.*                      │
        │ theme.colors.accent.*                    │
        │                                          │
        │ Result: GUARANTEED dark navy             │
        │ NO light theme possible                  │
        └──────────────────────────────────────────┘
```

## Fail-Safe Execution Path

```
OwnerDashboard.tsx Component Load
            │
            ▼
    ┌───────────────────┐
    │ Check: loading?   │
    └───┬───────────┬───┘
        │ YES       │ NO
        │           │
        ▼           ▼
    Loading     ┌───────────────────┐
    Spinner     │ Check: isOwner?   │
                └───┬────────────┬───┘
                    │ NO         │ YES
                    │            │
                    ▼            ▼
              Access       ┌──────────────┐
              Denied       │ Render Owner │
              Message      │ Dashboard    │
                           │ (Dark Theme) │
                           └──────────────┘
```
