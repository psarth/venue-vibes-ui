import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Users, Building2, Calendar, Settings,
  TrendingUp, DollarSign, BarChart3, ChevronRight, Search, Filter,
  Download, IndianRupee, Activity, UserCheck, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PlatformStats {
  totalUsers: number;
  totalOwners: number;
  totalVenues: number;
  totalBookings: number;
  totalRevenue: number;
  serviceFee: number;
}

// Mock data
const revenueData = [
  { name: 'Jan', revenue: 125000 },
  { name: 'Feb', revenue: 148000 },
  { name: 'Mar', revenue: 162000 },
  { name: 'Apr', revenue: 175000 },
  { name: 'May', revenue: 198000 },
  { name: 'Jun', revenue: 215000 },
];

const sportDistribution = [
  { name: 'Badminton', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Football', value: 28, color: 'hsl(var(--success))' },
  { name: 'Cricket', value: 22, color: 'hsl(var(--warning))' },
  { name: 'Tennis', value: 15, color: 'hsl(var(--secondary))' },
];

const recentUsers = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', date: '2 hours ago' },
  { id: '2', name: 'Priya Patel', email: 'priya@example.com', role: 'owner', date: '5 hours ago' },
  { id: '3', name: 'Amit Kumar', email: 'amit@example.com', role: 'user', date: '1 day ago' },
];

const recentVenues = [
  { id: '1', name: 'PowerPlay Arena', owner: 'Sports Corp', sport: 'Badminton', status: 'active' },
  { id: '2', name: 'Goal Rush Turf', owner: 'Turf Masters', sport: 'Football', status: 'active' },
  { id: '3', name: 'Smash Zone', owner: 'Play Hub', sport: 'Badminton', status: 'pending' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading, demoUser } = useAuth();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalOwners: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    serviceFee: 5,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'venues' | 'bookings' | 'settings' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      // Allow demo admin
      if (!demoUser || demoUser.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, userRole, loading, navigate, demoUser]);

  useEffect(() => {
    if ((user && userRole === 'admin') || (demoUser && demoUser.role === 'admin')) {
      fetchPlatformStats();
    }
  }, [user, userRole, demoUser]);

  const fetchPlatformStats = async () => {
    // Demo data for demo admin
    if (demoUser?.role === 'admin') {
      setStats({
        totalUsers: 1247,
        totalOwners: 86,
        totalVenues: 142,
        totalBookings: 8456,
        totalRevenue: 2854000,
        serviceFee: 5,
      });
      return;
    }

    // Fetch venues count
    const { count: venuesCount } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true });

    // Fetch service fee
    const { data: feeData } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'service_fee_percent')
      .maybeSingle();

    setStats(prev => ({
      ...prev,
      totalVenues: venuesCount || 0,
      serviceFee: feeData ? parseFloat(feeData.value) : 5,
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
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: 'bg-primary/10 text-primary',
      trend: '+15%'
    },
    { 
      label: 'Venue Owners', 
      value: stats.totalOwners, 
      icon: UserCheck, 
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
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, 
      icon: IndianRupee, 
      color: 'bg-secondary/10 text-secondary',
      trend: '+25%'
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'venues' as const, label: 'Venues', icon: Building2 },
    { id: 'bookings' as const, label: 'Bookings', icon: Calendar },
    { id: 'reports' as const, label: 'Reports', icon: Download },
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
              <p className="text-xs opacity-80">
                {demoUser ? 'Demo Mode' : 'Platform Management'}
              </p>
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

            {/* Revenue Chart */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Revenue Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorAdminRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--secondary))" 
                      fillOpacity={1} 
                      fill="url(#colorAdminRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Health */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Platform Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Service Charge</span>
                  <span className="font-semibold">{stats.serviceFee}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="font-semibold">{stats.totalBookings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-success/10">
                  <span className="text-sm text-muted-foreground">API Status</span>
                  <span className="text-success font-semibold flex items-center gap-1">
                    <Activity className="h-4 w-4" /> Healthy
                  </span>
                </div>
              </div>
            </div>

            {/* Sport Distribution */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Venue Distribution</h3>
              <div className="flex items-center gap-4">
                <div className="h-32 w-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sportDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        dataKey="value"
                      >
                        {sportDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {sportDistribution.map((sport) => (
                    <div key={sport.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: sport.color }} />
                        <span className="text-sm">{sport.name}</span>
                      </div>
                      <span className="text-sm font-medium">{sport.value}%</span>
                    </div>
                  ))}
                </div>
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

            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Recent Users</h3>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'owner' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{user.date}</p>
                    </div>
                  </div>
                ))}
              </div>
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

            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Venue Management</h3>
              <div className="space-y-3">
                {recentVenues.map((venue) => (
                  <div key={venue.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{venue.name}</p>
                        <p className="text-xs text-muted-foreground">{venue.owner} • {venue.sport}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venue.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {venue.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="card-premium p-4">
            <h3 className="font-semibold font-display mb-3">All Bookings</h3>
            <div className="space-y-3">
              {[
                { ref: 'SP260203-ABC123', venue: 'PowerPlay Arena', amount: '₹450', status: 'confirmed' },
                { ref: 'SP260203-DEF456', venue: 'Goal Rush Turf', amount: '₹1,800', status: 'confirmed' },
                { ref: 'SP260203-GHI789', venue: 'Smash Zone', amount: '₹350', status: 'cancelled' },
              ].map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div>
                    <p className="font-mono text-sm font-medium">{booking.ref}</p>
                    <p className="text-xs text-muted-foreground">{booking.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{booking.amount}</p>
                    <span className={`text-xs ${
                      booking.status === 'confirmed' ? 'text-success' : 'text-destructive'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Export Reports</h3>
              <div className="space-y-3">
                {[
                  { name: 'Transaction Report', desc: 'All bookings and payments' },
                  { name: 'User Report', desc: 'User registrations and activity' },
                  { name: 'Venue Report', desc: 'Venue performance metrics' },
                  { name: 'Revenue Report', desc: 'Platform earnings breakdown' },
                ].map((report) => (
                  <button 
                    key={report.name}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-all"
                  >
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.desc}</p>
                    </div>
                    <Download className="h-5 w-5 text-primary" />
                  </button>
                ))}
              </div>
            </div>
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
                      <p className="font-medium">Service Charge</p>
                      <p className="text-sm text-muted-foreground">Platform fee charged on each booking</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{stats.serviceFee}%</span>
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
                      <p className="text-sm text-muted-foreground">Configure Razorpay settings</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-warning/30 bg-warning/5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium text-warning">Demo Mode Active</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Some features are limited in demo mode. Connect a real account for full access.
                      </p>
                    </div>
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
