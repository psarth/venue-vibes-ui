import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Share2, Bookmark, ChevronRight, Wifi, Car, Droplets, Dumbbell, Coffee, ShieldCheck, Trophy, Zap, Users, Bath, Shirt, Wind, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot } from '@/data/venues';
import { cn } from "@/lib/utils";
import { listenForVenueUpdates } from '@/utils/venueSync';

interface VenueDetailProps {
  venue: Venue;
  onBack: () => void;
  onBook: (sport: string) => void;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Changing Room': Shirt,
  'AC': Wind,
  'Drinking Water': Droplets,
  'Equipment Rental': Dumbbell,
  'Cafeteria': Coffee,
  'First Aid': ShieldCheck,
  'Washroom': Bath,
  'Flood Lights': Zap,
  'Seating Area': Users,
  'Restroom': Bath,
  'CCTV': ShieldCheck,
};

export const PremiumVenueDetail = ({ venue, onBack, onBook }: VenueDetailProps) => {
  const [currentVenue, setCurrentVenue] = useState(venue);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSport, setSelectedSport] = useState(currentVenue.sport || 'Badminton');

  // Real-time sync
  useEffect(() => {
    const unsub = listenForVenueUpdates((updated) => {
      if (updated.id === venue.id.split('_')[0]) {
        setCurrentVenue(prev => ({
          ...prev,
          name: updated.name,
          location: updated.address,
          description: updated.description,
          amenities: updated.amenities || [],
          sports: updated.sports,
          sportResources: updated.sportResources,
          image: updated.images[0] || prev.image,
          gallery: updated.images || prev.gallery
        }));
      }
    });
    return unsub;
  }, [venue.id]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sports list - use real sports from venue
  const sports = useMemo(() => {
    if (currentVenue.sports && currentVenue.sports.length > 0) return currentVenue.sports;
    return [currentVenue.sport].filter(Boolean);
  }, [currentVenue.sports, currentVenue.sport]);

  const currentResourceCount = useMemo(() => {
    return currentVenue.sportResources?.[selectedSport] || 1;
  }, [currentVenue.sportResources, selectedSport]);

  const getResourceLabel = (sport: string) => {
    const s = sport.toLowerCase();
    if (s.includes('cricket') || s.includes('football')) return 'Turfs';
    if (s.includes('table tennis') || s.includes('snooker')) return 'Tables';
    if (s.includes('swimming')) return 'Lanes';
    return 'Courts';
  };

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      {/* HEADER Section */}
      <div className="relative h-72 w-full">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={currentVenue.image}
            alt={currentVenue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
        </div>

        {/* Top Bar Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/30 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/30 transition-all">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Venue Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentVenue.name}</h1>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  {currentVenue.rating} <Star className="w-3 h-3 fill-black text-black" />
                </span>
                <span className="text-sm text-blue-100">({currentVenue.reviewCount} Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 py-6 space-y-8 animate-fade-in-up">

        {/* Location & Timings */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="text-sm text-gray-500 leading-snug mt-0.5">{currentVenue.location}</p>
              <p className="text-xs font-medium text-primary mt-1">2.5 km away from you</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-1">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Timings</h3>
              <p className="text-sm text-gray-500 mt-0.5">Open today • 6:00 AM - 11:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Facility Info</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                This venue has <span className="font-bold text-primary">{currentResourceCount} {getResourceLabel(selectedSport)}</span> available for booking.
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* Facility Breakdown Section */}
        {currentVenue.sportResources && Object.keys(currentVenue.sportResources).length > 0 && (
          <div className="bg-gray-50/80 rounded-3xl p-5 border border-gray-100/50 space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base leading-none">Facility Breakdown</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(currentVenue.sportResources).map(([sport, count]) => (
                <div key={sport} className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{sport}</span>
                  <span className="text-sm font-bold text-primary">{count} {getResourceLabel(sport)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100 w-full" />

        {/* Sports Selection */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Select Sport</h3>
          <div className="flex flex-wrap gap-3">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  selectedSport === sport
                    ? "bg-primary text-white border-primary shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* Amenities */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-gray-900 text-lg">Amenities</h3>
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full border border-gray-100">{currentVenue.amenities.length} Available</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {currentVenue.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Wifi;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary/20 hover:bg-primary/5 transition-all group"
                >
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-primary">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* About */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">About Venue</h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">{venue.description}</p>
        </div>

      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => onBook(selectedSport)}
            className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Review Modal Popups */}
      {isReviewModalOpen && (
        <VenueReviewForm
          venueId={venue.name}
          venueName={venue.name}
          bookingId={eligibleBookingId || ''}
          userId={user?.id || demoUser?.id?.toString() || ''}
          userName={user?.email?.split('@')[0] || demoUser?.name || 'Player'}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => setReviewUpdateTrigger(prev => prev + 1)}
        />
      )}
    </div>
  );
};

// Internal Badge Component for cleaner look
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-2 py-0.5 text-xs rounded-full font-medium", className)}>
    {children}
  </span>
);