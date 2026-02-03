import { useState, useRef } from 'react';
import { ArrowLeft, Star, MapPin, Clock, ChevronLeft, ChevronRight, Wifi, Car, Droplets, Dumbbell, Coffee, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot, generateSlots } from '@/data/venues';

interface VenueDetailProps {
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

export const PremiumVenueDetail = ({ venue, onBack, onBook }: VenueDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const slots = generateSlots(selectedDate);

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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      isToday: date.toDateString() === new Date().toDateString(),
    };
  };

  const groupedSlots = {
    morning: slots.filter(s => s.period === 'morning'),
    afternoon: slots.filter(s => s.period === 'afternoon'),
    evening: slots.filter(s => s.period === 'evening'),
  };

  const SERVICE_CHARGE_PERCENT = 3;
  const serviceCharge = selectedSlot ? Math.round(selectedSlot.price * SERVICE_CHARGE_PERCENT / 100) : 0;
  const totalPrice = selectedSlot ? selectedSlot.price + serviceCharge : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 bg-card border-b border-border flex items-center px-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="ml-3 flex-1 min-w-0">
          <h1 className="font-semibold truncate">{venue.name}</h1>
          <p className="text-xs text-muted-foreground truncate">{venue.location}</p>
        </div>
      </header>

      {/* Main Content - Two Column Layout on Desktop */}
      <div className="lg:flex lg:h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Venue Details */}
        <div className="lg:w-1/2 lg:overflow-y-auto lg:border-r lg:border-border">
          {/* Image Gallery */}
          <div 
            ref={galleryRef}
            className="relative h-56 lg:h-72 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={venue.gallery[currentImageIndex]}
              alt={`${venue.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {currentImageIndex > 0 && (
              <button
                onClick={() => setCurrentImageIndex(prev => prev - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {currentImageIndex < venue.gallery.length - 1 && (
              <button
                onClick={() => setCurrentImageIndex(prev => prev + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {venue.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Venue Info Bar */}
          <div className="bg-card border-b border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge-sport">{venue.sport}</span>
                <h2 className="text-lg font-bold font-display mt-2">{venue.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.location}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold">{venue.rating}</span>
                  <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
                </div>
                <p className="text-lg font-bold text-primary mt-1">₹{venue.pricePerHour}/hr</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-4 space-y-4">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{venue.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Dumbbell;
                  return (
                    <div key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rules */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Venue Rules
              </h3>
              <ul className="space-y-1.5">
                {venue.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Map Placeholder */}
            <div>
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="h-32 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                Map (Sample Google Maps API)
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Slot Selection */}
        <div className="lg:w-1/2 lg:flex lg:flex-col bg-card lg:bg-background">
          {/* Date Selector */}
          <div className="sticky top-14 lg:top-0 z-20 bg-card border-y border-border p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Date & Time
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {dates.map((date) => {
                const { day, date: dateNum, month, isToday } = formatDate(date);
                const isSelected = date.toDateString() === selectedDate.toDateString();
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={`flex flex-col items-center min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <span className={`text-xs ${isSelected ? '' : 'text-muted-foreground'}`}>
                      {isToday ? 'Today' : day}
                    </span>
                    <span className="text-lg font-bold">{dateNum}</span>
                    <span className={`text-xs ${isSelected ? '' : 'text-muted-foreground'}`}>{month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots Grid */}
          <div className="flex-1 p-4 pb-32 lg:overflow-y-auto space-y-6">
            {Object.entries(groupedSlots).map(([period, periodSlots]) => (
              <div key={period}>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 capitalize">
                  {period} Slots
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {periodSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isPeak = slot.price > 500;
                    
                    return (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`slot-cell relative ${
                          !slot.available ? 'booked' : isSelected ? 'selected' : 'available'
                        } ${isPeak && slot.available ? 'peak' : ''}`}
                      >
                        {isPeak && slot.available && (
                          <span className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5 rounded bg-warning/10 text-warning font-medium">
                            Peak
                          </span>
                        )}
                        <p className="text-xs font-medium">{slot.time.split(' - ')[0]}</p>
                        <p className={`text-sm font-bold ${isSelected ? '' : slot.available ? 'text-primary' : ''}`}>
                          ₹{slot.price}
                        </p>
                        {!slot.available && (
                          <p className="text-[10px]">Booked</p>
                        )}
                        {isSelected && (
                          <CheckCircle2 className="h-3 w-3 absolute bottom-1 right-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg lg:left-1/2">
        {selectedSlot ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{formatDate(selectedDate).day}, {formatDate(selectedDate).date} {formatDate(selectedDate).month}</p>
              <p className="text-sm font-medium">{selectedSlot.time}</p>
              <div className="text-xs text-muted-foreground mt-0.5">
                ₹{selectedSlot.price} + ₹{serviceCharge} service charge
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">₹{totalPrice}</p>
            </div>
            <Button 
              className="h-11 px-6 btn-premium"
              onClick={() => onBook(selectedSlot)}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Select a slot to continue</p>
        )}
      </div>
    </div>
  );
};