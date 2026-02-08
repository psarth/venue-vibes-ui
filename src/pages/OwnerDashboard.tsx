import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '@/layouts/OwnerLayout';
import { formatIndianNumber } from '@/utils/indianNumberFormat';
import { getVenueLiveStatus } from '@/utils/venueSync';
import { getVenueStatus, getStatusMessage, type VenueStatus } from '@/utils/venueApproval';
import { cn } from '@/lib/utils';
import { Building2, Calendar, TrendingUp, Clock, Loader2, ArrowRight, DollarSign, Activity, Users, Radio, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OwnerStats {
  totalBookings: number;
  todayBookings: number;
  weeklyRevenue: number;
  peakHour: string;
  activeSports: number;
  utilizationRate: number;
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [venueSetupComplete, setVenueSetupComplete] = useState(false);
  const [status, setStatus] = useState<VenueStatus>('draft');

  useEffect(() => {
    if (userRole !== 'owner') {
      navigate('/auth');
      return;
    }

    const checkVenueSetup = () => {
      const venueData = localStorage.getItem('owner_venue');
      if (venueData) {
        setVenueSetupComplete(true);
        setStatus(getVenueStatus('venue_demo'));
        fetchOwnerStats();
      } else {
        // If first login and no venue setup, redirect to venue section instead of showing form on dashboard
        navigate('/owner/venue', { replace: true });
        setVenueSetupComplete(false);
        setLoading(false);
      }
    };

    checkVenueSetup();
  }, [userRole, navigate]);

  const statusInfo = getStatusMessage(status);

  const fetchOwnerStats = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockStats: OwnerStats = {
        totalBookings: 156,
        todayBookings: 12,
        weeklyRevenue: 48500,
        peakHour: '7-9 PM',
        activeSports: 3,
        utilizationRate: 78
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setVenueSetupComplete(true);
    fetchOwnerStats();
  };

  if (loading) {
    return (
      <OwnerLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading dashboard...
          </div>
        </div>
      </OwnerLayout>
    );
  }



  return (
    <OwnerLayout title="Dashboard" subtitle="Overview & Key Metrics">
      <div className="grid gap-6">

        {/* Venue Verification Status */}
        <div className={cn(
          "bg-card border rounded-xl p-4 shadow-sm",
          status === 'approved' ? "border-success/30" :
            status === 'pending' ? "border-warning/30" :
              status === 'rejected' ? "border-destructive/30" : "border-border/50"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                status === 'approved' ? "bg-success/10" :
                  status === 'pending' ? "bg-warning/10" :
                    status === 'rejected' ? "bg-destructive/10" : "bg-muted/10"
              )}>
                {status === 'approved' ? (
                  <Radio className="w-5 h-5 text-success animate-pulse" />
                ) : status === 'pending' ? (
                  <Clock className="w-5 h-5 text-warning animate-spin-slow" />
                ) : status === 'rejected' ? (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-foreground">Venue Status: <span className={statusInfo.color}>{statusInfo.title}</span></h3>
                <p className="text-xs text-muted-foreground">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                status === 'approved' ? "bg-success/10 text-success" :
                  status === 'pending' ? "bg-warning/10 text-warning" :
                    status === 'rejected' ? "bg-destructive/10 text-destructive" : "bg-muted/10 text-muted-foreground"
              )}>
                {status === 'approved' ? '🟢 LIVE' : status === 'pending' ? '🟡 PENDING' : status === 'rejected' ? '🔴 REJECTED' : '⚪ DRAFT'}
              </div>
              {status === 'approved' && (
                <Badge variant="outline" className="text-[10px] bg-success/5 text-success border-success/20">
                  Verified
                </Badge>
              )}
            </div>
          </div>

          {status === 'rejected' && (
            <div className="mt-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
              <p className="text-xs text-destructive font-medium flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Rejection Reason: Incomplete venue photos or documentation. Please update and re-submit.
              </p>
            </div>
          )}
        </div>

        {/* KPI Cards Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Bookings */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-foreground/70 text-sm font-medium">Total Bookings</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stats?.totalBookings}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-success font-medium flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
              <span className="text-muted-foreground ml-2">vs last week</span>
            </div>
          </div>

          {/* Weekly Revenue */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-foreground/70 text-sm font-medium">Weekly Revenue</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">₹{formatIndianNumber(stats?.weeklyRevenue || 0)}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-success font-medium flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-1" /> +8.5%
              </span>
              <span className="text-muted-foreground ml-2">vs last week</span>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-foreground/70 text-sm font-medium">Today's Bookings</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stats?.todayBookings}</h3>
              </div>
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary-foreground group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">65% slots booked today</p>
          </div>

          {/* Utilization Rate */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary-foreground/70 text-sm font-medium">Utilization Rate</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stats?.utilizationRate}%</h3>
              </div>
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary-foreground group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-warning font-medium flex items-center bg-warning/10 px-1.5 py-0.5 rounded">
                Peak: {stats?.peakHour}
              </span>
              <span className="text-muted-foreground ml-2">Highest traffic</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Action Card */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 p-6 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/10"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Venue Management</h2>
                <p className="text-muted-foreground max-w-md">
                  Update your venue details, manage slots availability, and configure pricing strategies all in one place.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate('/owner/slots')}
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Manage Slots
                  </button>
                  <button
                    onClick={() => navigate('/owner/venue')}
                    className="px-5 py-2.5 bg-card border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" /> Edit Venue
                  </button>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <Building2 className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Insights */}
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Top Sport</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Badminton</span>
                  <span className="text-sm text-green-500 font-medium">60% Rev</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Peak Day</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Saturday</span>
                  <span className="text-sm text-primary font-medium">95% Occ</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/owner/analytics')}
                className="w-full py-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center justify-center gap-1 mt-2"
              >
                View Full Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </OwnerLayout>
  );
}