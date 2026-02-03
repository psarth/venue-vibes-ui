import { useState, useMemo } from 'react';
import { 
  PremiumNavbar, 
  PremiumBanner, 
  PremiumFilterBar, 
  PremiumVenueCard,
  PremiumVenueDetail,
  PremiumBookingFlow
} from '@/components/premium';
import { venues, Venue, Slot } from '@/data/venues';

type View = 'home' | 'detail' | 'booking';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedPrice, setSelectedPrice] = useState('default');
  const [selectedAvailability, setSelectedAvailability] = useState('available');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('home');

  const filteredVenues = useMemo(() => {
    let filtered = venues.filter((venue) => venue.city === selectedCity);

    // Filter by sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter((venue) => venue.sport === selectedSport);
    }

    // Sort by price
    if (selectedPrice === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (selectedPrice === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.pricePerHour - a.pricePerHour);
    }

    return filtered;
  }, [selectedCity, selectedSport, selectedPrice, selectedAvailability]);

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setCurrentView('detail');
  };

  const handleBook = (slot: Slot) => {
    setSelectedSlot(slot);
    setCurrentView('booking');
  };

  const handleBackToHome = () => {
    setSelectedVenue(null);
    setSelectedSlot(null);
    setCurrentView('home');
  };

  const handleBackToDetail = () => {
    setSelectedSlot(null);
    setCurrentView('detail');
  };

  // Booking Flow View
  if (currentView === 'booking' && selectedVenue && selectedSlot) {
    return (
      <PremiumBookingFlow
        venue={selectedVenue}
        slot={selectedSlot}
        selectedDate={selectedDate}
        onBack={handleBackToDetail}
        onComplete={handleBackToHome}
      />
    );
  }

  // Venue Detail View
  if (currentView === 'detail' && selectedVenue) {
    return (
      <PremiumVenueDetail 
        venue={selectedVenue} 
        onBack={handleBackToHome}
        onBook={handleBook}
      />
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Sticky Navigation */}
      <PremiumNavbar />

      {/* Top Banner */}
      <PremiumBanner 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
      />

      {/* Filter Bar - Sticky below nav */}
      <PremiumFilterBar
        selectedSport={selectedSport}
        selectedPrice={selectedPrice}
        selectedAvailability={selectedAvailability}
        onSportChange={setSelectedSport}
        onPriceChange={setSelectedPrice}
        onAvailabilityChange={setSelectedAvailability}
      />

      {/* Venue Listings */}
      <div className="px-4 py-4 space-y-4">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue, index) => (
            <div 
              key={venue.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <PremiumVenueCard
                venue={venue}
                onClick={() => handleVenueClick(venue)}
              />
            </div>
          ))
        ) : (
          <div className="card-premium p-8 text-center animate-fade-in">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold font-display text-foreground mb-2">No venues found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to find available venues
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;