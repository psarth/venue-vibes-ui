import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, CreditCard, Shield, Check, Smartphone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, Slot } from '@/data/venues';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PremiumBookingFlowProps {
  venue: Venue;
  slot: Slot;
  selectedDate: Date;
  onBack: () => void;
  onComplete: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';
type Step = 'summary' | 'payment' | 'success';

export const PremiumBookingFlow = ({ venue, slot, selectedDate, onBack, onComplete }: PremiumBookingFlowProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('summary');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const basePrice = slot.price;
  const serviceFee = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + serviceFee;

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login required',
        description: 'Please login to complete your booking',
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would create the booking in the database here
    // For demo, we'll generate a mock reference
    const mockReference = 'SP' + format(new Date(), 'yyMMdd') + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingReference(mockReference);
    
    setIsProcessing(false);
    setStep('success');
  };

  const paymentMethods = [
    { id: 'upi' as PaymentMethod, label: 'UPI', icon: Smartphone, description: 'Pay with any UPI app' },
    { id: 'card' as PaymentMethod, label: 'Card', icon: CreditCard, description: 'Credit or Debit Card' },
    { id: 'netbanking' as PaymentMethod, label: 'Net Banking', icon: Building2, description: 'All major banks' },
  ];

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background bg-pattern flex flex-col">
        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center animate-scale-in">
            {/* Success Icon */}
            <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-success flex items-center justify-center shadow-premium-lg">
                <Check className="h-8 w-8 text-success-foreground" />
              </div>
            </div>

            <h1 className="text-2xl font-bold font-display mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">Your slot has been successfully booked</p>

            {/* Booking Details Card */}
            <div className="card-premium p-6 text-left mb-6">
              <div className="text-center mb-4 pb-4 border-b border-border">
                <p className="text-xs text-muted-foreground">Booking Reference</p>
                <p className="text-xl font-mono font-bold text-primary">{bookingReference}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{venue.name}</p>
                    <p className="text-sm text-muted-foreground">{venue.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">{slot.time}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-xl font-bold text-primary font-display">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full h-12 btn-premium rounded-xl text-base font-semibold"
                onClick={() => navigate('/bookings')}
              >
                View My Bookings
              </Button>
              <Button 
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium"
                onClick={onComplete}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-premium-sm">
        <div className="flex items-center gap-4 h-14 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold font-display">
              {step === 'summary' ? 'Booking Summary' : 'Payment'}
            </h1>
            <p className="text-xs text-muted-foreground">Step {step === 'summary' ? '1' : '2'} of 2</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-32">
        {step === 'summary' && (
          <div className="space-y-4 animate-fade-in">
            {/* Venue Info */}
            <div className="card-premium p-4">
              <div className="flex gap-4">
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-1">
                    {venue.sport}
                  </span>
                  <h3 className="font-bold font-display">{venue.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {venue.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Slot Details */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{format(selectedDate, 'EEEE, MMM d')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Slot</p>
                      <p className="font-medium">{slot.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-3">Price Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">₹{basePrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service Charge (5%)</span>
                  <span className="font-medium">₹{serviceFee}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary font-display">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4 animate-fade-in">
            {/* Secure Payment Badge */}
            <div className="flex items-center justify-center gap-2 py-3 bg-success/10 rounded-xl">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-success">100% Secure Payment</span>
            </div>

            {/* Payment Methods */}
            <div className="card-premium p-4">
              <h3 className="font-semibold font-display mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      selectedPayment === method.id ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <method.icon className={`h-6 w-6 ${
                        selectedPayment === method.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {selectedPayment === method.id && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Summary */}
            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold text-primary font-display">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 shadow-premium-xl">
        {step === 'summary' ? (
          <Button 
            className="w-full h-12 btn-premium rounded-xl text-base font-semibold"
            onClick={() => setStep('payment')}
          >
            Proceed to Payment
          </Button>
        ) : (
          <Button 
            className="w-full h-12 btn-premium rounded-xl text-base font-semibold"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="animate-pulse-soft">Processing Payment...</span>
            ) : (
              `Pay ₹${totalPrice}`
            )}
          </Button>
        )}
      </div>
    </div>
  );
};