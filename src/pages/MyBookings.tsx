import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { PremiumBottomNav } from '@/components/premium';

interface Booking {
  id: string;
  booking_reference: string;
  booking_date: string;
  base_price: number;
  total_price: number;
  status: string;
  created_at: string;
  venues: {
    name: string;
    location: string;
    sport: string;
  } | null;
  slots: {
    start_time: string;
    end_time: string;
  } | null;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading, demoUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  useEffect(() => {
    if (!loading && !user && !demoUser) {
      navigate('/auth');
    }
  }, [user, loading, navigate, demoUser]);

  useEffect(() => {
    if (demoUser) {
      // Set demo bookings
      setBookings(getDemoBookings());
      setIsLoading(false);
    } else if (user) {
      fetchBookings();
    }
  }, [user, demoUser]);

  const getDemoBookings = (): Booking[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    return [
      {
        id: '1',
        booking_reference: 'SP260203-ABC123',
        booking_date: tomorrow.toISOString().split('T')[0],
        base_price: 450,
        total_price: 473,
        status: 'confirmed',
        created_at: today.toISOString(),
        venues: { name: 'PowerPlay Badminton Arena', location: 'Indiranagar, Bangalore', sport: 'Badminton' },
        slots: { start_time: '18:00', end_time: '19:00' },
      },
      {
        id: '2',
        booking_reference: 'SP260210-DEF456',
        booking_date: nextWeek.toISOString().split('T')[0],
        base_price: 1800,
        total_price: 1890,
        status: 'confirmed',
        created_at: today.toISOString(),
        venues: { name: 'Goal Rush Football Turf', location: 'Koramangala, Bangalore', sport: 'Football' },
        slots: { start_time: '19:00', end_time: '20:00' },
      },
      {
        id: '3',
        booking_reference: 'SP260127-GHI789',
        booking_date: lastWeek.toISOString().split('T')[0],
        base_price: 350,
        total_price: 368,
        status: 'completed',
        created_at: lastWeek.toISOString(),
        venues: { name: 'Smash Zone Badminton Hub', location: 'HSR Layout, Bangalore', sport: 'Badminton' },
        slots: { start_time: '10:00', end_time: '11:00' },
      },
    ];
  };

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_reference,
        booking_date,
        base_price,
        total_price,
        status,
        created_at,
        venues (name, location, sport),
        slots (start_time, end_time)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setIsLoading(false);

    if (!error && data) {
      setBookings(data as Booking[]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success/10 text-success';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter(b => b.booking_date >= today && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => b.booking_date < today || b.status === 'cancelled' || b.status === 'completed');

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-premium-sm">
        <div className="flex items-center gap-4 h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-xl"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">My Bookings</h1>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="p-4">
        <div className="flex p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming'
              ? 'bg-card text-foreground shadow-premium-sm'
              : 'text-muted-foreground'
              }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'past'
              ? 'bg-card text-foreground shadow-premium-sm'
              : 'text-muted-foreground'
              }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 pb-20 space-y-3">
        {displayedBookings.length === 0 ? (
          <div className="card-premium p-8 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold font-display mb-2">
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'upcoming'
                ? 'Book a venue to get started!'
                : 'Your booking history will appear here'}
            </p>
            {activeTab === 'upcoming' && (
              <Button
                className="btn-premium"
                onClick={() => navigate('/')}
              >
                Browse Venues
              </Button>
            )}
          </div>
        ) : (
          displayedBookings.map((booking, index) => (
            <div
              key={booking.id}
              className="card-premium p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{booking.venues?.name || 'Venue'}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {booking.venues?.location || 'Location'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                </div>
                {booking.slots && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {booking.slots.start_time.slice(0, 5)} - {booking.slots.end_time.slice(0, 5)}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-sm font-medium">{booking.booking_reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-semibold text-primary">₹{booking.total_price}</p>
                </div>
              </div>

              {/* Review Button - ONLY for Completed/Past Bookings */}
              {booking.status === 'completed' && (
                <div className="pt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-primary text-primary hover:bg-primary/5 text-xs font-bold"
                    onClick={() => {
                      setSelectedBookingForReview(booking);
                      setIsReviewModalOpen(true);
                    }}
                  >
                    Rate Venue
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <PremiumBottomNav />
    </div>
  );
};

export default MyBookings;