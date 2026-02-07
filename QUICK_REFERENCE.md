# Quick Reference: Role Separation System

## File Locations

```
src/
├── App.tsx                                  (MODIFIED - Added route protection)
├── contexts/
│   └── OwnerThemeContext.tsx               (NEW - Theme provider)
├── hooks/
│   ├── useAuth.tsx                         (Existing - Role management)
│   └── useRoleGuard.tsx                    (NEW - Role guards)
├── components/
│   └── OwnerNavigation.tsx                 (NEW - Owner nav bar)
└── pages/
    └── OwnerDashboard.tsx                  (MODIFIED - Complete refactor)
```

## How It Works (Simple)

```
User logs in → App.tsx checks role → Redirects to correct home page

Customer (role='user') → / (home page, light theme, customer nav)
Owner (role='owner')   → /owner (dashboard, dark theme, owner nav)
Admin (role='admin')   → /admin (panel, dark theme, admin nav)

If wrong role tries wrong route → Redirects to /auth
```

## Theme Colors

**Owner Dashboard Dark Navy**:
```javascript
const OWNER_THEME = {
  bg: {
    primary: '#0E1624',   // Main background
    surface: '#162238',   // Cards
  },
  text: {
    primary: '#FFFFFF',   // Main text
    secondary: '#B0C4DE', // Secondary text
  },
  accent: {
    blue: '#4DA3FF',      // Highlights
    green: '#22C55E',     // Available
    blocked: '#6B7280',   // Blocked
  }
}
```

## Using in New Pages

**To create a new owner page**:

```tsx
import { useOwnerGuard } from '@/hooks/useRoleGuard';
import { OwnerThemeProvider, useOwnerTheme } from '@/contexts/OwnerThemeContext';
import OwnerNavigation from '@/components/OwnerNavigation';

const OwnerSlotsContent = () => {
  const { isOwner, loading } = useOwnerGuard();
  const { theme } = useOwnerTheme();
  
  if (loading) return <LoadingSpinner />;
  if (!isOwner) return <AccessDenied />;
  
  return (
    <div style={{ backgroundColor: theme.colors.bg.primary }}>
      {/* Your content */}
      <OwnerNavigation />
    </div>
  );
};

export default function OwnerSlots() {
  return (
    <OwnerThemeProvider>
      <OwnerSlotsContent />
    </OwnerThemeProvider>
  );
}
```

## Testing Credentials

| Role | Email | Password | Route |
|------|-------|----------|-------|
| Customer | customer@demo.com | demo123 | / |
| Owner | owner@demo.com | demo123 | /owner |
| Admin | admin@demo.com | demo123 | /admin |

## Key Hooks

**useOwnerGuard()**
```tsx
const { isOwner, loading } = useOwnerGuard();
// Redirects non-owners to /auth
// Use at top of owner pages
```

**useOwnerTheme()**
```tsx
const { theme } = useOwnerTheme();
// Access dark navy tokens
// Must be inside <OwnerThemeProvider>
// Use: theme.colors.bg.primary, theme.colors.accent.blue, etc
```

## Route Protection (App.tsx)

```tsx
<Route path="/" element={<CustomerOnlyRoute element={<Index />} />} />
<Route path="/owner" element={<OwnerOnlyRoute element={<OwnerDashboard />} />} />
<Route path="/admin" element={<AdminOnlyRoute element={<AdminDashboard />} />} />
```

## Common Tasks

### Task 1: Add a new owner page

1. Create file: `src/pages/OwnerXXX.tsx`
2. Import: `useOwnerGuard`, `OwnerThemeProvider`, `useOwnerTheme`
3. Add guard: `const { isOwner, loading } = useOwnerGuard();`
4. Add provider wrapper: `<OwnerThemeProvider><Content /></OwnerThemeProvider>`
5. Update App.tsx: Add route `<Route path="/owner/xxx" element={<OwnerOnlyRoute element={<OwnerXXX />} />} />`
6. Update OwnerNavigation.tsx: Add tab if needed

### Task 2: Check if user is owner

```tsx
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { userRole } = useAuth();
  
  if (userRole === 'owner') {
    // Owner-specific logic
  }
};
```

### Task 3: Apply dark theme to element

```tsx
const { theme } = useOwnerTheme();

<div style={{
  backgroundColor: theme.colors.bg.surface,
  color: theme.colors.text.primary,
  borderColor: theme.colors.accent.border,
}}>
```

### Task 4: Manually redirect based on role

```tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  useEffect(() => {
    if (userRole === 'owner') {
      navigate('/owner');
    } else if (userRole === 'user') {
      navigate('/');
    }
  }, [userRole]);
};
```

## Debugging

**Q: Owner is seeing customer theme?**
- Check: Is component wrapped in `<OwnerThemeProvider>`?
- Check: Is theme being applied via `style` attribute?
- Check: No Tailwind classes overriding inline styles?

**Q: Customer can access /owner?**
- Check: Is route wrapped in `<OwnerOnlyRoute>`?
- Check: Is `useOwnerGuard()` called in component?
- Check: Browser cache cleared?

**Q: Navigation not showing?**
- Check: Is `<OwnerNavigation />` rendered at bottom?
- Check: Is z-index correct (should be z-40)?
- Check: Enough bottom padding on content (pb-24)?

**Q: Role guard not redirecting?**
- Check: Is component using `const { isOwner, loading } = useOwnerGuard();`?
- Check: Is check being done BEFORE rendering JSX?
- Check: Is `if (!isOwner) return <Navigate to="/auth" />;`?

## Performance Tips

1. **Memoize theme** to avoid re-renders:
```tsx
const theme = useMemo(() => useOwnerTheme().theme, []);
```

2. **Lazy load owner pages** in App.tsx:
```tsx
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
```

3. **Cache role checks**:
```tsx
const isOwner = useMemo(() => userRole === 'owner', [userRole]);
```

## Security Reminders

- ✅ Always check role at route level (App.tsx)
- ✅ Always check role at component level (useOwnerGuard)
- ✅ Always show loading state while checking
- ✅ Always redirect to /auth on invalid role
- ✅ Never render sensitive UI without role check
- ✅ Never trust client-side role for sensitive operations
- ✅ Backend should also verify role on API calls

## Files to Update When Adding New Owner Feature

1. `App.tsx` - Add route
2. `src/pages/NewFeature.tsx` - Create page with guards
3. `OwnerNavigation.tsx` - Add tab if needed
4. `COMPLETION_REPORT.md` - Update docs
5. `TESTING_GUIDE.md` - Add test cases

---

**Need help?** See:
- ROLE_SEPARATION.md - Full architecture
- TESTING_GUIDE.md - Test cases
- ARCHITECTURE_DIAGRAMS.md - Visual guides
- IMPLEMENTATION_SUMMARY.md - What was changed
