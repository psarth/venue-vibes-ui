import { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Star, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Venue, Slot, generateSlots } from '@/data/venues';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface VenueDetailProps {
  venue: Venue;
  onBack: () => void;
}

const amenityIcons: Record<string, string> = {
  'Parking': '🅿️',
  'Changing Room': '🚿',
  'AC': '❄️',
  'Drinking Water': '💧',
  'Equipment Rental': '🏸',
  'Floodlights': '💡',
  'Restroom': '🚻',
  'First Aid': '🩹',
  'Coaching': '👨‍🏫',
  'Ball Machine': '⚾',
  'Cafeteria': '☕',
  'Pro Shop': '🛒',
  'Scoreboard': '📊',
  'Video Analysis': '📹',
  'Equipment': '🎾',
  'Bowling Machine': '🎳',
};

export const VenueDetail = ({ venue, onBack }: VenueDetailProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate">{venue.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{venue.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-accent px-2 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{venue.rating}</span>
            <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content with Tabs for Mobile */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full h-auto p-1 bg-muted rounded-none grid grid-cols-2">
          <TabsTrigger 
            value="details" 
            className="py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-primary"
          >
            Venue Details
          </TabsTrigger>
          <TabsTrigger 
            value="booking" 
            className="py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-primary"
          >
            Slots & Booking
          </TabsTrigger>
        </TabsList>

        {/* Venue Details Tab */}
        <TabsContent value="details" className="mt-0 focus-visible:ring-0">
          {/* Image Gallery */}
          <div className="relative aspect-[16/10] bg-muted">
            <img
              src={venue.gallery[currentImageIndex]}
              alt={`${venue.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {venue.gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {venue.gallery.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        index === currentImageIndex ? "bg-primary-foreground" : "bg-primary-foreground/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className="px-4 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="px-4 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map((amenity) => (
                <Badge 
                  key={amenity} 
                  variant="outline"
                  className="bg-accent/50 border-border text-foreground py-1.5 px-3"
                >
                  <span className="mr-1.5">{amenityIcons[amenity] || '✓'}</span>
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="px-4 py-4">
            <h2 className="font-semibold text-foreground mb-3">Rules</h2>
            <ul className="space-y-2">
              {venue.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* Slots & Booking Tab */}
        <TabsContent value="booking" className="mt-0 focus-visible:ring-0">
          {/* Date Selector */}
          <div className="px-4 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground mb-3">Select Date</h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {dates.map((date) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={cn(
                      "flex flex-col items-center min-w-[60px] py-2 px-3 rounded-lg border transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-xs font-medium">{format(date, 'EEE')}</span>
                    <span className="text-lg font-bold">{format(date, 'd')}</span>
                    <span className="text-xs">{format(date, 'MMM')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot List */}
          <div className="px-4 py-4">
            <h2 className="font-semibold text-foreground mb-3">Available Slots</h2>
            <div className="space-y-2">
              {slots.map((slot) => (
                <Card
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  className={cn(
                    "p-3 border cursor-pointer transition-all",
                    !slot.available && "opacity-50 cursor-not-allowed bg-muted",
                    slot.available && "hover:border-primary/50",
                    selectedSlot?.id === slot.id && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        slot.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {slot.available ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{slot.time}</p>
                        <p className="text-xs text-muted-foreground capitalize">{slot.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{slot.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {slot.available ? 'Available' : 'Booked'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sticky Booking CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            {selectedSlot ? (
              <>
                <p className="text-sm text-muted-foreground">{selectedSlot.time}</p>
                <p className="text-xl font-bold text-primary">₹{selectedSlot.price}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-xl font-bold text-primary">₹{venue.pricePerHour}/hr</p>
              </>
            )}
          </div>
          <Button 
            size="lg" 
            className="px-8 font-semibold"
            disabled={!selectedSlot}
          >
            {selectedSlot ? 'Book Now' : 'Select a Slot'}
          </Button>
        </div>
      </div>
    </div>
  );
};
