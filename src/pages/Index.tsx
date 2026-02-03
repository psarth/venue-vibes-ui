import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { TopBanner } from '@/components/TopBanner';
import { FilterBar } from '@/components/FilterBar';
import { VenueCard } from '@/components/VenueCard';
import { VenueDetail } from '@/components/VenueDetail';
import { BookingFlow } from '@/components/BookingFlow';
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
      <BookingFlow
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
      <VenueDetail 
        venue={selectedVenue} 
        onBack={handleBackToHome}
        onBook={handleBook}
      />
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Top Banner */}
      <TopBanner 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
      />

      {/* Filter Bar - Sticky below nav */}
      <FilterBar
        selectedSport={selectedSport}
        selectedPrice={selectedPrice}
        selectedAvailability={selectedAvailability}
        onSportChange={setSelectedSport}
        onPriceChange={setSelectedPrice}
        onAvailabilityChange={setSelectedAvailability}
      />

      {/* Venue Listings - 12px gap between cards */}
      <div className="px-4 py-4 space-y-3">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={() => handleVenueClick(venue)}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-foreground mb-2">No venues found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters to find available venues
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
