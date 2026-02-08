import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// PAGE IMPORTS
import FindPlayer from "@/pages/FindPlayer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerVenue from "./pages/OwnerVenue";
import OwnerSlots from "./pages/OwnerSlots";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerAnalytics from "./pages/OwnerAnalytics";
import OwnerPayouts from "./pages/OwnerPayouts";
import OwnerSettings from "./pages/OwnerSettings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVenues from "./pages/AdminVenues";
import AdminBookings from "./pages/AdminBookings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminRevenue from "./pages/AdminRevenue";
import AdminCustomers from "@/pages/AdminCustomers";
import AdminReviews from "@/pages/AdminReviews";
import AdminMore from "./pages/AdminMore";
import AdminVenueApprovals from "./pages/AdminVenueApprovals";
import SyncDemo from "./pages/SyncDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Role-based route protectors
const CustomerOnlyRoute = ({ element }: { element: React.ReactElement }) => {
  const { userRole, loading, user, demoUser } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // If user is logged in and has admin/owner role, redirect to their dashboard
  if ((user || demoUser) && userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if ((user || demoUser) && userRole === 'owner') {
    return <Navigate to="/owner" replace />;
  }

  // Allow access for customers or unauthenticated users
  return element;
};

const OwnerOnlyRoute = ({ element }: { element: React.ReactElement }) => {
  const { userRole, loading, user, demoUser } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // Require authentication and owner role
  if (!user && !demoUser) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'owner') {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

const AdminOnlyRoute = ({ element }: { element: React.ReactElement }) => {
  const { userRole, loading, user, demoUser } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // Require authentication and admin role
  if (!user && !demoUser) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

const AuthenticatedRoute = ({ element }: { element: React.ReactElement }) => {
  const { loading, user, demoUser } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!user && !demoUser) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div style={{ backgroundColor: '#F4FBFB', minHeight: '100vh' }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* CUSTOMER ROUTES */}
              <Route path="/" element={<CustomerOnlyRoute element={<Index />} />} />
              <Route path="/profile" element={<AuthenticatedRoute element={<Profile />} />} />
              <Route path="/bookings" element={<CustomerOnlyRoute element={<MyBookings />} />} />
              <Route path="/find-player" element={<AuthenticatedRoute element={<FindPlayer />} />} />

              {/* OWNER ROUTES - Protected from customer/admin access */}
              <Route path="/owner" element={<OwnerOnlyRoute element={<OwnerDashboard />} />} />
              <Route path="/owner/venue" element={<OwnerOnlyRoute element={<OwnerVenue />} />} />
              <Route path="/owner/slots" element={<OwnerOnlyRoute element={<OwnerSlots />} />} />
              <Route path="/owner/bookings" element={<OwnerOnlyRoute element={<OwnerBookings />} />} />
              <Route path="/owner/analytics" element={<OwnerOnlyRoute element={<OwnerAnalytics />} />} />
              <Route path="/owner/payouts" element={<OwnerOnlyRoute element={<OwnerPayouts />} />} />
              <Route path="/owner/settings" element={<OwnerOnlyRoute element={<OwnerSettings />} />} />

              {/* ADMIN ROUTES - Protected from customer/owner access */}
              <Route path="/admin" element={<AdminOnlyRoute element={<AdminDashboard />} />} />
              <Route path="/admin/venues" element={<AdminOnlyRoute element={<AdminVenues />} />} />
              <Route path="/admin/bookings" element={<AdminOnlyRoute element={<AdminBookings />} />} />
              <Route path="/admin/analytics" element={<AdminOnlyRoute element={<AdminAnalytics />} />} />
              <Route path="/admin/revenue" element={<AdminOnlyRoute element={<AdminRevenue />} />} />
              <Route path="/admin/customers" element={<AdminOnlyRoute element={<AdminCustomers />} />} />
              <Route path="/admin/approvals" element={<AdminOnlyRoute element={<AdminVenueApprovals />} />} />
              <Route path="/admin/reviews" element={<AdminOnlyRoute element={<AdminReviews />} />} />

              {/* AUTH - Available to all */}
              <Route path="/auth" element={<Auth />} />

              {/* SYNC DEMO - Available to all for testing */}
              <Route path="/sync-demo" element={<SyncDemo />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
