import { useState, useEffect } from 'react';
import { Venue, Slot, generateSlots } from '@/data/venues';

type BookingStep = 'SPORT' | 'RESOURCE' | 'SLOT' | 'PAYMENT';

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

interface BookingState {
  sport: Sport | null;
  resource: Resource | null;
  slot: Slot | null;
  step: BookingStep;
}

interface BookingControllerProps {
  venue: Venue;
  selectedDate: Date;
  onBack: () => void;
  onBook: (slot: Slot) => void;
  children: (state: BookingState & {
    sports: Sport[];
    resources: Resource[];
    slots: Slot[];
    selectSport: (sport: Sport) => void;
    selectResource: (resource: Resource) => void;
    selectSlot: (slot: Slot) => void;
    goBack: () => void;
    proceedToPay: () => void;
    getResourceLabel: () => string;
  }) => React.ReactNode;
}

export const BookingController = ({ venue, selectedDate, onBack, onBook, children }: BookingControllerProps) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    sport: null,
    resource: null,
    slot: null,
    step: 'SPORT'
  });

  // Sports data
  const sports: Sport[] = venue.name === 'Multi Sport Test Arena'
    ? [
        { id: 'cricket', name: 'Cricket' },
        { id: 'football', name: 'Football' },
        { id: 'badminton', name: 'Badminton' }
      ]
    : [{ id: venue.sport.toLowerCase().replace(' ', '-'), name: venue.sport }];

  function getResourceType(sport: string): 'TURF' | 'COURT' | 'TABLE' | 'POOL' {
    const sportLower = sport.toLowerCase();
    if (sportLower.includes('cricket') || sportLower.includes('football')) return 'TURF';
    if (sportLower.includes('snooker') || sportLower.includes('pool') || sportLower.includes('billiards')) return 'TABLE';
    if (sportLower.includes('swimming')) return 'POOL';
    return 'COURT';
  }

  // Resources mapped to sports
  const allResources: Resource[] = venue.name === 'Multi Sport Test Arena'
    ? [
        { id: 'cricket-1', name: 'Cricket Ground 1', sportId: 'cricket', type: 'TURF', available: true },
        { id: 'cricket-2', name: 'Cricket Ground 2', sportId: 'cricket', type: 'TURF', available: true },
        { id: 'football-1', name: 'Football Turf A', sportId: 'football', type: 'TURF', available: true },
        { id: 'football-2', name: 'Football Turf B', sportId: 'football', type: 'TURF', available: false },
        { id: 'badminton-1', name: 'Badminton Court 1', sportId: 'badminton', type: 'COURT', available: true },
        { id: 'badminton-2', name: 'Badminton Court 2', sportId: 'badminton', type: 'COURT', available: true }
      ]
    : [
        { id: 'resource-1', name: `${venue.sport} ${getResourceType(venue.sport)} 1`, sportId: venue.sport.toLowerCase().replace(' ', '-'), type: getResourceType(venue.sport), available: true },
        { id: 'resource-2', name: `${venue.sport} ${getResourceType(venue.sport)} 2`, sportId: venue.sport.toLowerCase().replace(' ', '-'), type: getResourceType(venue.sport), available: true }
      ];

  // Get resources for selected sport ONLY
  const resources = bookingState.sport
    ? allResources.filter(r => r.sportId === bookingState.sport!.id && r.available)
    : [];

  // Auto-select on mount ONLY when step is SPORT
  useEffect(() => {
    if (bookingState.step !== 'SPORT') return;
    
    if (sports.length === 1) {
      const sport = sports[0];
      const sportResources = allResources.filter(r => r.sportId === sport.id && r.available);
      
      if (sportResources.length === 1) {
        setBookingState({
          sport,
          resource: sportResources[0],
          slot: null,
          step: 'SLOT'
        });
      } else {
        setBookingState({
          sport,
          resource: null,
          slot: null,
          step: 'RESOURCE'
        });
      }
    }
  }, []);

  // Generate slots ONLY when sport AND resource are selected
  const slots = bookingState.sport && bookingState.resource
    ? generateSlots(selectedDate)
    : [];

  const selectSport = (sport: Sport) => {
    const sportResources = allResources.filter(r => r.sportId === sport.id && r.available);

    if (sportResources.length === 1) {
      setBookingState({
        sport,
        resource: sportResources[0],
        slot: null,
        step: 'SLOT'
      });
    } else {
      setBookingState({
        sport,
        resource: null,
        slot: null,
        step: 'RESOURCE'
      });
    }
  };

  const selectResource = (resource: Resource) => {
    setBookingState(prev => ({
      ...prev,
      resource,
      step: 'SLOT'
    }));
  };

  const selectSlot = (slot: Slot) => {
    setBookingState(prev => ({
      ...prev,
      slot,
      step: 'PAYMENT'
    }));
  };

  const goBack = () => {
    if (bookingState.step === 'PAYMENT') {
      setBookingState(prev => ({ ...prev, step: 'SLOT' }));
    } else if (bookingState.step === 'SLOT') {
      if (resources.length > 1) {
        setBookingState(prev => ({ ...prev, step: 'RESOURCE' }));
      } else if (sports.length > 1) {
        setBookingState(prev => ({ ...prev, step: 'SPORT' }));
      } else {
        onBack();
      }
    } else if (bookingState.step === 'RESOURCE') {
      if (sports.length > 1) {
        setBookingState(prev => ({ ...prev, step: 'SPORT' }));
      } else {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const proceedToPay = () => {
    if (bookingState.slot) {
      onBook(bookingState.slot);
    }
  };

  const getResourceLabel = () => {
    if (!bookingState.sport) return 'Select Resource';
    const resourceType = allResources.find(r => r.sportId === bookingState.sport!.id)?.type || 'COURT';
    switch (resourceType) {
      case 'TURF': return 'Select Turf';
      case 'COURT': return 'Select Court';
      case 'TABLE': return 'Select Table';
      case 'POOL': return 'Select Pool';
      default: return 'Select Resource';
    }
  };

  return (
    <>
      {children({
        ...bookingState,
        sports,
        resources,
        slots,
        selectSport,
        selectResource,
        selectSlot,
        goBack,
        proceedToPay,
        getResourceLabel
      })}
    </>
  );
};