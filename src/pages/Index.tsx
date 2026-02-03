import { useState, useMemo } from 'react';
import { TopBanner } from '@/components/TopBanner';
import { FilterBar } from '@/components/FilterBar';
import { VenueCard } from '@/components/VenueCard';
import { VenueDetail } from '@/components/VenueDetail';
import { venues, Venue } from '@/data/venues';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedPrice, setSelectedPrice] = useState('default');
  const [selectedAvailability, setSelectedAvailability] = useState('available');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

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

  if (selectedVenue) {
    return (
      <VenueDetail 
        venue={selectedVenue} 
        onBack={() => setSelectedVenue(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <TopBanner 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
      />

      {/* Filter Bar */}
      <FilterBar
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
          filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={() => setSelectedVenue(venue)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No venues found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
