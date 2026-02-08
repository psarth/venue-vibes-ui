import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { TrendingUp, DollarSign, Building2, Calendar, Loader2, IndianRupee } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { formatIndianNumber } from '@/utils/indianNumberFormat';

interface RevenueData {
  totalPlatformRevenue: number;
  ownerCommission: number;
  customerConvenienceFee: number;
  netPlatformEarnings: number;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    commission: number;
    convenienceFee: number;
  }>;
  venueRevenue: Array<{
    venueName: string;
    ownerName: string;
    totalRevenue: number;
    platformEarnings: number;
  }>;
}

const AdminRevenueContent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { colors } = useAdminTheme();
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  if (userRole !== 'admin') {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRevenueData: RevenueData = {
        totalPlatformRevenue: 2450000,
        ownerCommission: 245000, // 10% of total
        customerConvenienceFee: 49000, // 2% of total
        netPlatformEarnings: 294000, // commission + convenience fee
        dailyRevenue: [
          { date: '2024-01-15', revenue: 45000, commission: 4500, convenienceFee: 900 },
          { date: '2024-01-16', revenue: 52000, commission: 5200, convenienceFee: 1040 },
          { date: '2024-01-17', revenue: 38000, commission: 3800, convenienceFee: 760 },
          { date: '2024-01-18', revenue: 67000, commission: 6700, convenienceFee: 1340 },
          { date: '2024-01-19', revenue: 41000, commission: 4100, convenienceFee: 820 },
          { date: '2024-01-20', revenue: 58000, commission: 5800, convenienceFee: 1160 },
          { date: '2024-01-21', revenue: 49000, commission: 4900, convenienceFee: 980 }
        ],
        venueRevenue: [
          { venueName: 'PowerPlay Arena', ownerName: 'Rajesh Kumar', totalRevenue: 185000, platformEarnings: 22200 },
          { venueName: 'SportZone Complex', ownerName: 'Priya Singh', totalRevenue: 156000, platformEarnings: 18720 },
          { venueName: 'Elite Sports Hub', ownerName: 'Amit Patel', totalRevenue: 134000, platformEarnings: 16080 },
          { venueName: 'Game Arena', ownerName: 'Sarah Wilson', totalRevenue: 98000, platformEarnings: 11760 },
          { venueName: 'Sports Central', ownerName: 'David Brown', totalRevenue: 67000, platformEarnings: 8040 }
        ]
      };
      
      setRevenueData(mockRevenueData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Revenue Management">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2" style={{ color: colors.text.secondary }}>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading revenue data...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!revenueData) {
    return (
      <AdminLayout title="Revenue Management">
        <div className="p-6 text-center">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>No revenue data</h3>
          <p style={{ color: colors.text.secondary }}>Revenue data will appear once you have transactions.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Revenue Management">
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

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Total Platform Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-6 w-6" style={{ color: colors.text.primary }} />
              <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                {formatIndianNumber(revenueData.totalPlatformRevenue)}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Owner Commission</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-6 w-6 text-green-400" />
              <p className="text-2xl font-bold text-green-400">
                {formatIndianNumber(revenueData.ownerCommission)}
              </p>
            </div>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>10% of bookings</p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Convenience Fee</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-6 w-6 text-yellow-400" />
              <p className="text-2xl font-bold text-yellow-400">
                {formatIndianNumber(revenueData.customerConvenienceFee)}
              </p>
            </div>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>2% from customers</p>
          </div>

          <div className="p-6 rounded-lg border border-green-500/20" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Net Platform Earnings</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-7 w-7 text-green-400" />
              <p className="text-3xl font-bold text-green-400">
                {formatIndianNumber(revenueData.netPlatformEarnings)}
              </p>
            </div>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>Total platform profit</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Revenue Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5" style={{ color: colors.text.secondary }} />
                <span style={{ color: colors.text.primary }}>Total Booking Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5" style={{ color: colors.text.primary }} />
                <span className="text-xl font-bold" style={{ color: colors.text.primary }}>
                  {formatIndianNumber(revenueData.totalPlatformRevenue)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-400" />
                <div>
                  <span style={{ color: colors.text.primary }}>Platform Commission from Owners</span>
                  <p className="text-xs" style={{ color: colors.text.secondary }}>10% of each booking</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5 text-green-400" />
                <span className="text-xl font-bold text-green-400">
                  +{formatIndianNumber(revenueData.ownerCommission)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                <div>
                  <span style={{ color: colors.text.primary }}>Convenience Fee from Customers</span>
                  <p className="text-xs" style={{ color: colors.text.secondary }}>2% of each booking</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5 text-yellow-400" />
                <span className="text-xl font-bold text-yellow-400">
                  +{formatIndianNumber(revenueData.customerConvenienceFee)}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4" style={{ borderColor: colors.accent.border }}>
              <div className="flex justify-between items-center p-4 rounded-lg border border-green-500/20" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  <span className="text-lg font-semibold" style={{ color: colors.text.primary }}>Total Platform Earnings</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-6 w-6 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {formatIndianNumber(revenueData.netPlatformEarnings)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Revenue Trend */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Daily Revenue Trend</h3>
          
          <div className="space-y-3">
            {revenueData.dailyRevenue.map(day => {
              const totalEarnings = day.commission + day.convenienceFee;
              return (
                <div key={day.date} className="p-4 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: colors.text.primary }}>
                      {new Date(day.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-green-400" />
                      <span className="font-bold text-green-400">
                        {formatIndianNumber(totalEarnings)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span style={{ color: colors.text.secondary }}>Total Revenue:</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" style={{ color: colors.text.primary }} />
                        <span className="font-medium" style={{ color: colors.text.primary }}>
                          {formatIndianNumber(day.revenue)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style={{ color: colors.text.secondary }}>Commission:</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3 text-green-400" />
                        <span className="font-medium text-green-400">
                          {formatIndianNumber(day.commission)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style={{ color: colors.text.secondary }}>Conv. Fee:</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3 text-yellow-400" />
                        <span className="font-medium text-yellow-400">
                          {formatIndianNumber(day.convenienceFee)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Revenue Performance */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Revenue per Venue</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.accent.border }}>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Venue</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Owner</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Total Revenue</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Platform Earnings</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.venueRevenue.map(venue => {
                  const sharePercentage = ((venue.platformEarnings / venue.totalRevenue) * 100).toFixed(1);
                  return (
                    <tr key={venue.venueName} className="border-b" style={{ borderColor: colors.accent.border }}>
                      <td className="py-3" style={{ color: colors.text.primary }}>{venue.venueName}</td>
                      <td className="py-3" style={{ color: colors.text.secondary }}>{venue.ownerName}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" style={{ color: colors.text.primary }} />
                          <span style={{ color: colors.text.primary }}>
                            {formatIndianNumber(venue.totalRevenue)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-green-400" />
                          <span className="font-medium text-green-400">
                            {formatIndianNumber(venue.platformEarnings)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                          {sharePercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function AdminRevenue() {
  return (
    <AdminThemeProvider>
      <AdminRevenueContent />
    </AdminThemeProvider>
  );
}