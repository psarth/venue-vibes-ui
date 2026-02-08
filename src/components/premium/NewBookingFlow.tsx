import { useState, useEffect, useMemo } from 'react';
import { Info, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot, generateSlots } from '@/data/venues';
import { format } from 'date-fns';
import { getSlotPrice, isSlotBlocked, listenForFeeUpdates } from '@/utils/venueSync';

interface NewBookingFlowProps {
  venue: Venue;
  selectedDate: Date;
  onBack: () => void;
  onPayment: (bookingData: {
    sport: string;
    resource: string;
    slot: Slot;
    total: number;
  }) => void;
}

type BookingStep = 1 | 2 | 3 | 4;

interface Sport {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  name: string;
  sportId: string;
  type: 'TURF' | 'COURT' | 'TABLE' | 'POOL';
  available: boolean;
}

export const NewBookingFlow = ({ venue, selectedDate, onBack, onPayment }: NewBookingFlowProps) => {
  // SINGLE SOURCE OF TRUTH: One state variable only
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);

  // Booking data state
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [priceChangedWarning, setPriceChangedWarning] = useState(false);


  useEffect(() => {
    const unsubFees = listenForFeeUpdates(() => setUpdateTrigger(t => t + 1));
    return unsubFees;
  }, []);

  const platformFee = useMemo(() => {
    if (venue.isFeeEnabled === false) return 0;
    const fee = venue.convenienceFee ?? 50;
    const type = venue.feeType || 'fixed';

    if (type === 'percentage' && selectedSlot) {
      return Math.round((selectedSlot.price * fee) / 100);
    }
    return fee;
  }, [venue.isFeeEnabled, venue.convenienceFee, venue.feeType, selectedSlot, updateTrigger]);

  const [priceWarning, setPriceWarning] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSlot && bookingStep === 4) {
      const venueId = venue.id.includes('_') ? venue.id.split('_')[0] : venue.id;
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const latestPrice = getSlotPrice(venueId, selectedSport?.name || '', dateStr, selectedSlot.id, selectedSlot.price);

      if (latestPrice !== selectedSlot.price) {
        setPriceWarning(`Wait! The price was just updated to ₹${latestPrice}. Please review the new total.`);
        setSelectedSlot(prev => prev ? { ...prev, price: latestPrice } : null);
      }
    }
  }, [updateTrigger, selectedSlot, venue.id, selectedSport, selectedDate, bookingStep]);

  // Data definitions
  const sports: Sport[] = useMemo(() => {
    if (venue.name === 'Multi Sport Test Arena') {
      return [
        { id: 'cricket', name: 'Cricket' },
        { id: 'football', name: 'Football' },
        { id: 'badminton', name: 'Badminton' }
      ];
    }

    // Use the sports array if available, otherwise fallback to single sport
    const activeSports = (venue.sports && venue.sports.length > 0) ? venue.sports : [venue.sport];
    return activeSports.filter(Boolean).map(s => ({
      id: s.toLowerCase().replace(' ', '-'),
      name: s
    }));
  }, [venue]);

  const allResources: Resource[] = useMemo(() => {
    if (venue.name === 'Multi Sport Test Arena') {
      return [
        { id: 'cricket-1', name: 'Cricket Ground 1', sportId: 'cricket', type: 'TURF', available: true },
        { id: 'cricket-2', name: 'Cricket Ground 2', sportId: 'cricket', type: 'TURF', available: true },
        { id: 'football-1', name: 'Football Turf A', sportId: 'football', type: 'TURF', available: true },
        { id: 'football-2', name: 'Football Turf B', sportId: 'football', type: 'TURF', available: false },
        { id: 'badminton-1', name: 'Badminton Court 1', sportId: 'badminton', type: 'COURT', available: true },
        { id: 'badminton-2', name: 'Badminton Court 2', sportId: 'badminton', type: 'COURT', available: true }
      ];
    }

    const resources: Resource[] = [];
    sports.forEach(sport => {
      const count = venue.sportResources?.[sport.name] || 2;
      const type = getResourceType(sport.name);
      const typeLabel = type === 'TURF' ? 'Turf' : type === 'TABLE' ? 'Table' : type === 'POOL' ? 'Lane' : 'Court';

      for (let i = 1; i <= count; i++) {
        resources.push({
          id: `${sport.id}-${i}`,
          name: `${sport.name} ${typeLabel} ${i}`,
          sportId: sport.id,
          type: type,
          available: true
        });
      }
    });
    return resources;
  }, [venue, sports]);

  function getResourceType(sport: string): 'TURF' | 'COURT' | 'TABLE' | 'POOL' {
    const sportLower = sport.toLowerCase();
    if (sportLower.includes('cricket') || sportLower.includes('football')) return 'TURF';
    if (sportLower.includes('snooker') || sportLower.includes('pool') || sportLower.includes('billiards')) return 'TABLE';
    if (sportLower.includes('swimming')) return 'POOL';
    return 'COURT';
  }

  // Filtered resources based on selected sport
  const availableResources = selectedSport
    ? allResources.filter(r => r.sportId === selectedSport.id)
    : [];

  // Generate slots only when sport and resource are selected
  const availableSlots = useMemo(() => {
    if (!(bookingStep === 3 && selectedSport && selectedResource)) return [];

    const baseSlots = generateSlots(selectedDate, venue.pricePerHour);
    const venueId = venue.id.includes('_') ? venue.id.split('_')[0] : venue.id;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    return baseSlots.map(slot => ({
      ...slot,
      price: getSlotPrice(venueId, selectedSport.name, dateStr, slot.id, slot.price),
      available: slot.available && !isSlotBlocked(venueId, selectedSport.name, dateStr, slot.id)
    }));
  }, [bookingStep, selectedSport, selectedResource, selectedDate, venue.id, venue.pricePerHour, updateTrigger]);

  // STEP 1 LOGIC: Auto-select sport if only one exists
  useEffect(() => {
    if (bookingStep !== 1) return;
    if (sports.length === 1) {
      handleSportSelect(sports[0]);
    }
  }, [bookingStep]);

  // STEP 2 LOGIC: Auto-select resource if only one exists
  useEffect(() => {
    if (bookingStep !== 2 || !selectedSport) return;
    const available = availableResources.filter(r => r.available);
    if (available.length === 1) {
      handleResourceSelect(available[0]);
    }
  }, [bookingStep, selectedSport, availableResources]);

  // Handlers
  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    setSelectedResource(null);
    setSelectedSlot(null);
    setBookingStep(2);
  };

  const handleResourceSelect = (resource: Resource) => {
    setSelectedResource(resource);
    setSelectedSlot(null);
    setBookingStep(3);
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setBookingStep(4);
  };

  const handleGoBack = () => {
    if (bookingStep === 4) setBookingStep(3);
    else if (bookingStep === 3) {
      if (availableResources.filter(r => r.available).length > 1) {
        setBookingStep(2);
      } else if (sports.length > 1) {
        setBookingStep(1);
      } else {
        onBack();
      }
    }
    else if (bookingStep === 2) {
      if (sports.length > 1) {
        setBookingStep(1);
      } else {
        onBack();
      }
    }
    else onBack();
  };

  const handleProceedToPayment = () => {
    if (selectedSport && selectedResource && selectedSlot) {
      onPayment({
        sport: selectedSport.name,
        resource: selectedResource.name,
        slot: selectedSlot,
        total: selectedSlot.price + platformFee
      });
    }
  };

  const getResourceLabel = () => {
    if (!selectedSport) return 'Resource';
    const resourceType = allResources.find(r => r.sportId === selectedSport.id)?.type || 'COURT';
    switch (resourceType) {
      case 'TURF': return 'Turf';
      case 'COURT': return 'Court';
      case 'TABLE': return 'Table';
      case 'POOL': return 'Pool';
      default: return 'Resource';
    }
  };

  // Render functions for each step
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Sport</h2>
        <p className="text-muted-foreground">Choose the sport you want to play</p>
      </div>
      <div className="grid gap-4">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => handleSportSelect(sport)}
            className="w-full p-6 rounded-2xl border-2 border-border hover:border-primary/50 transition-all bg-card text-left"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">
                  {sport.name === 'Badminton' ? '🏸' :
                    sport.name === 'Football' ? '⚽' :
                      sport.name === 'Cricket' ? '🏏' : '🎾'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{sport.name}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select {selectedSport?.name} {getResourceLabel()}</h2>
        <p className="text-muted-foreground">Choose your preferred {selectedSport?.name.toLowerCase()} facility</p>
      </div>
      <div className="grid gap-4">
        {availableResources.map((resource) => (
          <button
            key={resource.id}
            disabled={!resource.available}
            onClick={() => handleResourceSelect(resource)}
            className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${resource.available
              ? 'border-border hover:border-primary/50 bg-card'
              : 'border-muted bg-muted/30 opacity-60 cursor-not-allowed'
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{resource.name}</h3>
                <p className={`text-sm ${resource.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {resource.available ? 'Available' : 'Not Available'}
                </p>
              </div>
              <div className={`h-4 w-4 rounded-full ${resource.available ? 'bg-green-600' : 'bg-red-600'
                }`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const groupedSlots = {
      morning: availableSlots.filter(s => s.period === 'morning'),
      afternoon: availableSlots.filter(s => s.period === 'afternoon'),
      evening: availableSlots.filter(s => s.period === 'evening'),
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Select Time Slot</h2>
          <p className="text-muted-foreground">Choose your preferred time for {selectedResource?.name}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {/* Date selector could go here if needed */}
        </div>

        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([period, slots]) => (
            <div key={period}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 capitalize">
                {period} Slots
              </h3>
              <div className="grid gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => handleSlotSelect(slot)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${slot.available
                      ? 'border-border hover:border-primary/50 bg-card'
                      : 'border-muted bg-muted/30 opacity-60 cursor-not-allowed'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{slot.time}</h3>
                        <p className={`text-sm ${slot.available ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {slot.available ? 'Available' : 'Booked'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{slot.price}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Booking Summary</h2>
        <p className="text-muted-foreground">Review your booking details</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/30 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Sport</span>
          <span className="font-medium">{selectedSport?.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{selectedResource?.type}</span>
          <span className="font-medium">{selectedResource?.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{selectedSlot?.time}</span>
        </div>
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Base Slot Price</span>
            <span>₹{selectedSlot?.price}</span>
          </div>
          {venue.isFeeEnabled !== false && (
            <div className="flex justify-between items-center text-sm text-blue-500 font-medium">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Platform Fee
              </span>
              <span>₹{platformFee}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold text-xl pt-2 border-t border-border/50">
            <span>Total Payable</span>
            <span className="text-primary">₹{(selectedSlot?.price || 0) + platformFee}</span>
          </div>
        </div>

        {priceWarning && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2.5 animate-pulse">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-[11px] font-bold text-amber-700 leading-tight">{priceWarning}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-700">100% Secure Payment</span>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (bookingStep) {
      case 1: return 'Select Sport';
      case 2: return `Select ${getResourceLabel()}`;
      case 3: return 'Select Time Slot';
      case 4: return 'Booking Summary';
      default: return 'Book Now';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/30">
        <div className="flex items-center gap-4 h-16 px-4">
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{getStepTitle()}</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onBack}>
            <span className="text-xl">×</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* STEP 1: Select Sport */}
          {bookingStep === 1 && renderStep1()}

          {/* STEP 2: Select Resource */}
          {bookingStep === 2 && renderStep2()}

          {/* STEP 3: Select Slot */}
          {bookingStep === 3 && renderStep3()}

          {/* STEP 4: Summary & Payment */}
          {bookingStep === 4 && renderStep4()}
        </div>
      </main>

      {/* MOBILE PAYMENT BUTTON - STICKY BOTTOM */}
      {bookingStep === 4 && selectedSlot && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 z-50 sm:static sm:bg-transparent sm:border-t-0 sm:p-6 sm:max-w-2xl sm:mx-auto">
          <Button
            className="w-full h-12 font-semibold rounded-xl"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </div>
      )}
    </div>
  );
};
