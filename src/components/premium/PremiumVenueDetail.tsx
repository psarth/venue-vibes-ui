import { useState, useRef } from 'react';
import { ArrowLeft, Star, MapPin, Clock, ChevronLeft, ChevronRight, Wifi, Car, Droplets, Dumbbell, Coffee, ShieldCheck, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot, generateSlots } from '@/data/venues';

interface PremiumVenueDetailProps {
  venue: Venue;
  onBack: () => void;
  onBook: (slot: Slot) => void;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Changing Room': Droplets,
  'AC': Droplets,
  'Drinking Water': Droplets,
  'Equipment Rental': Dumbbell,
  'Cafeteria': Coffee,
  'First Aid': ShieldCheck,
  'Coaching': Dumbbell,
  'Floodlights': Dumbbell,
  'Pro Shop': Coffee,
};

export const PremiumVenueDetail = ({ venue, onBack, onBook }: PremiumVenueDetailProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'slots'>('details');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const slots = generateSlots(selectedDate);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < venue.gallery.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
      }
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      isToday: date.toDateString() === new Date().toDateString(),
    };
  };

  const groupedSlots = {
    morning: slots.filter(s => s.period === 'morning'),
    afternoon: slots.filter(s => s.period === 'afternoon'),
    evening: slots.filter(s => s.period === 'evening'),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Image Carousel Header */}
      <div className="relative">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-20 h-11 w-11 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-premium-lg transition-all hover:bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Image Carousel */}
        <div 
          ref={carouselRef}
          className="relative h-[280px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={venue.gallery[currentImageIndex]}
            alt={`${venue.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <button
              onClick={() => setCurrentImageIndex(prev => prev - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-premium-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {currentImageIndex < venue.gallery.length - 1 && (
            <button
              onClick={() => setCurrentImageIndex(prev => prev + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-premium-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {venue.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'w-6 bg-primary-foreground' 
                    : 'w-2 bg-primary-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Venue Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
              {venue.sport}
            </span>
            <h1 className="text-2xl font-bold text-primary-foreground font-display mb-1">{venue.name}</h1>
            <p className="text-primary-foreground/90 text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {venue.location}
            </p>
          </div>
        </div>

        {/* Rating Bar */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-warning/10 rounded-full">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-bold text-foreground">{venue.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{venue.reviewCount}+ reviews</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-bold text-primary font-display">₹{venue.pricePerHour}/hr</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 text-center font-semibold text-sm relative transition-colors ${
              activeTab === 'details' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Details
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`py-4 text-center font-semibold text-sm relative transition-colors ${
              activeTab === 'slots' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Book Slots
            {activeTab === 'slots' && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className={`pb-28 ${activeTab === 'slots' ? '' : 'px-4 py-4'}`}>
        {activeTab === 'details' ? (
          <div className="space-y-6 animate-fade-in">
            {/* Description */}
            <div className="card-premium p-4">
              <h2 className="text-lg font-bold font-display mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About
              </h2>
              <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
            </div>

            {/* Amenities */}
            <div className="card-premium p-4">
              <h2 className="text-lg font-bold font-display mb-4">Amenities</h2>
              <div className="grid grid-cols-3 gap-3">
                {venue.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Dumbbell;
                  return (
                    <div 
                      key={amenity}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 text-center"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rules */}
            <div className="card-premium p-4">
              <h2 className="text-lg font-bold font-display mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Venue Rules
              </h2>
              <ul className="space-y-2">
                {venue.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Date Selector */}
            <div className="sticky top-[57px] z-20 bg-background py-3 px-4 border-b border-border">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {dates.map((date) => {
                  const { day, date: dateNum, isToday } = formatDate(date);
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={`flex flex-col items-center min-w-[56px] py-2.5 px-3 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground shadow-premium-md' 
                          : 'bg-card border border-border hover:border-primary/30'
                      }`}
                    >
                      <span className={`text-xs font-medium ${isSelected ? '' : 'text-muted-foreground'}`}>
                        {isToday ? 'Today' : day}
                      </span>
                      <span className="text-lg font-bold">{dateNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots List */}
            <div className="px-4 py-4 space-y-6">
              {Object.entries(groupedSlots).map(([period, periodSlots]) => (
                <div key={period}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {period}
                  </h3>
                  <div className="space-y-2">
                    {periodSlots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                          !slot.available 
                            ? 'bg-muted/50 border-border opacity-60 cursor-not-allowed'
                            : selectedSlot?.id === slot.id
                              ? 'border-primary bg-primary/5 shadow-premium-md'
                              : 'bg-card border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            slot.available ? 'bg-success' : 'bg-muted-foreground'
                          }`} />
                          <span className="font-medium">{slot.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${slot.available ? 'text-primary' : 'text-muted-foreground'}`}>
                            ₹{slot.price}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            slot.available 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {slot.available ? 'Available' : 'Booked'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {activeTab === 'slots' && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 shadow-premium-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              {selectedSlot ? (
                <>
                  <p className="text-sm text-muted-foreground">{selectedSlot.time}</p>
                  <p className="text-xl font-bold text-primary font-display">₹{selectedSlot.price}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select a slot to continue</p>
              )}
            </div>
            <Button 
              className="h-12 px-8 btn-premium rounded-xl text-base font-semibold"
              disabled={!selectedSlot}
              onClick={() => selectedSlot && onBook(selectedSlot)}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};