
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, X, Check, Shield, CreditCard, Smartphone, Building2, Calendar as CalendarIcon, Clock, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot, generateSlots } from '@/data/venues';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSlotPrice, isSlotBlocked, listenForPriceUpdates, listenForVenueUpdates, listenForFeeUpdates } from '@/utils/venueSync';

interface PremiumBookingFlowProps {
  venue: Venue;
  initialSport: string;
  onBack: () => void;
  onComplete: () => void;
}

type BookingStep = 'SLOT' | 'REVIEW' | 'PAYMENT' | 'SUCCESS';

export const PremiumBookingFlow = ({ venue, initialSport, onBack, onComplete }: PremiumBookingFlowProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('SLOT');

  // Slot Selection State
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [courtType, setCourtType] = useState<'Standard' | 'Premium'>('Standard');

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'full' | 'advance'>('full');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Sync Listeners
  useEffect(() => {
    const unsubPrice = listenForPriceUpdates(() => setUpdateTrigger(t => t + 1));
    const unsubVenue = listenForVenueUpdates(() => setUpdateTrigger(t => t + 1));
    const unsubFees = listenForFeeUpdates(() => setUpdateTrigger(t => t + 1));

    return () => {
      unsubPrice();
      unsubVenue();
      unsubFees();
    };
  }, []);

  // Derived Data
  const slots = useMemo(() => {
    const baseSlots = generateSlots(selectedDate, venue.pricePerHour);
    const venueId = venue.id.includes('_') ? venue.id.split('_')[0] : venue.id;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    return baseSlots.map(slot => ({
      ...slot,
      price: getSlotPrice(venueId, selectedSport, dateStr, slot.id, slot.price),
      available: slot.available && !isSlotBlocked(venueId, selectedSport, dateStr, slot.id)
    }));
  }, [selectedDate, venue.id, venue.pricePerHour, selectedSport, updateTrigger]);

  const getUnitLabel = (sport: string) => {
    const s = sport.toLowerCase();
    if (s.includes('cricket') || s.includes('football')) return 'Turf';
    if (s.includes('table tennis') || s.includes('snooker')) return 'Table';
    if (s.includes('swimming')) return 'Lane';
    return 'Court';
  };

  const unitLabel = getUnitLabel(selectedSport);

  const platformFee = useMemo(() => {
    if (venue.isFeeEnabled === false) return 0;
    const fee = venue.convenienceFee ?? 50;
    const type = venue.feeType || 'fixed';

    if (type === 'percentage' && selectedSlot) {
      return Math.round((selectedSlot.price * fee) / 100);
    }
    return fee;
  }, [venue.isFeeEnabled, venue.convenienceFee, venue.feeType, selectedSlot]);

  const calculateTotal = () => {
    if (!selectedSlot) return 0;
    let price = selectedSlot.price;
    if (courtType === 'Premium') price += 200;
    return price + platformFee;
  };

  const totalAmount = calculateTotal();
  const payableAmount = paymentOption === 'advance' ? Math.round(totalAmount * 0.2) : totalAmount;

  // 🔥 PRICE RE-VALIDATION (SECURITY)
  const [priceWarning, setPriceWarning] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSlot && currentStep !== 'SLOT' && currentStep !== 'SUCCESS') {
      const venueId = venue.id.includes('_') ? venue.id.split('_')[0] : venue.id;
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const latestPrice = getSlotPrice(venueId, selectedSport, dateStr, selectedSlot.id, selectedSlot.price);

      if (latestPrice !== selectedSlot.price) {
        setPriceWarning(`Wait! The price was just updated to ₹${latestPrice}. Please review the new total.`);
        setSelectedSlot(prev => prev ? { ...prev, price: latestPrice } : null);
      }
    }
  }, [updateTrigger, selectedSlot, venue.id, selectedSport, selectedDate, currentStep]);

  const groupedSlots = {
    morning: slots.filter(s => s.period === 'morning'),
    afternoon: slots.filter(s => s.period === 'afternoon'),
    evening: slots.filter(s => s.period === 'evening'),
  };

  // Handlers
  const handleSlotSelect = (slot: Slot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (currentStep === 'SLOT' && selectedSlot) {
      setPriceWarning(null); // Clear any old warnings
      setCurrentStep('REVIEW');
    }
    else if (currentStep === 'REVIEW') {
      // Final re-validation check
      const venueId = venue.id.includes('_') ? venue.id.split('_')[0] : venue.id;
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const latestPrice = getSlotPrice(venueId, selectedSport, dateStr, selectedSlot!.id, selectedSlot!.price);

      if (latestPrice !== selectedSlot!.price) {
        toast({
          title: "Price Changed",
          description: "Price was updated. Please confirm new amount.",
          variant: "destructive"
        });
        setSelectedSlot(prev => prev ? { ...prev, price: latestPrice } : null);
        return;
      }
      setCurrentStep('PAYMENT');
    }
  };

  const handleBack = () => {
    if (currentStep === 'SLOT') onBack();
    else if (currentStep === 'REVIEW') setCurrentStep('SLOT');
    else if (currentStep === 'PAYMENT') setCurrentStep('REVIEW');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setCurrentStep('SUCCESS');
  };

  // Render Steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 'SLOT':
        return (
          <div className="pb-24 animate-fade-in-up">
            {/* Date Selection */}
            <div className="bg-white p-4 sticky top-14 z-30 shadow-sm border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Select Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-primary text-sm font-semibold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                      <CalendarIcon className="w-4 h-4" />
                      {format(selectedDate, 'MMM dd')}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => d && setSelectedDate(d)}
                      initialFocus
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[...Array(7)].map((_, i) => {
                  const d = addDays(new Date(), i);
                  const isSelected = isSameDay(d, selectedDate);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(d)}
                      className={cn(
                        "flex flex-col items-center min-w-[4.5rem] py-2.5 rounded-xl border transition-all",
                        isSelected
                          ? "bg-primary text-white border-primary shadow-md shadow-blue-200"
                          : "bg-white text-gray-600 border-gray-200"
                      )}
                    >
                      <span className="text-[10px] font-medium uppercase">{format(d, 'EEE')}</span>
                      <span className="text-lg font-bold">{format(d, 'dd')}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selection Section: Units and Type */}
            <div className="p-4 bg-white mt-2 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  Select {unitLabel}
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Required</span>
                </h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {Array.from({ length: venue.sportResources?.[selectedSport] || 1 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedUnit(num)}
                      className={cn(
                        "flex-1 min-w-[70px] py-3 rounded-xl border-2 transition-all font-bold text-sm",
                        selectedUnit === num
                          ? "border-primary bg-blue-50 text-primary shadow-sm"
                          : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {unitLabel} {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Facility Type</h3>
                <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl font-display">
                  {['Standard', 'Premium'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCourtType(type as any)}
                      className={cn(
                        "py-2 text-xs font-bold rounded-lg transition-all",
                        courtType === type
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {courtType === 'Premium' && (
                  <p className="text-[10px] text-blue-600 mt-2 flex items-center gap-1.5 font-medium">
                    <Info className="w-3 h-3" /> Premium facility with extra amenities (+₹200)
                  </p>
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div className="p-4 bg-white mt-2 space-y-6">
              {['Morning', 'Afternoon', 'Evening'].map((period) => {
                const periodSlots = groupedSlots[period.toLowerCase() as keyof typeof groupedSlots];
                if (periodSlots.length === 0) return null;

                return (
                  <div key={period}>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{period}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {periodSlots.map((slot) => (
                        <button
                          key={slot.id}
                          disabled={!slot.available}
                          onClick={() => handleSlotSelect(slot)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-semibold transition-all relative overflow-hidden",
                            !slot.available
                              ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                              : selectedSlot?.id === slot.id
                                ? "bg-primary text-white border-primary shadow-lg shadow-blue-200 ring-2 ring-primary ring-offset-1"
                                : "bg-white text-gray-800 border-gray-200 hover:border-primary/50"
                          )}
                        >
                          {slot.time}
                          {!slot.available && <div className="absolute inset-0 bg-white/40 pointer-events-none" />}
                          {!slot.available && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-bl-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        );

      case 'REVIEW':
        return (
          <div className="p-4 pb-28 animate-fade-in-up space-y-4">
            {/* Review Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

              <h3 className="text-lg font-bold text-gray-900 mb-6 relative z-10">Booking Summary</h3>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Venue</p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">{venue.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{venue.location}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-bold text-gray-900 text-sm">{format(selectedDate, 'dd MMM, yyyy')}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="font-bold text-gray-900 text-sm">{selectedSlot?.time}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-dashed border-gray-200">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-medium uppercase">Selected {unitLabel}</span>
                    <span className="text-sm font-bold text-gray-900">{unitLabel} {selectedUnit} ({courtType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">{courtType}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Base Slot Price</span>
                    <span>₹{selectedSlot?.price}</span>
                  </div>
                  {courtType === 'Premium' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Premium Charges</span>
                      <span>₹200</span>
                    </div>
                  )}
                  {venue.isFeeEnabled !== false && (
                    <div className="flex justify-between text-sm text-blue-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> Platform Fee
                      </span>
                      <span>₹{platformFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                {priceWarning && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2.5 animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-amber-700 leading-tight">{priceWarning}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Payment Options</h3>
              <div className="space-y-3">
                <div
                  onClick={() => setPaymentOption('full')}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                    paymentOption === 'full' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", paymentOption === 'full' ? "border-primary" : "border-gray-300")}>
                      {paymentOption === 'full' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Pay Full Amount</p>
                      <p className="text-xs text-gray-500">Fast checkout</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">₹{totalAmount}</span>
                </div>

                <div
                  onClick={() => setPaymentOption('advance')}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                    paymentOption === 'advance' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", paymentOption === 'advance' ? "border-primary" : "border-gray-300")}>
                      {paymentOption === 'advance' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Pay 20% Advance</p>
                      <p className="text-xs text-gray-500">Pay rest at venue</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">₹{Math.round(totalAmount * 0.2)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PAYMENT':
        return (
          <div className="p-4 pb-28 animate-fade-in-up">
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-3 mb-6">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-700 text-sm">100% Safe & Secure</h4>
                <p className="text-xs text-green-600 mt-0.5">Your payment details are encrypted and secure.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Pay via</h3>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Amount to pay</p>
                  <p className="text-xl font-bold text-primary">₹{payableAmount}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[{ id: 'upi', label: 'UPI Apps', icon: Smartphone }, { id: 'card', label: 'Credit/Debit Card', icon: CreditCard }, { id: 'netbanking', label: 'Net Banking', icon: Building2 }].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border transition-all",
                      selectedPayment === method.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-white border-gray-100 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", selectedPayment === method.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400")}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-left font-semibold text-gray-900">{method.label}</span>
                    {selectedPayment === method.id && <Check className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'SUCCESS':
        return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-scale-in">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-short">
              <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your slot at {venue.name} has been successfully booked.</p>

            {/* Booking Ticket Card */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 w-full max-w-xs mb-8 relative">
              {/* Punch Holes */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full" />
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full" />

              <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking ID</p>
                <p className="text-base font-mono font-bold text-gray-900">#VB-{Math.floor(Math.random() * 10000)}</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-bold text-gray-900">{format(selectedDate, 'dd MMM yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-bold text-gray-900">{selectedSlot?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount Paid</span>
                  <span className="text-sm font-bold text-green-600">₹{payableAmount}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="w-32 h-32 bg-white p-2 rounded-xl border border-gray-200">
                  {/* Mock QR Code */}
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-[10px] grid grid-cols-4 gap-0.5 overflow-hidden opacity-80">
                    {[...Array(16)].map((_, i) => <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Scan at venue for entry</p>
            </div>

            <Button onClick={onComplete} className="w-full max-w-xs h-12 rounded-xl text-base font-bold">
              Download Ticket
            </Button>
            <button onClick={onComplete} className="mt-4 text-sm font-semibold text-gray-600 hover:text-gray-900">
              Back to Home
            </button>
          </div>
        );
    }
  };

  if (currentStep === 'SUCCESS') return renderStepContent();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="text-center">
            <h2 className="font-bold text-gray-900 text-sm">{
              currentStep === 'SLOT' ? 'Select Date & Time' :
                currentStep === 'REVIEW' ? 'Review Booking' : 'Payment'
            }</h2>
            <p className="text-xs text-gray-500">{venue.name}</p>
          </div>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Steps Progress */}
      {currentStep !== 'SLOT' && (
        <div className="bg-white px-6 py-3 flex items-center justify-center gap-2 border-b border-gray-50">
          <div className="h-1 flex-1 rounded-full bg-green-500" />
          <div className={cn("h-1 flex-1 rounded-full transition-all", currentStep === 'REVIEW' ? "bg-primary" : "bg-green-500")} />
          <div className={cn("h-1 flex-1 rounded-full transition-all", currentStep === 'PAYMENT' ? "bg-primary" : "bg-gray-200")} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {renderStepContent()}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center gap-4">
          {currentStep === 'SLOT' && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium uppercase">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {selectedSlot ? `₹${selectedSlot.price}` : '₹0'}
              </span>
            </div>
          )}
          {currentStep === 'REVIEW' && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium uppercase">To Pay</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{payableAmount}
              </span>
            </div>
          )}

          <Button
            className={cn("flex-1 h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-200 transition-all", !selectedSlot && "opacity-50 cursor-not-allowed shadow-none")}
            onClick={currentStep === 'PAYMENT' ? handlePayment : handleContinue}
            disabled={(currentStep === 'SLOT' && !selectedSlot) || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">Processing...</span>
            ) : (
              currentStep === 'SLOT' ? 'Continue' :
                currentStep === 'REVIEW' ? 'Proceed to Pay' :
                  `Pay ₹${payableAmount}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};