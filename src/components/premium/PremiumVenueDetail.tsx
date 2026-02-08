
import { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft, Star, MapPin, Clock, Share2, Bookmark,
  ChevronRight, Wifi, Car, Droplets, Dumbbell, Coffee,
  ShieldCheck, Trophy, Zap, Users, Bath, Shirt, Wind,
  Info, MessageSquare, History, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/data/venues';
import { cn } from "@/lib/utils";
import { listenForVenueUpdates } from '@/utils/venueSync';
import { VenueReviewList } from '@/components/reviews/VenueReviewList';
import { getVenueStats } from '@/utils/reviewStorage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { VenueReviewForm } from '@/components/reviews/VenueReviewForm';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { user, demoUser } = useAuth();
  const [currentVenue, setCurrentVenue] = useState(venue);
  const [selectedSport, setSelectedSport] = useState(() => {
    if (venue.sport === 'Multi-Sport' && venue.sports && venue.sports.length > 0) {
      return venue.sports[0];
    }
    return venue.sport || (venue.sports && venue.sports.length > 0 ? venue.sports[0] : 'Badminton');
  });
  const [hasPastBooking, setHasPastBooking] = useState(false);
  const [eligibleBookingId, setEligibleBookingId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewUpdateTrigger, setReviewUpdateTrigger] = useState(0);

  const stats = useMemo(() => {
    return getVenueStats(venue.name);
  }, [venue.name, reviewUpdateTrigger]);

  useEffect(() => {
    const checkEligibility = async () => {
      if (demoUser) {
        if (venue.name.includes('Smash Zone')) {
          setHasPastBooking(true);
          setEligibleBookingId('3');
        }
        return;
      }
      if (!user) return;
      const { data } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(1);

      if (data && data.length > 0) {
        setHasPastBooking(true);
        setEligibleBookingId(data[0].id);
      }
    };
    checkEligibility();
  }, [user, demoUser, venue.id]);

  useEffect(() => {
    const unsub = listenForVenueUpdates((updated) => {
      if (updated.id === venue.id.split('_')[0]) {
        setCurrentVenue(prev => ({
          ...prev,
          ...updated,
          image: updated.images?.[0] || prev.image,
          gallery: updated.images || prev.gallery
        }));
      }
    });
    return unsub;
  }, [venue.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sports = useMemo(() => {
    let list = [];
    if (currentVenue.sports && currentVenue.sports.length > 0) {
      list = currentVenue.sports;
    } else {
      list = [currentVenue.sport].filter(Boolean);
    }
    // Filter out 'Multi-Sport' from the selection list as it's a category, not a bookable sport
    return list.filter(s => s !== 'Multi-Sport');
  }, [currentVenue.sports, currentVenue.sport]);

  const getResourceLabel = (sport: string) => {
    const s = sport.toLowerCase();
    if (s.includes('cricket')) return 'Pitch';
    if (s.includes('football')) return 'Turf';
    if (s.includes('badminton') || s.includes('tennis') || s.includes('squash') || s.includes('basketball') || s.includes('volleyball')) return 'Court';
    if (s.includes('table tennis') || s.includes('snooker') || s.includes('billiards')) return 'Table';
    if (s.includes('swimming')) return 'Lane';
    if (s.includes('gym')) return 'Station';
    return 'Slot';
  };

  // Helper to get count for a sport
  const getSportCount = (sport: string) => {
    return currentVenue.sportResources?.[sport] || 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* 1. HERO SECTION - Immersive */}
      <div className="relative h-[45vh] min-h-[350px] w-full overflow-hidden">
        <img
          src={currentVenue.image}
          alt={currentVenue.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center z-10 w-full max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all shadow-xl">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all shadow-xl">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Venue Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 w-full max-w-5xl mx-auto text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                  Verified Venue
                </Badge>
                <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-black shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-current" /> {stats.avg || currentVenue.rating}
                  <span className="text-[10px] opacity-60 font-bold">({stats.count || currentVenue.reviewCount} Reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-[0.9] drop-shadow-xl">
                {currentVenue.name}
              </h1>

              <div className="flex items-center gap-4 text-white/90">
                <span className="text-sm md:text-base font-bold flex items-center gap-1.5 drop-shadow-md">
                  <MapPin className="w-4 h-4 text-blue-400" /> {currentVenue.location.split(',')[0]}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="text-sm md:text-base font-bold flex items-center gap-1.5 drop-shadow-md">
                  <Clock className="w-4 h-4 text-green-400" /> Open: 6 AM - 11 PM
                </span>
              </div>
            </div>

            {/* Price Highlight for Mobile only (Footer still exists) */}
            <div className="md:hidden flex flex-col items-start bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl self-start">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Pricing</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">₹{currentVenue.pricePerHour}</span>
                <span className="text-xs font-bold text-white/60">/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT - Optimized Grid */}
      <div className="w-full flex-1 -mt-10 bg-white md:bg-transparent rounded-t-[2.5rem] relative z-20 pb-32">
        <div className="max-w-5xl mx-auto px-4 md:px-0">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Essential Details & Tabs */}
            <div className="lg:col-span-2 space-y-8 bg-white md:rounded-[2.5rem] md:p-8 md:shadow-sm border-gray-100">

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full bg-gray-50/80 p-1.5 rounded-2xl mb-8 border border-gray-100 h-14 backdrop-blur-sm">
                  <TabsTrigger value="overview" className="flex-1 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary h-full">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="amenities" className="flex-1 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary h-full">
                    Facilities
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary h-full">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
                  {/* About Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Info className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 font-display">About Venue</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-none">
                      {currentVenue.description}
                    </p>
                  </section>

                  {/* Sport Selection Grid */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 font-display">Choose Sport</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {sports.map((sport) => {
                        const isActive = selectedSport === sport;
                        const label = getResourceLabel(sport);
                        const count = getSportCount(sport);

                        return (
                          <button
                            key={sport}
                            onClick={() => setSelectedSport(sport)}
                            className={cn(
                              "flex flex-col items-center justify-center p-5 rounded-[1.5rem] border-2 transition-all duration-300 group",
                              isActive
                                ? "bg-primary border-primary shadow-xl shadow-blue-100 scale-[1.02]"
                                : "bg-white border-gray-100 hover:border-primary/20 hover:bg-gray-50"
                            )}
                          >
                            <span className={cn(
                              "text-sm font-black mb-1 transition-colors",
                              isActive ? "text-white" : "text-gray-900"
                            )}>
                              {sport}
                            </span>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider transition-colors",
                              isActive ? "text-white/60" : "text-gray-400 group-hover:text-primary/60"
                            )}>
                              {count} {count > 1 ? label + 's' : label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="amenities" className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentVenue.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <div
                          key={amenity}
                          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl group"
                        >
                          <div className="p-3 bg-white rounded-2xl mb-3 shadow-sm group-hover:bg-primary/5 transition-colors">
                            <Icon className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                          </div>
                          <span className="text-[10px] font-black text-gray-500 text-center uppercase tracking-widest group-hover:text-primary">
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 font-display">User Reviews</h3>
                    </div>
                    {hasPastBooking && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold border-primary text-primary hover:bg-primary/5 text-xs shadow-sm"
                        onClick={() => setIsReviewModalOpen(true)}
                      >
                        Rate Experience
                      </Button>
                    )}
                  </div>
                  <VenueReviewList venueId={venue.name} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Dynamic Info Sidebar (Desktop Only) */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8 sticky top-24">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Venue Information</h4>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-tight">Full Address</p>
                        <p className="text-sm font-bold text-gray-700 leading-snug mt-1">{currentVenue.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-tight">Operation Hours</p>
                        <p className="text-sm font-bold text-gray-700 mt-1">Daily: 6:00 AM - 11:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-tight">Features</p>
                        <p className="text-sm font-bold text-gray-700 mt-1">Verified Partner</p>
                        <p className="text-xs font-medium text-gray-400">Secure Payments Enabled</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500">Base Price</span>
                    <span className="text-lg font-black text-gray-900 tracking-tight">₹{currentVenue.pricePerHour}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Final price may vary based on slot selection and platform fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STICKY FOOTER - Premium Action (Universal) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.12)] z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6 px-2">
          <div className="hidden sm:flex flex-col">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Sport</p>
            <p className="text-xl font-black text-primary leading-none uppercase tracking-tighter">
              {selectedSport} <span className="text-gray-300 px-1">/</span> <span className="text-sm text-gray-400">₹{currentVenue.pricePerHour}</span>
            </p>
          </div>

          <Button
            onClick={() => onBook(selectedSport)}
            className="flex-1 lg:flex-none lg:w-96 h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-blue-400 transition-all active:scale-[0.96] flex items-center justify-center gap-2 group"
          >
            Go to Scheduling <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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