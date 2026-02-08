import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { BarChart3, Clock, Building2, TrendingUp, Loader2, PieChart as PieIcon, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAnalytics();
    }
  }, [selectedPeriod, userRole]);

  if (userRole !== 'admin') {
    return null;
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const PIE_COLORS = ['#2979FF', '#22C55E', '#F59E0B', '#F43F5E', '#A855F7'];

  if (loading) {
    return (
      <AdminLayout title="Platform Analytics">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10" style={{ color: colors.accent.primary }} />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: colors.text.secondary }}
          >
            Analyzing real-time platform data...
          </motion.p>
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

  return (
    <AdminLayout title="Platform Analytics">
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          {[
            { label: 'Total Bookings', value: analytics.totalBookings, icon: BarChart3, color: colors.accent.primary },
            { label: 'Active Venues', value: analytics.totalVenues, icon: Building2, color: colors.accent.success },
            { label: 'Top Sport', value: analytics.sportWise[0]?.sport || 'N/A', icon: TrendingUp, color: colors.accent.warning },
            { 
              label: 'Peak Hour', 
              value: analytics.hourlyData.reduce((p, c) => p.bookings > c.bookings ? p : c).hour, 
              icon: Clock, 
              color: colors.accent.secondary 
            }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-4 rounded-lg border group cursor-default" 
              style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 transition-transform group-hover:scale-110" style={{ color: stat.color }} />
                <span className="text-sm" style={{ color: colors.text.secondary }}>{stat.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sport-wise Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-lg border" 
            style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
          >
            <div className="flex items-center gap-2 mb-6">
              <PieIcon className="h-5 w-5" style={{ color: colors.accent.primary }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Sport Distribution</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.sportWise}
                    dataKey="totalBookings"
                    nameKey="sport"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {analytics.sportWise.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: colors.bg.surface, border: `1px solid ${colors.accent.border}`, borderRadius: '8px' }}
                    itemStyle={{ color: colors.text.primary }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {analytics.sportWise.map((s, i) => (
                  <div key={s.sport} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs" style={{ color: colors.text.secondary }}>{s.sport}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Hourly Trend Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-lg border" 
            style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5" style={{ color: colors.accent.success }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Booking Trend</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.hourlyData}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.accent.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.accent.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.accent.border} vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: colors.text.secondary, fontSize: 10 }}
                    interval={2}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: colors.text.secondary, fontSize: 10 }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: colors.bg.surface, border: `1px solid ${colors.accent.border}`, borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke={colors.accent.primary} 
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Venue Performance Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg border overflow-hidden" 
          style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: colors.text.primary }}>Top Performing Venues</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.accent.border }}>
                  <th className="text-left pb-4 font-medium" style={{ color: colors.text.secondary }}>Venue</th>
                  <th className="text-left pb-4 font-medium" style={{ color: colors.text.secondary }}>Owner</th>
                  <th className="text-left pb-4 font-medium" style={{ color: colors.text.secondary }}>Bookings</th>
                  <th className="text-left pb-4 font-medium" style={{ color: colors.text.secondary }}>Utilization</th>
                  <th className="text-left pb-4 font-medium" style={{ color: colors.text.secondary }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.venueWise.map((venue, i) => (
                  <motion.tr 
                    key={venue.venueName} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.05) }}
                    className="border-b last:border-0 hover:bg-white/5 transition-colors" 
                    style={{ borderColor: colors.accent.border }}
                  >
                    <td className="py-4" style={{ color: colors.text.primary }}>{venue.venueName}</td>
                    <td className="py-4" style={{ color: colors.text.secondary }}>{venue.ownerName}</td>
                    <td className="py-4" style={{ color: colors.text.primary }}>{venue.totalBookings}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${venue.utilization}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                        <span style={{ color: colors.text.primary }}>{venue.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        venue.status === 'high' ? 'bg-green-500/20 text-green-400' : 
                        venue.status === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {venue.status.toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Dynamic Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-5 rounded-xl border flex flex-col gap-3"
            style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20">
              <TrendingUp className="text-green-500 h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg" style={{ color: colors.text.primary }}>Popularity Peak</h4>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {analytics.sportWise[0]?.sport} holds {(analytics.sportWise[0]?.totalBookings / analytics.totalBookings * 100).toFixed(0)}% of total platform bookings.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-5 rounded-xl border flex flex-col gap-3"
            style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20">
              <Clock className="text-blue-500 h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg" style={{ color: colors.text.primary }}>Peak Efficiency</h4>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Booking volume increases by 45% between 5 PM and 9 PM daily.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-5 rounded-xl border flex flex-col gap-3"
            style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/20">
              <Building2 className="text-purple-500 h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg" style={{ color: colors.text.primary }}>Top Performer</h4>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {analytics.venueWise[0]?.venueName} maintains a steady {analytics.venueWise[0]?.utilization}% utilization rate.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
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