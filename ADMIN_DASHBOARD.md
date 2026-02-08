# Admin Dashboard - Enterprise Implementation

## Overview
The Admin Dashboard is an enterprise-grade platform control center with strict role isolation, professional dark theme, and comprehensive venue/owner management capabilities.

## Architecture

### Role Isolation
- **CRITICAL PROTECTION**: Only users with `userRole === 'admin'` can access
- Multi-layer failsafe guards:
  1. Route-level protection via `AdminOnlyRoute`
  2. Component-level role verification
  3. Real-time role check before any admin action
- Automatic redirect to `/auth` if non-admin attempts access

### Theme System
**Professional SaaS Dark Theme** (via `AdminThemeContext.tsx`)
```tsx
Colors:
- Primary Background: #0B0F1A (Near-black)
- Surface: #121829 (Slightly lighter)
- Text Primary: #FFFFFF (White)
- Text Secondary: #9CA3AF (Gray)
- Accent Primary: #60A5FA (Blue)
- Accent Secondary: #A78BFA (Purple)
- Success: #22C55E (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Borders: rgba(255,255,255,0.08) (Subtle)
```

## Dashboard Structure

### 1. Header Section
- Dashboard title with subtitle
- Real-time admin indicator
- Sign-out button with loading state

### 2. Platform Metrics (2x2 Grid)
- **Bookings Today**: Real-time booking count
- **Revenue Today**: Daily platform revenue in ₹
- **Active Venues**: Total operational venues
- **Failed Bookings**: System failure tracking

### 3. Venue Management
- **List View**: All venues with status badges
  - Status: Pending | Approved | Suspended
  - Owner information
  - Slot utilization (booked/total)
- **Actions**: 
  - Approve pending venues
  - Suspend approved venues
  - Reactivate suspended venues
- **Data Density**: 5-10 venues visible per view

### 4. Owner Management
- **List View**: All venue owners with details
  - Name & email
  - KYC Status (Pending | Approved | Rejected)
  - Venue count
  - Payout eligibility indicator
- **Actions**:
  - Approve KYC applications
  - Suspend/activate accounts
  - Initiate payouts for eligible owners
- **Account Status**: Active/Inactive indicators

### 5. Recent Bookings
- **Display**: Last 10 bookings with key info
  - Venue name
  - Customer name & time slot
  - Amount (₹)
  - Status badges (Confirmed | Completed | Cancelled)
- **Focus**: Read-only monitoring (no booking actions)

### 6. Revenue & Payouts
- Quick-access card to revenue reports
- Links to detailed settlement history
- Owner payout management

## Bottom Navigation
6-item navigation bar (mobile-first):
1. **📊 Overview** - Main dashboard (`/admin`)
2. **🏟️ Venues** - Venue management (`/admin/venues`)
3. **👥 Owners** - Owner management (`/admin/owners`)
4. **📅 Bookings** - Booking analytics (`/admin/bookings`)
5. **💰 Revenue** - Revenue reports (`/admin/revenue`)
6. **⚙️ More** - Settings/advanced (`/admin/more`)

Active tab highlighted with blue background + border.

## Key Features

### Data Presentation
- **Mobile-First Design**: Optimized for small screens
- **Data-Dense Layout**: Maximum information visibility
- **Color-Coded Status**: Instant visual recognition
- **Touch-Friendly**: Large tap targets (44px minimum)

### Security Features
```tsx
// Multi-layer protection example:
const AdminOnlyRoute = ({ element }) => {
  const { userRole, loading } = useAuth();
  
  if (loading) return <LoadingState />;
  if (userRole !== 'admin') {
    return <Navigate to="/auth" replace />;
  }
  return element;
};

// Plus component-level check:
if (userRole !== 'admin') {
  return <AccessDenied />;
}
```

### Action Sheets
- Bottom sheet modals for sensitive actions
- Confirmation buttons with clear visual hierarchy
- Close button for cancellation

## State Management
Uses React hooks for:
- `selectedVenue` / `selectedOwner`: Current selection
- `showVenueActions` / `showOwnerActions`: Sheet visibility
- `loading`: Async operation states

## Mock Data
Production-ready mock data structure:
```tsx
interface Venue {
  id: string;
  name: string;
  owner: string;
  status: 'pending' | 'approved' | 'suspended';
  slots: number;
  bookings: number;
}

interface Owner {
  id: string;
  name: string;
  email: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  venueCount: number;
  status: 'active' | 'inactive';
  payoutEligibility: boolean;
}

interface Booking {
  id: string;
  venueName: string;
  customerName: string;
  slotTime: string;
  amount: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  date: string;
}
```

## Integration Points

### Auth Hook
```tsx
const { signOut, user, userRole, loading } = useAuth();
```
- `userRole`: 'admin' | 'owner' | 'user'
- Auto-enforced in App.tsx routes

### API Endpoints (To Be Implemented)
```
GET  /api/admin/metrics        → Platform stats
GET  /api/admin/venues         → Venue list
GET  /api/admin/venues/:id     → Venue details
PATCH /api/admin/venues/:id    → Venue actions
GET  /api/admin/owners         → Owner list
GET  /api/admin/owners/:id     → Owner details
PATCH /api/admin/owners/:id    → Owner actions
GET  /api/admin/bookings       → Booking list
GET  /api/admin/revenue        → Revenue data
```

## Testing Admin Access

### Demo Credentials
```
Email: admin@demo.com
Password: demo123
Role: admin
```

### Manual Testing
1. Login as admin at `/auth`
2. Redirects to `/admin` automatically
3. Try accessing `/admin` as customer → redirects to `/`
4. Try accessing `/admin` as owner → redirects to `/owner`

### Verification Checklist
- [ ] Role check passes for admin users
- [ ] Non-admin users redirected immediately
- [ ] All metric cards display correctly
- [ ] Venue list shows with status badges
- [ ] Owner list shows with KYC indicators
- [ ] Booking list displays read-only
- [ ] Action sheets appear on selection
- [ ] Bottom navigation highlights active page
- [ ] Sign-out works properly
- [ ] Theme colors apply correctly

## Future Enhancements

1. **Real Data Integration**
   - Connect to Supabase backend
   - Real-time metrics with auto-refresh
   - Websocket updates for live activity

2. **Advanced Filtering**
   - Filter venues by status/city
   - Filter owners by KYC status
   - Filter bookings by date range

3. **Bulk Actions**
   - Multi-select venues
   - Batch approval/suspension
   - Bulk owner management

4. **Analytics**
   - Revenue charts and graphs
   - Booking trends
   - Owner performance metrics

5. **Admin Settings**
   - Fee configuration
   - Payout settings
   - Dispute resolution

6. **Notifications**
   - Real-time alerts for critical events
   - Admin notification center
   - Email/SMS integration

## File Structure
```
src/
├── pages/
│   └── AdminDashboard.tsx          # Main admin dashboard
├── components/
│   └── AdminNavigation.tsx         # Bottom navigation
├── contexts/
│   └── AdminThemeContext.tsx       # Theme provider
└── hooks/
    └── useAuth.tsx                 # Auth with role support
```

## Notes
- Dashboard uses 100% inline styles (no CSS classes for dynamic colors)
- All colors derived from AdminThemeContext
- Responsive grid layouts for mobile/tablet
- SVG icons from lucide-react
- Action handlers ready for backend integration
