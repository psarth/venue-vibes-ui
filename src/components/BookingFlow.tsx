import { useState } from 'react';
import { ArrowLeft, Check, Shield, CreditCard, Wallet, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Venue, Slot } from '@/data/venues';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BookingFlowProps {
  venue: Venue;
  slot: Slot;
  selectedDate: Date;
  onBack: () => void;
  onComplete: () => void;
}

type BookingStep = 'summary' | 'payment' | 'success';

export const BookingFlow = ({ venue, slot, selectedDate, onBack, onComplete }: BookingFlowProps) => {
  const [step, setStep] = useState<BookingStep>('summary');
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');

  const basePrice = slot.price;
  const convenienceFee = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + convenienceFee;

  const paymentMethods = [
    { id: 'upi', name: 'UPI / Google Pay / PhonePe', icon: <Wallet className="h-5 w-5" /> },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'netbanking', name: 'Net Banking', icon: <Building className="h-5 w-5" /> },
  ];

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Success Icon */}
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-center mb-8">
            Your slot has been successfully booked. We've sent the details to your registered email.
          </p>

          {/* Booking Details Card */}
          <Card className="w-full p-4 bg-card border-border mb-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-semibold text-foreground">SP{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Venue</span>
                <span className="font-medium text-foreground">{venue.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{format(selectedDate, 'EEE, d MMM yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{slot.time}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-lg text-primary">₹{totalPrice}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <Button className="w-full h-12 text-base font-semibold" onClick={onComplete}>
              View My Bookings
            </Button>
            <Button variant="outline" className="w-full h-12 text-base font-semibold" onClick={onComplete}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={step === 'summary' ? onBack : () => setStep('summary')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">
            {step === 'summary' ? 'Booking Summary' : 'Payment'}
          </h1>
        </div>
      </div>

      {step === 'summary' && (
        <div className="p-4 space-y-4">
          {/* Venue Info */}
          <Card className="p-4 bg-card border-border">
            <div className="flex gap-4">
              <img 
                src={venue.image} 
                alt={venue.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{venue.name}</h3>
                <p className="text-sm text-muted-foreground">{venue.location}</p>
                <p className="text-sm font-medium text-primary mt-1">{venue.sport}</p>
              </div>
            </div>
          </Card>

          {/* Slot Details */}
          <Card className="p-4 bg-card border-border">
            <h3 className="font-bold text-foreground mb-3">Booking Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{format(selectedDate, 'EEE, d MMM yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-medium text-foreground">{slot.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">1 Hour</span>
              </div>
            </div>
          </Card>

          {/* Price Summary */}
          <Card className="p-4 bg-card border-border">
            <h3 className="font-bold text-foreground mb-3">Price Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Price</span>
                <span className="font-medium text-foreground">₹{basePrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Convenience Fee</span>
                <span className="font-medium text-foreground">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-bold text-foreground">Total Amount</span>
                <span className="font-bold text-xl text-primary">₹{totalPrice}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {step === 'payment' && (
        <div className="p-4 space-y-4">
          {/* Secure Payment Badge */}
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">100% Secure Payment</span>
          </div>

          {/* Payment Methods */}
          <Card className="p-4 bg-card border-border">
            <h3 className="font-bold text-foreground mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    selectedPayment === method.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-foreground"
                  )}>
                    {method.icon}
                  </div>
                  <span className="font-medium text-foreground">{method.name}</span>
                  {selectedPayment === method.id && (
                    <div className="ml-auto h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Amount to Pay */}
          <Card className="p-4 bg-card border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount to Pay</span>
              <span className="font-bold text-2xl text-primary">₹{totalPrice}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 z-50 shadow-lg">
        <Button 
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            if (step === 'summary') {
              setStep('payment');
            } else {
              setStep('success');
            }
          }}
        >
          {step === 'summary' ? `Proceed to Pay ₹${totalPrice}` : `Pay ₹${totalPrice}`}
        </Button>
      </div>
    </div>
  );
};
