import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { Calendar, MapPin, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface Booking {
  _id: string;
  bookingId: string;
  venueName: string;
  customerName: string;
  ownerName: string;
  date: string;
  timeSlot: string;
  amount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  location: string;
}

const AdminBookingsContent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { colors } = useAdminTheme();
  const isMobile = useIsMobile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setBookings([
          {
            _id: '1',
            bookingId: 'BK001',
            venueName: 'PowerPlay Arena',
            customerName: 'John Doe',
            ownerName: 'Rajesh Kumar',
            date: '2024-01-20',
            timeSlot: '06:00-07:00',
            amount: 450,
            status: 'Confirmed',
            location: 'Indiranagar'
          },
          {
            _id: '2',
            bookingId: 'BK002',
            venueName: 'Cricket Hub',
            customerName: 'Jane Smith',
            ownerName: 'Priya Singh',
            date: '2024-01-20',
            timeSlot: '18:00-19:00',
            amount: 1200,
            status: 'Confirmed',
            location: 'Koramangala'
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    if (userRole === 'admin') {
      fetchBookings();
    }
  }, [userRole]);

  if (userRole !== 'admin') {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-900/20 text-blue-400';
      case 'Completed': return 'bg-green-900/20 text-green-400';
      case 'Cancelled': return 'bg-red-900/20 text-red-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="All Bookings">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2" style={{ color: colors.text.secondary }}>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading bookings...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="All Bookings">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm lg:text-base" style={{ color: colors.text.secondary }}>{bookings.length} bookings</span>
        </div>

        {isMobile ? (
          /* Mobile Card Layout */
          <div className="space-y-3">
            {bookings.map(booking => (
              <div key={booking._id} className="p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-medium" style={{ color: colors.text.primary }}>
                      #{booking.bookingId}
                    </p>
                    <div className="flex items-center gap-2 text-xs mt-1" style={{ color: colors.text.secondary }}>
                      <Calendar className="h-3 w-3" />
                      <span>{booking.date}</span>
                      <span>•</span>
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-sm" style={{ color: colors.text.primary }}>
                      {booking.venueName}
                    </p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: colors.text.secondary }}>
                      <MapPin className="h-3 w-3" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1" style={{ color: colors.text.secondary }}>
                        <User className="h-3 w-3" />
                        <span>Customer: {booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: colors.text.secondary }}>
                        <User className="h-3 w-3" />
                        <span>Owner: {booking.ownerName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm" style={{ color: colors.accent.success }}>
                        ₹{booking.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.accent.border }}>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Booking</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Venue</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Customer</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Owner</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Amount</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} className="border-b" style={{ borderColor: colors.accent.border }}>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-mono text-sm" style={{ color: colors.text.primary }}>
                          #{booking.bookingId}
                        </p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.text.secondary }}>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {booking.date}
                          </div>
                          <span>{booking.timeSlot}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium" style={{ color: colors.text.primary }}>
                          {booking.venueName}
                        </p>
                        <div className="flex items-center gap-1 text-sm" style={{ color: colors.text.secondary }}>
                          <MapPin className="h-3 w-3" />
                          {booking.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" style={{ color: colors.text.secondary }} />
                        <span style={{ color: colors.text.primary }}>{booking.customerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" style={{ color: colors.text.secondary }} />
                        <span style={{ color: colors.text.primary }}>{booking.ownerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium" style={{ color: colors.accent.success }}>
                        ₹{booking.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default function AdminBookings() {
  return (
    <AdminThemeProvider>
      <AdminBookingsContent />
    </AdminThemeProvider>
  );
}