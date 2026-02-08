import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { Users2, Phone, Calendar, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  totalBookings: number;
  mostPlayedSport: string;
  preferredTimeSlot: string;
  lastBookingDate: string;
  status: 'active' | 'inactive';
}

interface CustomerInsights {
  totalCustomers: number;
  activeCustomers: number;
  topSports: Array<{ sport: string; customers: number }>;
  timeSlotPreferences: Array<{ timeSlot: string; customers: number }>;
  customers: Customer[];
}

const AdminCustomersContent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { colors } = useAdminTheme();
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCustomerInsights();
    }
  }, [selectedFilter, userRole]);

  if (userRole !== 'admin') {
    return null;
  }

  const fetchCustomerInsights = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockInsights: CustomerInsights = {
        totalCustomers: 1247,
        activeCustomers: 892,
        topSports: [
          { sport: 'Cricket', customers: 456 },
          { sport: 'Badminton', customers: 389 },
          { sport: 'Football', customers: 234 },
          { sport: 'Tennis', customers: 168 }
        ],
        timeSlotPreferences: [
          { timeSlot: '6-8 PM', customers: 345 },
          { timeSlot: '7-9 AM', customers: 298 },
          { timeSlot: '8-10 PM', customers: 267 },
          { timeSlot: '5-7 PM', customers: 189 }
        ],
        customers: [
          {
            _id: '1',
            name: 'Arjun Sharma',
            phone: '+91 9876543210',
            totalBookings: 23,
            mostPlayedSport: 'Cricket',
            preferredTimeSlot: '6-7 PM',
            lastBookingDate: '2024-01-20',
            status: 'active'
          },
          {
            _id: '2',
            name: 'Priya Patel',
            phone: '+91 9876543211',
            totalBookings: 18,
            mostPlayedSport: 'Badminton',
            preferredTimeSlot: '7-8 AM',
            lastBookingDate: '2024-01-19',
            status: 'active'
          },
          {
            _id: '3',
            name: 'Rohit Kumar',
            phone: '+91 9876543212',
            totalBookings: 15,
            mostPlayedSport: 'Football',
            preferredTimeSlot: '8-9 PM',
            lastBookingDate: '2024-01-18',
            status: 'active'
          },
          {
            _id: '4',
            name: 'Sneha Singh',
            phone: '+91 9876543213',
            totalBookings: 12,
            mostPlayedSport: 'Tennis',
            preferredTimeSlot: '5-6 PM',
            lastBookingDate: '2024-01-15',
            status: 'active'
          },
          {
            _id: '5',
            name: 'Vikram Reddy',
            phone: '+91 9876543214',
            totalBookings: 8,
            mostPlayedSport: 'Cricket',
            preferredTimeSlot: '9-10 AM',
            lastBookingDate: '2024-01-10',
            status: 'inactive'
          }
        ]
      };
      
      // Apply filter
      if (selectedFilter !== 'all') {
        mockInsights.customers = mockInsights.customers.filter(c => c.status === selectedFilter);
      }
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching customer insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-900/20 text-green-400' 
      : 'bg-gray-900/20 text-gray-400';
  };

  if (loading) {
    return (
      <AdminLayout title="Customer Insights">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2" style={{ color: colors.text.secondary }}>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading customer data...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!insights) {
    return (
      <AdminLayout title="Customer Insights">
        <div className="p-6 text-center">
          <Users2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>No customer data</h3>
          <p style={{ color: colors.text.secondary }}>Customer insights will appear once you have users.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customer Insights">
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-4">
          <Label style={{ color: colors.text.primary }}>Filter:</Label>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border, color: colors.text.primary }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users2 className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Total Customers</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              {insights.totalCustomers.toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Active Customers</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {insights.activeCustomers.toLocaleString()}
            </p>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
              {((insights.activeCustomers / insights.totalCustomers) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Top Sport</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              {insights.topSports[0]?.sport || 'N/A'}
            </p>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
              {insights.topSports[0]?.customers || 0} customers
            </p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>Peak Time</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              {insights.timeSlotPreferences[0]?.timeSlot || 'N/A'}
            </p>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
              {insights.timeSlotPreferences[0]?.customers || 0} customers
            </p>
          </div>
        </div>

        {/* Sport Preferences */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Sport Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.topSports.map(sport => (
              <div key={sport.sport} className="p-4 rounded-lg" style={{ backgroundColor: colors.bg.primary }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: colors.text.primary }}>{sport.sport}</span>
                  <span className="text-lg font-bold" style={{ color: colors.accent.primary }}>
                    {sport.customers}
                  </span>
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(sport.customers / insights.topSports[0].customers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Preferences */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Time Slot Preferences</h3>
          
          <div className="space-y-3">
            {insights.timeSlotPreferences.map(slot => {
              const percentage = (slot.customers / insights.timeSlotPreferences[0].customers) * 100;
              return (
                <div key={slot.timeSlot} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium" style={{ color: colors.text.primary }}>
                    {slot.timeSlot}
                  </div>
                  <div className="flex-1 rounded-full h-6 relative overflow-hidden" style={{ backgroundColor: colors.bg.primary }}>
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500/60 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium" style={{ color: colors.text.primary }}>
                        {slot.customers} customers
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer List */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Customer Overview</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.accent.border }}>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Customer</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Contact</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Bookings</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Preferred Sport</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Preferred Time</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Last Booking</th>
                  <th className="text-left py-3" style={{ color: colors.text.secondary }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {insights.customers.map(customer => (
                  <tr key={customer._id} className="border-b" style={{ borderColor: colors.accent.border }}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Users2 className="h-4 w-4" style={{ color: colors.text.secondary }} />
                        <span style={{ color: colors.text.primary }}>{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" style={{ color: colors.text.secondary }} />
                        <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                          {customer.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-medium" style={{ color: colors.text.primary }}>
                        {customer.totalBookings}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-900/20 text-blue-400">
                        {customer.mostPlayedSport}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" style={{ color: colors.text.secondary }} />
                        <span className="text-sm" style={{ color: colors.text.secondary }}>
                          {customer.preferredTimeSlot}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" style={{ color: colors.text.secondary }} />
                        <span className="text-sm" style={{ color: colors.text.secondary }}>
                          {new Date(customer.lastBookingDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
          <div className="flex items-start gap-3">
            <Users2 className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium" style={{ color: colors.text.primary }}>Admin Access - Full Customer Data</p>
              <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                As an admin, you have access to complete customer contact information for support and management purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function AdminCustomers() {
  return (
    <AdminThemeProvider>
      <AdminCustomersContent />
    </AdminThemeProvider>
  );
}