import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Calendar, BarChart3, Settings, Plus, 
  TrendingUp, Users, DollarSign, Clock, ChevronRight, MapPin,
  CalendarDays, Layers, IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  BarChart,
  Bar,
} from 'recharts';

interface VenueStats {
  totalVenues: number;
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  sport: string;
  is_active: boolean;
}

// Mock analytics data
const revenueData = [
  { name: 'Mon', revenue: 4200 },
  { name: 'Tue', revenue: 3800 },
  { name: 'Wed', revenue: 5100 },
  { name: 'Thu', revenue: 4600 },
  { name: 'Fri', revenue: 6200 },
  { name: 'Sat', revenue: 8400 },
  { name: 'Sun', revenue: 7800 },
];

const bookingsData = [
  { hour: '6AM', bookings: 2 },
  { hour: '8AM', bookings: 5 },
  { hour: '10AM', bookings: 3 },
  { hour: '12PM', bookings: 4 },
  { hour: '2PM', bookings: 6 },
  { hour: '4PM', bookings: 8 },
  { hour: '6PM', bookings: 12 },
  { hour: '8PM', bookings: 10 },
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading, demoUser } = useAuth();
  const [stats, setStats] = useState<VenueStats>({
    totalVenues: 0,
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
  });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'bookings' | 'analytics' | 'calendar'>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!loading && (!user || userRole !== 'owner')) {
      // Allow demo owners
      if (!demoUser || demoUser.role !== 'owner') {
        navigate('/');
      }
    }
  }, [user, userRole, loading, navigate, demoUser]);

  useEffect(() => {
    if ((user && userRole === 'owner') || (demoUser && demoUser.role === 'owner')) {
      fetchOwnerData();
    }
  }, [user, userRole, demoUser]);

  const fetchOwnerData = async () => {
    // Demo data for demo owner
    if (demoUser?.role === 'owner') {
      setVenues([
        { id: '1', name: 'PowerPlay Badminton Arena', location: 'Indiranagar, Bangalore', sport: 'Badminton', is_active: true },
        { id: '2', name: 'Goal Rush Football Turf', location: 'Koramangala, Bangalore', sport: 'Football', is_active: true },
      ]);
      setStats({
        totalVenues: 2,
        totalBookings: 156,
        todayBookings: 12,
        totalRevenue: 285400,
      });
      return;
    }

    if (!user) return;

    // Fetch venues
    const { data: venuesData } = await supabase
      .from('venues')
      .select('id, name, location, sport, is_active')
      .eq('owner_id', user.id);

    if (venuesData) {
      setVenues(venuesData);
      setStats(prev => ({ ...prev, totalVenues: venuesData.length }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-primary">Loading...</div>
      </div>
    );
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, bookings: 0 });
    }
    
    // Add days of the month with mock booking data
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        bookings: Math.floor(Math.random() * 8) 
      });
    }
    
    return days;
  };

  const statCards = [
    { 
      label: 'Total Venues', 
      value: stats.totalVenues, 
      icon: Building2, 
      color: 'bg-primary/10 text-primary',
      trend: '+12%'
    },
    { 
      label: "Today's Bookings", 
      value: stats.todayBookings, 
      icon: Calendar, 
      color: 'bg-success/10 text-success',
      trend: '+5%'
    },
    { 
      label: 'Total Bookings', 
      value: stats.totalBookings, 
      icon: Users, 
      color: 'bg-warning/10 text-warning',
      trend: '+23%'
    },
    { 
      label: 'Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: IndianRupee, 
      color: 'bg-secondary/10 text-secondary',
      trend: '+18%'
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'venues' as const, label: 'Venues', icon: Building2 },
    { id: 'calendar' as const, label: 'Calendar', icon: CalendarDays },
    { id: 'bookings' as const, label: 'Bookings', icon: Layers },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
  ];

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-premium-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11 rounded-xl"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold font-display">Owner Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                {demoUser ? 'Demo Mode' : 'Manage your venues'}
              </p>
            </div>
          </div>
          <Button 
            size="icon" 
            className="h-11 w-11 rounded-xl btn-premium"
            onClick={() => navigate('/owner/venue/new')}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-premium-md'
                  : 'bg-card text-muted-foreground hover:bg-muted'
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
              <h3 className="font-semibold font-display mb-4">Weekly Revenue</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${value}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 rounded-xl"
                  onClick={() => navigate('/owner/venue/new')}
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Add Venue</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 rounded-xl"
                  onClick={() => setActiveTab('calendar')}
                >
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-sm">Manage Slots</span>
                </Button>
              </div>
            </div>

            {/* Recent Venues */}
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold font-display">Your Venues</h3>
                <button 
                  onClick={() => setActiveTab('venues')}
                  className="text-sm text-primary font-medium"
                >
                  View All
                </button>
              </div>
              
              {venues.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No venues yet</p>
                  <Button 
                    className="mt-4 btn-premium"
                    onClick={() => navigate('/owner/venue/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Venue
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {venues.slice(0, 3).map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => navigate(`/owner/venue/${venue.id}`)}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary/30 flex items-center gap-3 transition-all"
                    >
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{venue.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {venue.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venue.is_active 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {venue.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'venues' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display">Your Venues</h2>
              <Button 
                className="btn-premium"
                onClick={() => navigate('/owner/venue/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </div>

            {venues.length === 0 ? (
              <div className="card-premium p-8 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-semibold font-display mb-2">No venues yet</h3>
                <p className="text-muted-foreground mb-4">Add your first venue to start receiving bookings</p>
                <Button 
                  className="btn-premium"
                  onClick={() => navigate('/owner/venue/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Venue
                </Button>
              </div>
            ) : (
              venues.map((venue, index) => (
                <div 
                  key={venue.id}
                  className="card-premium p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{venue.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {venue.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="badge-premium">{venue.sport}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          venue.is_active 
                            ? 'bg-success/10 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {venue.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-10 w-10 rounded-xl"
                      onClick={() => navigate(`/owner/venue/${venue.id}`)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold font-display">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                  >
                    Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => (
                  <div 
                    key={index}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                      item.day === null 
                        ? '' 
                        : item.bookings > 5 
                          ? 'bg-success/20 text-success font-medium'
                          : item.bookings > 0
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {item.day && (
                      <>
                        <span>{item.day}</span>
                        {item.bookings > 0 && (
                          <span className="text-[10px]">{item.bookings}</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Slot Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Block or unblock time slots for your venues
              </p>
              <div className="space-y-2">
                {venues.map((venue) => (
                  <button 
                    key={venue.id}
                    className="w-full p-3 rounded-xl border border-border hover:border-primary/30 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{venue.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-display">Recent Bookings</h2>
            
            {/* Mock booking items */}
            {[
              { customer: 'Rahul Sharma', time: '6:00 PM - 7:00 PM', venue: 'PowerPlay Arena', status: 'confirmed' },
              { customer: 'Priya Patel', time: '7:00 PM - 8:00 PM', venue: 'PowerPlay Arena', status: 'confirmed' },
              { customer: 'Amit Kumar', time: '8:00 PM - 9:00 PM', venue: 'Goal Rush Turf', status: 'pending' },
            ].map((booking, index) => (
              <div key={index} className="card-premium p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">{booking.venue}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Peak Hours</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-bold text-primary">₹40,100</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-bold text-primary">₹1,85,400</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">Total Earnings</span>
                  <span className="font-bold text-primary">₹2,85,400</span>
                </div>
              </div>
            </div>

            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Performance Insights</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-success/20 bg-success/5">
                  <p className="text-sm font-medium text-success">Peak Hours: 6 PM - 9 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">70% of bookings during this time</p>
                </div>
                <div className="p-3 rounded-xl border border-warning/20 bg-warning/5">
                  <p className="text-sm font-medium text-warning">Low Occupancy: 10 AM - 2 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">Consider promotional pricing</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
