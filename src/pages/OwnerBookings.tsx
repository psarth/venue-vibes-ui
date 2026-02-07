
import { useState } from 'react';
import OwnerLayout from '@/layouts/OwnerLayout';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  date: Date;
  time: string;
  sport: string;
  amount: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending';
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customerName: 'Rahul Kumar',
    customerPhone: '+91 9876543210',
    date: new Date(),
    time: '06:00 PM - 07:00 PM',
    sport: 'Cricket',
    amount: 1200,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: 'BK-002',
    customerName: 'Amit Singh',
    customerPhone: '+91 9876543211',
    date: new Date(),
    time: '07:00 PM - 08:00 PM',
    sport: 'Football',
    amount: 1500,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: 'BK-003',
    customerName: 'Sneha Gupta',
    customerPhone: '+91 9876543212',
    date: new Date(Date.now() - 86400000), // Yesterday
    time: '05:00 PM - 06:00 PM',
    sport: 'Badminton',
    amount: 800,
    status: 'completed',
    paymentStatus: 'paid'
  }
];

export default function OwnerBookings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    const isPast = new Date(booking.date) < new Date(new Date().setHours(0, 0, 0, 0));
    const matchesTab = activeTab === 'upcoming' ? !isPast : isPast;

    return matchesSearch && matchesTab;
  });

  return (
    <OwnerLayout title="Bookings">
      <div className="p-4 max-w-5xl mx-auto space-y-6">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sticky top-0 bg-gray-50 z-10 py-2">
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'past' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Past
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search customer or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white w-full sm:w-64"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No bookings found for this period.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
                {/* Left: Info */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                    {booking.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{booking.customerName}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">{booking.id}</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(booking.date, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <span>{booking.sport}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <div className="text-right">
                    <span className="block text-xl font-bold text-gray-900">₹{booking.amount}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {booking.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  {activeTab === 'upcoming' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 border-red-100">
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark Paid
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}