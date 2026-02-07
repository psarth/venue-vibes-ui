import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { Calendar, DollarSign, Users2, Building2, Loader2, TrendingUp, IndianRupee, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface PlatformStats {
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  totalVenues: number;
  platformEarnings: number;
  growthRate: number;
}

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { colors } = useAdminTheme();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  if (userRole !== 'admin') {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStats({
        totalBookings: 2847,
        totalRevenue: 2450000,
        totalCustomers: 1247,
        totalVenues: 45,
        platformEarnings: 294000,
        growthRate: 23.5
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Platform Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2" style={{ color: colors.text.secondary }}>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading dashboard...
          </div>
        </div>
      </AdminLayout>
    );
  }

  const quickActions = [
    {
      title: 'Venue Verification',
      description: 'Approve new venue requests',
      icon: Shield,
      path: '/admin/approvals',
      color: 'red'
    },
    {
      title: 'Venue Management',
      description: 'Manage venues and owners',
      icon: Building2,
      path: '/admin/venues',
      color: 'blue'
    },
    {
      title: 'Revenue Tracking',
      description: 'Monitor platform earnings',
      icon: TrendingUp,
      path: '/admin/revenue',
      color: 'green'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed insights',
      icon: TrendingUp,
      path: '/admin/analytics',
      color: 'purple'
    },
    {
      title: 'Customer Insights',
      description: 'Understand user behavior',
      icon: Users2,
      path: '/admin/customers',
      color: 'yellow'
    }
  ];

  const getActionColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40';
      case 'green': return 'from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40';
      case 'purple': return 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40';
      case 'yellow': return 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40';
      case 'red': return 'from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40';
      default: return 'from-gray-500/10 to-gray-600/5 border-gray-500/20 hover:border-gray-500/40';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'yellow': return 'text-yellow-400';
      case 'red': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <AdminLayout title="Platform Dashboard">
      <div className="space-y-4 lg:space-y-6">
        {/* Welcome Section */}
        <div className="p-4 lg:p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>Welcome to VenueVibes Admin</h2>
          <p className="text-sm lg:text-base" style={{ color: colors.text.secondary }}>Monitor and manage your sports booking platform with powerful insights and controls.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-blue-500/5 to-blue-600/10" style={{ borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium truncate" style={{ color: colors.text.secondary }}>Total Bookings</p>
                <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>
                  {stats?.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs lg:text-sm">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" />
              <span className="text-green-400 font-medium">+{stats?.growthRate}%</span>
              <span className="truncate" style={{ color: colors.text.secondary }}>vs last month</span>
            </div>
          </div>

          <div className="p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-green-500/5 to-green-600/10" style={{ borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-green-500/10 rounded-lg">
                <IndianRupee className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium truncate" style={{ color: colors.text.secondary }}>Platform Revenue</p>
                <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>
                  ₹{stats?.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs lg:text-sm">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" />
              <span className="text-green-400 font-medium">₹{stats?.platformEarnings.toLocaleString()}</span>
              <span className="truncate" style={{ color: colors.text.secondary }}>platform earnings</span>
            </div>
          </div>

          <div className="p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-purple-500/5 to-purple-600/10" style={{ borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-purple-500/10 rounded-lg">
                <Users2 className="h-5 w-5 lg:h-6 lg:w-6 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium truncate" style={{ color: colors.text.secondary }}>Total Customers</p>
                <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>
                  {stats?.totalCustomers.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs lg:text-sm">
              <Users2 className="h-3 w-3 lg:h-4 lg:w-4 text-purple-400" />
              <span className="text-purple-400 font-medium">892</span>
              <span className="truncate" style={{ color: colors.text.secondary }}>active users</span>
            </div>
          </div>

          <div className="p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-yellow-500/5 to-yellow-600/10" style={{ borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-yellow-500/10 rounded-lg">
                <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium truncate" style={{ color: colors.text.secondary }}>Active Venues</p>
                <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>
                  {stats?.totalVenues}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs lg:text-sm">
              <Building2 className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">38</span>
              <span className="truncate" style={{ color: colors.text.secondary }}>high performers</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.text.primary }}>Quick Actions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`p-4 lg:p-6 rounded-xl border bg-gradient-to-br ${getActionColor(action.color)} transition-all duration-200 text-left hover:scale-[1.02] touch-manipulation`}
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 bg-black/10 rounded-lg">
                      <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${getIconColor(action.color)}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold mb-1 text-sm lg:text-base" style={{ color: colors.text.primary }}>
                        {action.title}
                      </h4>
                      <p className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Health */}
        <div className="p-4 lg:p-6 rounded-xl border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.text.primary }}>Platform Health</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
              </div>
              <p className="font-semibold text-sm lg:text-base" style={{ color: colors.text.primary }}>Excellent</p>
              <p className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>Booking Growth</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users2 className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
              </div>
              <p className="font-semibold text-sm lg:text-base" style={{ color: colors.text.primary }}>High</p>
              <p className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>User Engagement</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 lg:h-8 lg:w-8 text-purple-400" />
              </div>
              <p className="font-semibold text-sm lg:text-base" style={{ color: colors.text.primary }}>Stable</p>
              <p className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>Venue Network</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function AdminDashboard() {
  return (
    <AdminThemeProvider>
      <AdminDashboardContent />
    </AdminThemeProvider>
  );
}