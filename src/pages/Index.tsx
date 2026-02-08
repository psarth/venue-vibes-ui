
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { venues, Venue, Slot } from '@/data/venues';
import { FilterBar } from '@/components/home/FilterBar';
import { LocationSelector } from '@/components/home/LocationSelector';
import { VenueSection } from '@/components/home/VenueSection';
import { HomeBottomNav } from '@/components/home/HomeBottomNav';
import {
  PremiumVenueDetail,
} from '@/components/premium';
import { PremiumBookingFlow } from '@/components/premium/PremiumBookingFlow';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Bell, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getVenuesBySport, listenForVenueUpdates, listenForPriceUpdates, listenForSlotBlocking, listenForFeeUpdates, type VenueData } from '@/utils/venueSync';

type View = 'home' | 'detail' | 'booking';

const Index = () => {
  // State
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedBookingSport, setSelectedBookingSport] = useState<string>('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('venue-vibes-location') || 'Kolkata');
  const [syncedVenues, setSyncedVenues] = useState<VenueData[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render on sync
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Handle pre-filled state from Find Player page
  useEffect(() => {
    if (location.state && (syncedVenues.length > 0 || venues.length > 0)) {
      const { sport, date, city, venueId } = location.state as any;
      if (sport) setSelectedSport(sport);
      if (city) setSelectedCity(city);
      if (date) setSelectedDate(new Date(date));

      if (venueId) {
        // Look in both local and synced venues
        const allPossible = [...venues];
        const venue = allPossible.find(v => v.id === venueId);
        if (venue) {
          setSelectedVenue(venue);
          setCurrentView('detail');
        }
      }
    }
  }, [location.state, syncedVenues]);

  // 🔥 REAL-TIME SYNC: Listen for venue updates
  useEffect(() => {
    const unsubscribeVenue = listenForVenueUpdates(() => {
      setUpdateTrigger(prev => prev + 1);
      console.log('🔄 Venue updated - refreshing customer view');
    });

    const unsubscribePrice = listenForPriceUpdates(() => {
      setUpdateTrigger(prev => prev + 1);
      console.log('🔄 Prices updated - refreshing customer view');
    });

    const unsubscribeSlots = listenForSlotBlocking(() => {
      setUpdateTrigger(prev => prev + 1);
      console.log('🔄 Slots updated - refreshing customer view');
    });

    const unsubscribeFees = listenForFeeUpdates(() => {
      setUpdateTrigger(prev => prev + 1);
      console.log('🔄 Fees updated - refreshing customer view');
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customer_venues' || e.key === 'customer_slot_prices' || e.key === 'customer_blocked_slots') {
        setUpdateTrigger(prev => prev + 1);
        console.log(`🔄 Storage changed (${e.key}) - refreshing customer view`);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribeVenue();
      unsubscribePrice();
      unsubscribeSlots();
      unsubscribeFees();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update localStorage when city changes
  useEffect(() => {
    localStorage.setItem('venue-vibes-location', selectedCity);
  }, [selectedCity]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      navigate('/profile');
    } else if (tab === 'my-games') {
      navigate('/bookings');
    } else if (tab === 'find-player') {
      navigate('/find-player');
    }
  };

  // Handlers
  const handleVenueClick = (venue: Venue) => {
    window.scrollTo(0, 0);
    setSelectedVenue(venue);
    // Reset booking sport to default from venue or first sport
    setSelectedBookingSport(venue.sport || 'Badminton');
    setCurrentView('detail');
  };

  const handleBook = (sport: string) => {
    window.scrollTo(0, 0);
    setSelectedBookingSport(sport);
    setCurrentView('booking');
  };

  const handleBackToHome = () => {
    window.scrollTo(0, 0);
    setSelectedVenue(null);
    setCurrentView('home');
  };

  const handleBackToDetail = () => {
    window.scrollTo(0, 0);
    setCurrentView('detail');
  };

  const [localVenues, setLocalVenues] = useState<Venue[]>(venues);


  // 🔥 LOAD SYNCED VENUES FROM CUSTOMER STORAGE
  useEffect(() => {
    const loadSyncedVenues = () => {
      const customerVenues = localStorage.getItem('customer_venues');
      if (customerVenues) {
        const parsed: any[] = JSON.parse(customerVenues);
        // Filter only approved and live venues
        const liveVenues = parsed.filter(v => v.status === 'approved' || v.status === undefined);
        setSyncedVenues(liveVenues);
        console.log('✅ Loaded verified venues:', liveVenues.length);
      }
    };

    loadSyncedVenues();
  }, [updateTrigger]); // Re-load when sync events trigger

  // 🔥 Update selected venue if data changes while viewing
  useEffect(() => {
    if (selectedVenue) {
      const updated = syncedVenues.find(v => v.id === selectedVenue.id.split('_')[0]);
      if (updated) {
        // Map back to Venue format
        const sport = selectedVenue.sport;
        const newVenueData: Venue = {
          id: `${updated.id}_${sport}`,
          name: updated.name,
          location: updated.address,
          city: updated.city || 'Kolkata',
          sport: sport,
          pricePerHour: updated.pricePerSlot,
          rating: updated.rating || 4.5,
          reviewCount: selectedVenue.reviewCount,
          image: updated.images[0] || selectedVenue.image,
          gallery: updated.images || selectedVenue.gallery,
          description: updated.description || '',
          amenities: updated.amenities || [],
          rules: selectedVenue.rules,
          sports: updated.sports,
          sportResources: updated.sportResources,
          convenienceFee: updated.convenienceFee,
          feeType: updated.feeType,
          isFeeEnabled: updated.isFeeEnabled
        };
        setSelectedVenue(newVenueData);
      }
    }
  }, [syncedVenues]);

  // 🔥 SPORT-WISE FILTER LOGIC WITH REAL-TIME SYNC
  const sections = useMemo(() => {
    const allExpanded: Venue[] = [];

    // Helper to process any venue object (local or mapped synced)
    const addExpandedEntries = (v: any) => {
      const venueSports = v.sports || (v.sport ? [v.sport] : []);
      // Requirement: If it has multiple sports, show it in 'Multiple Sport Venue' section
      // and also in each of its respective sport sections.
      const isMulti = venueSports.length > 1 || v.sport === 'Multi-Sport';

      if (isMulti) {
        allExpanded.push({
          ...v,
          id: `${v.id}_Multi-Sport`,
          sport: 'Multi-Sport'
        });
      }

      // Also add to each individual sport it supports
      venueSports.forEach((s: string) => {
        if (s !== 'Multi-Sport') {
          allExpanded.push({
            ...v,
            id: `${v.id}_${s}`,
            sport: s
          });
        }
      });
    };

    // 1. Process local static venues
    localVenues.forEach(addExpandedEntries);

    // 2. Process synced venues from owners
    syncedVenues.forEach(sv => {
      const mappedVenue: any = {
        id: sv.id,
        name: sv.name,
        location: sv.address,
        city: sv.city || 'Kolkata',
        pricePerHour: sv.pricePerSlot,
        rating: sv.rating || 4.5,
        reviewCount: 0,
        image: sv.images[0] || 'https://images.unsplash.com/photo-1626224583764-847890e05851?w=800&q=80',
        gallery: sv.images || [],
        description: sv.description || '',
        amenities: sv.amenities || ['Parking', 'Water'],
        rules: [],
        sports: sv.sports,
        sportResources: sv.sportResources,
        convenienceFee: sv.convenienceFee,
        feeType: sv.feeType,
        isFeeEnabled: sv.isFeeEnabled
      };
      addExpandedEntries(mappedVenue);
    });

    // 3. Filter by City (Strict match)
    const cityFiltered = allExpanded.filter(v => v.city === selectedCity);

    console.log(`📍 Filtering for ${selectedCity}: Found ${cityFiltered.length} logical entries`);

    // 4. Filter by Sport selection from FilterBar
    let filtered = cityFiltered;
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter(v => v.sport === selectedSport);
    }

    // 5. Group by sport for rendering sections
    const groups: { [key: string]: Venue[] } = {};
    filtered.forEach(venue => {
      if (!groups[venue.sport]) groups[venue.sport] = [];
      groups[venue.sport].push(venue);
    });

    // 6. Sort groups so Multi-Sport appears first if it exists
    const sortedSportKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Multi-Sport') return -1;
      if (b === 'Multi-Sport') return 1;
      return a.localeCompare(b);
    });

    // Return array of sections with readable titles
    return sortedSportKeys.map((sport) => ({
      title: sport === 'Multi-Sport' ? 'Multiple Sport Venues' : sport,
      data: groups[sport]
    }));
  }, [selectedSport, selectedAvailability, selectedCity, syncedVenues, localVenues, updateTrigger]);

  // Views
  if (currentView === 'booking' && selectedVenue) {
    return (
      <PremiumBookingFlow
        venue={selectedVenue}
        initialSport={selectedBookingSport}
        onBack={handleBackToDetail}
        onComplete={handleBackToHome}
      />
    );
  }

  if (currentView === 'detail' && selectedVenue) {
    return (
      <PremiumVenueDetail
        venue={selectedVenue}
        onBack={handleBackToHome}
        onBook={handleBook}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative pb-24 font-sans">
      {/* Premium Blue Header - Realistic Gradient & Clean */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 pt-safe-top pb-6 rounded-b-[2rem] shadow-lg shadow-blue-500/20 z-50 sticky top-0 transition-all">
        <div className="px-6 pt-4">
          <div className="flex justify-between items-center">
            {/* Left: Location Selector */}
            <div className="flex gap-2.5 items-center">
              <LocationSelector selectedCity={selectedCity} onSelectCity={setSelectedCity} />
            </div>

            {/* Right: Notification Icon */}
            <button className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95 shadow-sm">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-blue-400 shadow-sm"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar Section - Sticky below header */}
      <div className="sticky top-[86px] z-40 bg-gray-50/95 backdrop-blur-md pb-4 pt-2 transition-all mt-2">
        <FilterBar
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
          selectedAvailability={selectedAvailability}
          onSelectAvailability={setSelectedAvailability}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6 animate-fade-in-up px-0 pt-4">
        {/* Venue Sections */}
        <div className="space-y-8 pb-24">
          {sections.length > 0 ? (
            sections.map((section) => (
              <VenueSection
                key={section.title}
                title={section.title}
                venues={section.data}
                onVenueClick={handleVenueClick}
              />
            ))
          ) : (
            <div className="text-center py-20 px-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm inline-block mb-4">
                <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">No venues found</h3>
              <button
                onClick={() => { setSelectedSport('All Sports'); setSelectedAvailability('All'); }}
                className="mt-4 text-primary font-semibold text-sm hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Bottom Navigation */}
      <HomeBottomNav currentTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;