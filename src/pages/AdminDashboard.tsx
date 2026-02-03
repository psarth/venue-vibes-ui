import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Users, Building2, Calendar, Settings,
  TrendingUp, DollarSign, BarChart3, ChevronRight, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PlatformStats {
  totalUsers: number;
  totalOwners: number;
  totalVenues: number;
  totalBookings: number;
  totalRevenue: number;
  serviceFee: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalOwners: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    convenienceFee: 5,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'venues' | 'bookings' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchPlatformStats();
    }
  }, [user, userRole]);

  const fetchPlatformStats = async () => {
    // Fetch venues count
    const { count: venuesCount } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true });

    // Fetch convenience fee
    const { data: feeData } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'convenience_fee_percent')
      .maybeSingle();

    setStats(prev => ({
      ...prev,
      totalVenues: venuesCount || 0,
      convenienceFee: feeData ? parseFloat(feeData.value) : 5,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-primary">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'bg-primary/10 text-primary',
      trend: '+15%'
    },
    { 
      label: 'Venue Owners', 
      value: stats.totalOwners, 
      icon: Building2, 
      color: 'bg-success/10 text-success',
      trend: '+8%'
    },
    { 
      label: 'Active Venues', 
      value: stats.totalVenues, 
      icon: Building2, 
      color: 'bg-warning/10 text-warning',
      trend: '+12%'
    },
    { 
      label: 'Platform Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-secondary/10 text-secondary',
      trend: '+25%'
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'venues' as const, label: 'Venues', icon: Building2 },
    { id: 'bookings' as const, label: 'Bookings', icon: Calendar },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-secondary text-secondary-foreground shadow-premium-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11 rounded-xl text-secondary-foreground hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold font-display flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </h1>
              <p className="text-xs opacity-80">Platform Management</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 py-3 overflow-x-auto no-scrollbar bg-card border-b border-border">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-secondary text-secondary-foreground shadow-premium-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="card-premium p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-success flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Platform Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Convenience Fee</span>
                  <span className="font-semibold">{stats.convenienceFee}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="font-semibold">--</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">API Status</span>
                  <span className="text-success font-semibold">Healthy</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Recent Activity</h3>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Activity log will appear here</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-premium"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="card-premium p-8 text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold font-display mb-2">User Management</h3>
              <p className="text-muted-foreground">Users list will appear here once there are registered users</p>
            </div>
          </div>
        )}

        {activeTab === 'venues' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-premium"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="card-premium p-8 text-center">
              <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold font-display mb-2">Venue Management</h3>
              <p className="text-muted-foreground">
                {stats.totalVenues === 0 
                  ? 'No venues registered yet' 
                  : `${stats.totalVenues} venues registered`}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="card-premium p-8 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold font-display mb-2">All Bookings</h3>
            <p className="text-muted-foreground">Platform-wide bookings will appear here</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Platform Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Convenience Fee</p>
                      <p className="text-sm text-muted-foreground">Platform fee charged on each booking</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{stats.convenienceFee}%</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2 h-11 rounded-xl">
                    Update Fee
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send booking confirmations</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">Configure payment settings</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;