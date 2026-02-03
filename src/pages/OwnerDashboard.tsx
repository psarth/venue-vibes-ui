import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Calendar, BarChart3, Settings, Plus, 
  TrendingUp, Users, DollarSign, Clock, ChevronRight, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();
  const [stats, setStats] = useState<VenueStats>({
    totalVenues: 0,
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
  });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'bookings' | 'analytics'>('overview');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'owner')) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'owner') {
      fetchOwnerData();
    }
  }, [user, userRole]);

  const fetchOwnerData = async () => {
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

    // Fetch bookings stats (would need proper venue_id filtering)
    // This is simplified for demo
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
      icon: DollarSign, 
      color: 'bg-secondary/10 text-secondary',
      trend: '+18%'
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'venues' as const, label: 'Venues', icon: Building2 },
    { id: 'bookings' as const, label: 'Bookings', icon: Calendar },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
  ];

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
              <p className="text-xs text-muted-foreground">Manage your venues</p>
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
                  onClick={() => setActiveTab('bookings')}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">View Bookings</span>
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

        {activeTab === 'bookings' && (
          <div className="card-premium p-8 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold font-display mb-2">No bookings yet</h3>
            <p className="text-muted-foreground">Bookings for your venues will appear here</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card-premium p-8 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold font-display mb-2">Analytics Coming Soon</h3>
            <p className="text-muted-foreground">Detailed revenue and booking analytics will be available here</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;