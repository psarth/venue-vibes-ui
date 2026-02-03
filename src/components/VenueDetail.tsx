import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Check, X, ChevronLeft, ChevronRight, Wifi, Car, Droplets, Wind, Dumbbell, Coffee, Shield, Clock, Zap, ShowerHead, Utensils, Video, ShoppingBag, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot, generateSlots } from '@/data/venues';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface VenueDetailProps {
  venue: Venue;
  onBack: () => void;
  onBook: (slot: Slot) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Parking': <Car className="h-5 w-5" />,
  'Changing Room': <ShowerHead className="h-5 w-5" />,
  'AC': <Wind className="h-5 w-5" />,
  'Drinking Water': <Droplets className="h-5 w-5" />,
  'Equipment Rental': <Dumbbell className="h-5 w-5" />,
  'Floodlights': <Zap className="h-5 w-5" />,
  'Restroom': <ShowerHead className="h-5 w-5" />,
  'First Aid': <Shield className="h-5 w-5" />,
  'Coaching': <Timer className="h-5 w-5" />,
  'Ball Machine': <Dumbbell className="h-5 w-5" />,
  'Cafeteria': <Utensils className="h-5 w-5" />,
  'Pro Shop': <ShoppingBag className="h-5 w-5" />,
  'Scoreboard': <Timer className="h-5 w-5" />,
  'Video Analysis': <Video className="h-5 w-5" />,
  'Equipment': <Dumbbell className="h-5 w-5" />,
  'Bowling Machine': <Dumbbell className="h-5 w-5" />,
  'WiFi': <Wifi className="h-5 w-5" />,
};

export const VenueDetail = ({ venue, onBack, onBook }: VenueDetailProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'slots'>('details');
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  // Generate slots for selected date
  const slots = useMemo(() => generateSlots(selectedDate), [selectedDate]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === venue.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? venue.gallery.length - 1 : prev - 1
    );
  };

  // Swipe handlers for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStart(null);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header - 56px height for proper touch targets */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-4 px-4 h-14">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-foreground truncate leading-tight">{venue.name}</h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{venue.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel - Swipeable with 5+ images */}
      <div 
        className="relative h-56 bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={venue.gallery[currentImageIndex]}
          alt={`${venue.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {venue.gallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-card/95 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-card/95 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            {/* Image counter & dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-foreground/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {venue.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    index === currentImageIndex 
                      ? "w-4 bg-primary-foreground" 
                      : "w-2 bg-primary-foreground/50 hover:bg-primary-foreground/70"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-foreground">{venue.rating}</span>
          <span className="text-xs text-muted-foreground">({venue.reviewCount}+)</span>
        </div>
      </div>

      {/* Tab Buttons - Equal width, 48px height for touch */}
      <div className="flex border-b-2 border-border bg-card">
        <button
          onClick={() => setActiveTab('details')}
          className={cn(
            "flex-1 h-12 text-base font-semibold transition-colors relative",
            activeTab === 'details' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Details
          {activeTab === 'details' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={cn(
            "flex-1 h-12 text-base font-semibold transition-colors relative",
            activeTab === 'slots' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Slots
          {activeTab === 'slots' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Details Tab Content */}
      {activeTab === 'details' && (
        <div className="divide-y divide-border">
          {/* Description - 16px padding */}
          <div className="px-4 py-4 bg-card">
            <h2 className="font-bold text-lg text-foreground mb-3">About this venue</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {venue.description}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Whether you're a beginner looking to learn the basics or a seasoned player wanting to practice your skills, this venue offers the perfect environment. The well-maintained facilities and professional setup ensure a great experience every time you visit.
            </p>
          </div>

          {/* Amenities with icons - Grid layout */}
          <div className="px-4 py-4 bg-card">
            <h2 className="font-bold text-lg text-foreground mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {venue.amenities.map((amenity) => (
                <div 
                  key={amenity} 
                  className="flex items-center gap-3 p-3 bg-accent/40 rounded-xl border border-border/50"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {amenityIcons[amenity] || <Check className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium text-foreground leading-tight">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules - Clear numbered list */}
          <div className="px-4 py-4 bg-card">
            <h2 className="font-bold text-lg text-foreground mb-4">Venue Rules</h2>
            <ul className="space-y-3">
              {venue.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed pt-1">{rule}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{venue.rules.length + 1}</span>
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed pt-1">Please arrive 10 minutes before your slot time</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Slots Tab Content */}
      {activeTab === 'slots' && (
        <div>
          {/* Date Selector - Horizontal scroll */}
          <div className="px-4 py-4 border-b border-border bg-card">
            <h2 className="font-bold text-lg text-foreground mb-3">Select Date</h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {dates.map((date) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={cn(
                      "flex flex-col items-center min-w-[64px] py-2.5 px-3 rounded-xl border-2 transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      isSelected ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {isToday ? 'Today' : format(date, 'EEE')}
                    </span>
                    <span className="text-xl font-bold">{format(date, 'd')}</span>
                    <span className={cn(
                      "text-xs",
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>{format(date, 'MMM')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot List */}
          <div className="px-4 py-4 bg-card">
            <h2 className="font-bold text-lg text-foreground mb-3">Available Slots</h2>
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                    !slot.available && "opacity-50 cursor-not-allowed bg-muted border-muted",
                    slot.available && selectedSlot?.id !== slot.id && "hover:border-primary/50 bg-card border-border",
                    selectedSlot?.id === slot.id && "border-primary bg-primary/5 shadow-md"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      slot.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                    )}>
                      {slot.available ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-base text-foreground">{slot.time}</p>
                      <p className="text-sm text-muted-foreground capitalize">{slot.period} slot</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">₹{slot.price}</p>
                    <p className={cn(
                      "text-xs font-medium",
                      slot.available ? "text-green-600" : "text-red-500"
                    )}>
                      {slot.available ? 'Available' : 'Booked'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 z-50 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            {selectedSlot ? (
              <>
                <p className="text-sm text-muted-foreground">{format(selectedDate, 'EEE, d MMM')} • {selectedSlot.time}</p>
                <p className="text-2xl font-bold text-primary">₹{selectedSlot.price}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-2xl font-bold text-primary">₹{venue.pricePerHour}/hr</p>
              </>
            )}
          </div>
          <Button 
            size="lg" 
            className="h-12 px-8 text-base font-semibold"
            disabled={!selectedSlot}
            onClick={() => selectedSlot && onBook(selectedSlot)}
          >
            {selectedSlot ? 'Book Now' : 'Select a Slot'}
          </Button>
        </div>
      </div>
    </div>
  );
};
