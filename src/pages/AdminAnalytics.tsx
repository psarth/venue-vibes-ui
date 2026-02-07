import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { BarChart3, Clock, Building2, TrendingUp, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface SportAnalytics {
  sport: string;
  totalBookings: number;
  activeVenues: number;
  peakHour: string;
}

interface HourlyData {
  hour: string;
  bookings: number;
}

interface VenueAnalytics {
  venueName: string;
  ownerName: string;
  totalBookings: number;
  utilization: number;
  status: 'high' | 'medium' | 'low';
}

interface AnalyticsData {
  sportWise: SportAnalytics[];
  hourlyData: HourlyData[];
  venueWise: VenueAnalytics[];
  totalBookings: number;
  totalVenues: number;
}

const AdminAnalyticsContent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { colors } = useAdminTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  if (userRole !== 'admin') {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockAnalytics: AnalyticsData = {
        sportWise: [
          { sport: 'Cricket', totalBookings: 245, activeVenues: 8, peakHour: '6-7 PM' },
          { sport: 'Badminton', totalBookings: 189, activeVenues: 12, peakHour: '7-8 AM' },
          { sport: 'Football', totalBookings: 156, activeVenues: 6, peakHour: '8-9 PM' },
          { sport: 'Tennis', totalBookings: 98, activeVenues: 4, peakHour: '5-6 PM' },
          { sport: 'Basketball', totalBookings: 67, activeVenues: 3, peakHour: '7-8 PM' }
        ],
        hourlyData: [
          { hour: '6 AM', bookings: 45 },
          { hour: '7 AM', bookings: 67 },
          { hour: '8 AM', bookings: 52 },
          { hour: '9 AM', bookings: 38 },
          { hour: '10 AM', bookings: 29 },
          { hour: '11 AM', bookings: 24 },
          { hour: '12 PM', bookings: 31 },
          { hour: '1 PM', bookings: 28 },
          { hour: '2 PM', bookings: 22 },
          { hour: '3 PM', bookings: 35 },
          { hour: '4 PM', bookings: 48 },
          { hour: '5 PM', bookings: 61 },
          { hour: '6 PM', bookings: 78 },
          { hour: '7 PM', bookings: 72 },
          { hour: '8 PM', bookings: 85 },
          { hour: '9 PM', bookings: 58 },
          { hour: '10 PM', bookings: 32 }
        ],
        venueWise: [
          { venueName: 'PowerPlay Arena', ownerName: 'Rajesh Kumar', totalBookings: 156, utilization: 89, status: 'high' },
          { venueName: 'SportZone Complex', ownerName: 'Priya Singh', totalBookings: 134, utilization: 76, status: 'high' },
          { venueName: 'Elite Sports Hub', ownerName: 'Amit Patel', totalBookings: 98, utilization: 65, status: 'medium' },
          { venueName: 'Game Arena', ownerName: 'Sarah Wilson', totalBookings: 67, utilization: 45, status: 'medium' },
          { venueName: 'Sports Central', ownerName: 'David Brown', totalBookings: 23, utilization: 28, status: 'low' }
        ],
        totalBookings: 755,
        totalVenues: 15
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxBookings = () => {
    if (!analytics) return 0;
    return Math.max(...analytics.hourlyData.map(h => h.bookings));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Platform Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2" style={{ color: colors.text.secondary }}>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading analytics...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout title="Platform Analytics">
        <div className="p-6 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>No analytics data</h3>
          <p style={{ color: colors.text.secondary }}>Analytics will appear once you have bookings.</p>
        </div>
      </AdminLayout>
    );
  }

  const maxBookings = getMaxBookings();

  return (
    <AdminLayout title="Platform Analytics">
      <div className="space-y-6">
        {/* Period Filter */}
        <div className="flex items-center gap-4">
          <Label style={{ color: colors.text.primary }}>Time Period:</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border, color: colors.text.primary }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4" style={{ color: colors.accent.primary }} />
              <span className="text-sm" style={{ color: colors.text.secondary }}>Total Bookings</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>{analytics.totalBookings}</p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4" style={{ color: colors.accent.success }} />
              <span className="text-sm" style={{ color: colors.text.secondary }}>Active Venues</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.accent.success }}>{analytics.totalVenues}</p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4" style={{ color: colors.accent.warning }} />
              <span className="text-sm" style={{ color: colors.text.secondary }}>Top Sport</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.accent.warning }}>
              {analytics.sportWise[0]?.sport || 'N/A'}
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" style={{ color: colors.accent.secondary }} />
              <span className="text-sm" style={{ color: colors.text.secondary }}>Peak Hour</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.accent.secondary }}>
              {analytics.hourlyData.reduce((prev, current) => 
                prev.bookings > current.bookings ? prev : current
              ).hour}
            </p>
          </div>
        </div>

        {/* Sport-wise Analytics */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Sport-wise Performance</h3>
          
          <div className="space-y-4">
            {analytics.sportWise.map(sport => (
              <div key={sport.sport} className="p-4 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium" style={{ color: colors.text.primary }}>{sport.sport}</h4>
                  <span className="text-sm" style={{ color: colors.text.secondary }}>
                    {sport.activeVenues} venues
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: colors.text.secondary }}>Total Bookings:</span>
                    <span className="ml-2 font-semibold" style={{ color: colors.text.primary }}>
                      {sport.totalBookings}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: colors.text.secondary }}>Peak Hour:</span>
                    <span className="ml-2 font-semibold" style={{ color: colors.text.primary }}>
                      {sport.peakHour}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Analytics */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5" style={{ color: colors.accent.primary }} />
            <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Hourly Booking Distribution</h3>
          </div>
          
          <div className="space-y-3">
            {analytics.hourlyData.map(hour => {
              const percentage = maxBookings > 0 ? (hour.bookings / maxBookings) * 100 : 0;
              return (
                <div key={hour.hour} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium" style={{ color: colors.text.primary }}>
                    {hour.hour}
                  </div>
                  <div className="flex-1 rounded-full h-6 relative overflow-hidden" style={{ backgroundColor: colors.bg.primary }}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500/60 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium" style={{ color: colors.text.primary }}>
                        {hour.bookings} bookings
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Performance */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Venue Performance</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.accent.border }}>
                  <th className="text-left py-2" style={{ color: colors.text.secondary }}>Venue</th>
                  <th className="text-left py-2" style={{ color: colors.text.secondary }}>Owner</th>
                  <th className="text-left py-2" style={{ color: colors.text.secondary }}>Bookings</th>
                  <th className="text-left py-2" style={{ color: colors.text.secondary }}>Utilization</th>
                  <th className="text-left py-2" style={{ color: colors.text.secondary }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.venueWise.map(venue => (
                  <tr key={venue.venueName} className="border-b" style={{ borderColor: colors.accent.border }}>
                    <td className="py-3" style={{ color: colors.text.primary }}>{venue.venueName}</td>
                    <td className="py-3" style={{ color: colors.text.secondary }}>{venue.ownerName}</td>
                    <td className="py-3" style={{ color: colors.text.primary }}>{venue.totalBookings}</td>
                    <td className="py-3" style={{ color: colors.text.primary }}>{venue.utilization}%</td>
                    <td className="py-3">
                      <span className={`font-medium ${getStatusColor(venue.status)}`}>
                        {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Key Insights</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
              <TrendingUp className="h-5 w-5 mt-0.5" style={{ color: colors.accent.success }} />
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Most Popular Sport</p>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {analytics.sportWise[0]?.sport} leads with {analytics.sportWise[0]?.totalBookings} bookings across {analytics.sportWise[0]?.activeVenues} venues
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
              <Clock className="h-5 w-5 mt-0.5" style={{ color: colors.accent.warning }} />
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Peak Booking Time</p>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {analytics.hourlyData.reduce((prev, current) => 
                    prev.bookings > current.bookings ? prev : current
                  ).hour} has the highest booking volume with {analytics.hourlyData.reduce((prev, current) => 
                    prev.bookings > current.bookings ? prev : current
                  ).bookings} bookings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
              <Building2 className="h-5 w-5 mt-0.5" style={{ color: colors.accent.primary }} />
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Top Performing Venue</p>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {analytics.venueWise[0]?.venueName} by {analytics.venueWise[0]?.ownerName} with {analytics.venueWise[0]?.utilization}% utilization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function AdminAnalytics() {
  return (
    <AdminThemeProvider>
      <AdminAnalyticsContent />
    </AdminThemeProvider>
  );
}