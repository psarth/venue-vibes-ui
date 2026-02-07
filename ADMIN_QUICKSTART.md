# Admin Dashboard - Quick Start Guide

## Access the Admin Dashboard

### Step 1: Login as Admin
1. Navigate to http://localhost:8080/auth
2. Click **"Admin Demo"** button (blue shield icon)
3. Pre-filled with:
   - Email: `admin@demo.com`
   - Password: `demo123`
4. Click **Sign In**

### Step 2: You're In! 🎉
- Automatically redirected to `/admin`
- See dashboard with metrics, venues, owners, bookings

## Dashboard Tour

### Platform Metrics (Top Section)
4 stat cards showing:
- **Bookings Today**: 47 bookings
- **Revenue Today**: ₹28,450
- **Active Venues**: 23 venues
- **Failed Bookings**: 2 failures

### Venue Management
Scrollable list of venues. Click any to:
- View owner name
- See approval status (Pending/Approved/Suspended)
- Check slot utilization (6/8 booked)
- Take action (Approve/Suspend/Reactivate)

**Example Venues:**
- PowerPlay Badminton (Rajesh Kumar) - Approved, 6/8 slots
- SportHub Arena (Priya Singh) - Approved, 9/12 slots
- Championship Court (Amit Patel) - Pending, 0/10 slots

### Owner Management
Scrollable list of venue owners. Click any to:
- View email address
- See KYC approval status
- Check venue count
- See if eligible for payouts
- Take action (Approve KYC/Suspend/Payout)

**Example Owners:**
- Rajesh Kumar - KYC Approved, 2 venues, ✓ Payout Ready
- Amit Patel - KYC Pending, 1 venue
- Neha Sharma - KYC Rejected, Inactive

### Recent Bookings
Read-only feed of latest bookings:
- Venue name
- Customer name & time slot
- Amount in ₹
- Status (Confirmed/Completed/Cancelled)

### Revenue & Payouts Card
Quick link to detailed revenue reports and payout settings.

## Navigation

### Bottom Navigation Bar
6 buttons always visible (swipe or tap):

| Icon | Label | Route | Status |
|------|-------|-------|--------|
| 📊 | Overview | /admin | Current page |
| 🏟️ | Venues | /admin/venues | Coming soon |
| 👥 | Owners | /admin/owners | Coming soon |
| 📅 | Bookings | /admin/bookings | Coming soon |
| 💰 | Revenue | /admin/revenue | Coming soon |
| ⚙️ | More | /admin/more | Coming soon |

Active page has blue highlight + border.

## Common Actions

### Approve a Pending Venue
1. Find "Championship Court" (status: Pending)
2. Tap the card → Bottom sheet opens
3. Tap **Approve Venue** button
4. Confirmation happens (in real implementation)

### Suspend an Approved Venue
1. Find "PowerPlay Badminton" (status: Approved)
2. Tap the card → Bottom sheet opens
3. Tap **Suspend Venue** button

### Approve KYC for Owner
1. Find "Amit Patel" (KYC Status: Pending)
2. Tap the card → Bottom sheet opens
3. Tap **Approve KYC** button

### Initiate Payout
1. Find "Rajesh Kumar" (has ✓ Payout Ready)
2. Tap the card → Bottom sheet opens
3. Tap **Initiate Payout** button

### Sign Out
1. Tap logout icon (↪️) in top-right of header
2. Redirected to `/auth`
3. Can login again or choose different role

## What's Different from Other Views?

### vs. Customer View (/)
- Admin sees **all venues** & **all owners**
- No booking functionality
- Focus on **management & control**
- **Platform metrics** instead of search
- **Role-protected** - customers can't access

### vs. Owner View (/owner)
- Admins see **all owners** & their accounts
- Admins can **suspend accounts** & **manage KYC**
- Admins can **approve/suspend venues**
- Admins have **revenue insights**
- Admin view is **read-mostly** (just actions)

## Mobile Experience

- Full-screen dark theme (professional SaaS)
- Bottom navigation never scrolls away
- Cards are touch-optimized (44px+ targets)
- Sheet modals slide up from bottom
- Color-coded status at a glance
- No horizontal scrolling needed

## What's "Coming Soon"?

These pages exist in routing but need implementation:
- `/admin/venues` - Dedicated venue management
- `/admin/owners` - Dedicated owner management
- `/admin/bookings` - Booking analytics
- `/admin/revenue` - Revenue reports & payouts
- `/admin/more` - Settings & admin tools

Current `/admin` (Overview) has full functionality.

## Security Features

✅ **Admin-Only Access**
- Try logging in as customer or owner
- They'll be redirected, can't access `/admin`
- Only `userRole === 'admin'` works

✅ **Session Management**
- Logout clears all auth data
- Login required to access again
- Role stored securely in auth context

✅ **Data Isolation**
- Admin sees platform-wide data
- Different from customer/owner views
- No cross-role data leakage

## Troubleshooting

**Q: "Access denied" message?**
A: You're not logged in as admin. Use the Admin Demo button on `/auth` page.

**Q: Bottom navigation not showing?**
A: Scroll to bottom of page. Navigation is fixed at bottom.

**Q: Action buttons don't work?**
A: They're currently connected to mock handlers. Backend integration needed for real actions.

**Q: Colors look wrong?**
A: Make sure your device isn't in light mode. This dashboard is dark-theme only.

## Next Steps

1. **Test the flows**: Try each action to see the UI respond
2. **Review mock data**: Check venues, owners, and bookings
3. **Plan backend**: Design API endpoints for real data
4. **Implement sub-pages**: Build `/admin/venues`, `/admin/owners`, etc.
5. **Add real metrics**: Connect to database for live stats
6. **Set up notifications**: Alert admins to critical events

## Demo Data

### Venues (5 total)
- PowerPlay Badminton (Approved)
- SportHub Arena (Approved)
- Championship Court (Pending)
- Elite Sports Club (Suspended)
- Pro Badminton Hub (Approved)

### Owners (5 total)
- Rajesh Kumar (KYC Approved, 2 venues)
- Priya Singh (KYC Approved, 1 venue)
- Amit Patel (KYC Pending, 1 venue)
- Neha Sharma (KYC Rejected, Inactive)
- Vikram Desai (KYC Approved, 1 venue)

### Bookings (4 recent)
- Today: 2 confirmed (₹450, ₹550)
- Yesterday: 1 completed, 1 cancelled

---

**Ready to explore?** Start at http://localhost:8080/auth and click "Admin Demo"! 🚀
