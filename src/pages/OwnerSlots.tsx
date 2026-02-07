
import { useState, useEffect } from 'react';
import OwnerLayout from '@/layouts/OwnerLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Lock, Unlock, DollarSign, Zap, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syncSlotPrices, syncBlockedSlots } from '@/utils/venueSync';

interface Slot {
  id: string;
  time: string;
  startTime: string;
  price: number;
  isBlocked: boolean;
  isBooked: boolean;
}

interface SportSlots {
  sport: string;
  icon: string;
  slots: Slot[];
  basePrice: number;
}

export default function OwnerSlots() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sportSlots, setSportSlots] = useState<SportSlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [venueConfig, setVenueConfig] = useState<any>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [expandedSports, setExpandedSports] = useState<string[]>([]);

  // Price editing states
  const [editingSlot, setEditingSlot] = useState<{ sport: string; slotId: string } | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [bulkPriceDialogOpen, setBulkPriceDialogOpen] = useState(false);
  const [bulkPriceValue, setBulkPriceValue] = useState('');
  const [bulkPriceTarget, setBulkPriceTarget] = useState<{ type: 'sport' | 'time'; value: string } | null>(null);

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const loadSlots = () => {
    setLoading(true);
    const config = localStorage.getItem('owner_venue');
    const venue = config ? JSON.parse(config) : null;
    setVenueConfig(venue);

    if (venue && venue.sports && venue.sports.length > 0) {
      const sportIcons: Record<string, string> = {
        'Cricket': '🏏',
        'Football': '⚽',
        'Badminton': '🏸',
        'Tennis': '🎾',
        'Basketball': '🏀',
        'Swimming': '🏊',
        'Squash': '🎾',
        'Table Tennis': '🏓'
      };

      const sportsData: SportSlots[] = venue.sports.map((sport: string) => {
        const generatedSlots = generateTimeSlots(
          venue.startTime,
          venue.endTime,
          parseInt(venue.slotDuration),
          parseInt(venue.pricePerSlot)
        );

        // Load blocked slots
        const blockedStorage = localStorage.getItem('owner_blocked_slots');
        const blockedMap = blockedStorage ? JSON.parse(blockedStorage) : {};
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        const blockedForDate = blockedMap[`${dateKey}_${sport}`] || [];

        // Load custom prices
        const priceStorage = localStorage.getItem('owner_slot_prices');
        const priceMap = priceStorage ? JSON.parse(priceStorage) : {};

        const finalSlots = generatedSlots.map(slot => ({
          ...slot,
          isBlocked: blockedForDate.includes(slot.id),
          price: priceMap[`${dateKey}_${sport}_${slot.id}`] || slot.price,
          isBooked: Math.random() > 0.7 // Mock booking status
        }));

        return {
          sport,
          icon: sportIcons[sport] || '🏆',
          slots: finalSlots,
          basePrice: parseInt(venue.pricePerSlot)
        };
      });

      setSportSlots(sportsData);
      setExpandedSports(venue.sports.slice(0, 1)); // Expand first sport by default
    }
    setLoading(false);
  };

  const generateTimeSlots = (start: string, end: string, duration: number, basePrice: number): Slot[] => {
    const slots: Slot[] = [];
    let currentTime = new Date(`2000-01-01T${start}:00`);
    const endTime = new Date(`2000-01-01T${end}:00`);

    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      const nextTime = new Date(currentTime.getTime() + duration * 60000);
      const timeLabel = `${format(currentTime, 'hh:mm a')} - ${format(nextTime, 'hh:mm a')}`;

      // Peak hour pricing (6 PM - 10 PM)
      const hour = currentTime.getHours();
      const isPeak = hour >= 18 && hour < 22;
      const price = isPeak ? Math.round(basePrice * 1.2) : basePrice;

      slots.push({
        id: timeString,
        time: timeLabel,
        startTime: timeString,
        price,
        isBlocked: false,
        isBooked: false
      });
      currentTime = nextTime;
    }
    return slots;
  };

  const toggleSlotBlock = (sport: string, slotId: string) => {
    setSportSlots(prev => prev.map(sportData => {
      if (sportData.sport !== sport) return sportData;

      const updatedSlots = sportData.slots.map(s =>
        s.id === slotId ? { ...s, isBlocked: !s.isBlocked } : s
      );

      // Save to localStorage
      const blockedStorage = localStorage.getItem('owner_blocked_slots');
      const blockedMap = blockedStorage ? JSON.parse(blockedStorage) : {};
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const storageKey = `${dateKey}_${sport}`;

      const blockedSlotIds = updatedSlots.filter(s => s.isBlocked).map(s => s.id);
      blockedMap[storageKey] = blockedSlotIds;
      localStorage.setItem('owner_blocked_slots', JSON.stringify(blockedMap));

      // 🔥 SYNC TO CUSTOMER INTERFACE IN REAL-TIME
      syncBlockedSlots(venueConfig?.id || 'venue_demo', sport, dateKey, blockedSlotIds);

      return { ...sportData, slots: updatedSlots };
    }));

    toast({
      title: "Slot Updated ✅",
      description: `Changes synced to customer app`
    });
  };

  const startEditingPrice = (sport: string, slotId: string, currentPrice: number) => {
    setEditingSlot({ sport, slotId });
    setEditPrice(currentPrice.toString());
  };

  const saveSlotPrice = (sport: string, slotId: string) => {
    const newPrice = parseInt(editPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({ title: "Invalid Price", description: "Please enter a valid price", variant: "destructive" });
      return;
    }

    setSportSlots(prev => prev.map(sportData => {
      if (sportData.sport !== sport) return sportData;

      const updatedSlots = sportData.slots.map(s =>
        s.id === slotId ? { ...s, price: newPrice } : s
      );

      // Save to localStorage
      const priceStorage = localStorage.getItem('owner_slot_prices');
      const priceMap = priceStorage ? JSON.parse(priceStorage) : {};
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      priceMap[`${dateKey}_${sport}_${slotId}`] = newPrice;
      localStorage.setItem('owner_slot_prices', JSON.stringify(priceMap));

      // 🔥 SYNC TO CUSTOMER INTERFACE IN REAL-TIME
      const prices: Record<string, number> = {};
      updatedSlots.forEach(slot => {
        prices[slot.id] = slot.price;
      });
      syncSlotPrices(venueConfig?.id || 'venue_demo', sport, dateKey, prices);

      return { ...sportData, slots: updatedSlots };
    }));

    setEditingSlot(null);
    toast({ title: "Price Updated ✅", description: `Synced to customer app` });
  };

  const cancelEditingPrice = () => {
    setEditingSlot(null);
    setEditPrice('');
  };

  const openBulkPriceDialog = (type: 'sport' | 'time', value: string) => {
    setBulkPriceTarget({ type, value });
    setBulkPriceDialogOpen(true);
  };

  const applyBulkPrice = () => {
    const newPrice = parseInt(bulkPriceValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({ title: "Invalid Price", description: "Please enter a valid price", variant: "destructive" });
      return;
    }

    if (!bulkPriceTarget) return;

    setSportSlots(prev => prev.map(sportData => {
      if (bulkPriceTarget.type === 'sport' && sportData.sport !== bulkPriceTarget.value) {
        return sportData;
      }

      const updatedSlots = sportData.slots.map(slot => {
        if (bulkPriceTarget.type === 'time') {
          // Apply to specific time range (e.g., peak hours)
          const hour = parseInt(slot.startTime.split(':')[0]);
          const isPeak = hour >= 18 && hour < 22;
          if ((bulkPriceTarget.value === 'peak' && isPeak) || (bulkPriceTarget.value === 'offpeak' && !isPeak)) {
            return { ...slot, price: newPrice };
          }
        } else {
          // Apply to all slots of this sport
          return { ...slot, price: newPrice };
        }
        return slot;
      });

      // Save to localStorage
      const priceStorage = localStorage.getItem('owner_slot_prices');
      const priceMap = priceStorage ? JSON.parse(priceStorage) : {};
      const dateKey = format(selectedDate, 'yyyy-MM-dd');

      updatedSlots.forEach(slot => {
        priceMap[`${dateKey}_${sportData.sport}_${slot.id}`] = slot.price;
      });
      // 🔥 SYNC TO CUSTOMER INTERFACE IN REAL-TIME
      const prices: Record<string, number> = {};
      updatedSlots.forEach(slot => {
        prices[slot.id] = slot.price;
      });
      syncSlotPrices(venueConfig?.id || 'venue_demo', sportData.sport, dateKey, prices);

      return { ...sportData, slots: updatedSlots };
    }));

    setBulkPriceDialogOpen(false);
    setBulkPriceValue('');
    toast({
      title: "Bulk Price Updated",
      description: `Prices updated for ${bulkPriceTarget.type === 'sport' ? bulkPriceTarget.value : bulkPriceTarget.value + ' hours'}`
    });
  };

  const toggleSportExpansion = (sport: string) => {
    setExpandedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  return (
    <OwnerLayout title="Slot Management" subtitle="Sport-wise slots with pricing">
      <div className="space-y-6">

        {/* Top Controls */}
        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal bg-background border-border/50 text-foreground hover:bg-muted", !selectedDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-success/10 text-success border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Available
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-warning/10 text-warning border border-warning/20">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                Booked
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 text-muted-foreground border border-border/30">
                <Lock className="w-3 h-3" />
                Blocked
              </div>
            </div>
          </div>
        </div>

        {/* Sport-wise Slots */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading slots...</div>
        ) : !venueConfig ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground mb-4">Venue setup incomplete.</p>
            <Button onClick={() => window.location.href = '/owner'} className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sportSlots.map((sportData) => {
              const isExpanded = expandedSports.includes(sportData.sport);
              const totalSlots = sportData.slots.length;
              const blockedCount = sportData.slots.filter(s => s.isBlocked).length;
              const bookedCount = sportData.slots.filter(s => s.isBooked).length;
              const availableCount = totalSlots - blockedCount - bookedCount;

              return (
                <div key={sportData.sport} className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
                  {/* Sport Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => toggleSportExpansion(sportData.sport)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                          {sportData.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{sportData.sport}</h3>
                          <p className="text-xs text-muted-foreground">
                            {availableCount} available • {bookedCount} booked • {blockedCount} blocked
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBulkPriceDialog('sport', sportData.sport);
                          }}
                          className="bg-background border-border/50 text-foreground hover:bg-muted"
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Bulk Price
                        </Button>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>

                  {/* Slots Grid */}
                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-border/30">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {sportData.slots.map((slot) => {
                          const isEditing = editingSlot?.sport === sportData.sport && editingSlot?.slotId === slot.id;

                          return (
                            <div
                              key={slot.id}
                              className={cn(
                                "relative p-3 rounded-xl border-2 transition-all flex flex-col gap-2",
                                slot.isBooked
                                  ? "bg-warning/5 border-warning/30 text-warning cursor-not-allowed"
                                  : slot.isBlocked
                                    ? "bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed"
                                    : "bg-card border-border/40 text-foreground hover:border-primary/50 hover:shadow-md"
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <Clock className={cn("w-4 h-4", slot.isBooked ? "text-warning" : slot.isBlocked ? "text-muted-foreground" : "text-foreground/70")} />
                                {!slot.isBooked && (
                                  <button
                                    onClick={() => toggleSlotBlock(sportData.sport, slot.id)}
                                    className={cn(
                                      "p-1 rounded-full transition-colors",
                                      slot.isBlocked ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-success/20 text-success hover:bg-success/30"
                                    )}
                                  >
                                    {slot.isBlocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                  </button>
                                )}
                              </div>

                              <span className="font-bold text-xs leading-tight">{slot.time}</span>

                              {/* Price Display/Edit */}
                              {!slot.isBooked && !slot.isBlocked && (
                                <div className="flex items-center gap-1">
                                  {isEditing ? (
                                    <>
                                      <Input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="h-7 text-xs bg-background border-primary/50 text-foreground"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <button
                                        onClick={() => saveSlotPrice(sportData.sport, slot.id)}
                                        className="p-1 rounded bg-success text-white hover:bg-success/90"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={cancelEditingPrice}
                                        className="p-1 rounded bg-destructive text-white hover:bg-destructive/90"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => startEditingPrice(sportData.sport, slot.id, slot.price)}
                                      className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
                                    >
                                      <span>₹{slot.price}</span>
                                      <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                  )}
                                </div>
                              )}

                              {slot.isBooked && (
                                <span className="text-[10px] font-bold text-warning uppercase">Booked</span>
                              )}

                              {slot.isBlocked && !slot.isBooked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl">
                                  <span className="bg-card px-2 py-1 rounded shadow-sm text-[10px] font-bold text-muted-foreground border border-border">BLOCKED</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Actions for this sport */}
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openBulkPriceDialog('time', 'peak')}
                          className="bg-background border-border/50 text-foreground hover:bg-muted text-xs"
                        >
                          Set Peak Price (6-10 PM)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openBulkPriceDialog('time', 'offpeak')}
                          className="bg-background border-border/50 text-foreground hover:bg-muted text-xs"
                        >
                          Set Off-Peak Price
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-card/50 border border-border/30 rounded-xl p-4">
          <h4 className="font-semibold text-sm text-foreground mb-2">Quick Guide</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Click Sport Header:</strong> Expand/collapse sport section</li>
            <li>• <strong>Click Price:</strong> Edit individual slot price</li>
            <li>• <strong>Bulk Price:</strong> Update all slots for a sport or time range</li>
            <li>• <strong>Lock Icon:</strong> Block/unblock slot</li>
          </ul>
        </div>

      </div>

      {/* Bulk Price Dialog */}
      <Dialog open={bulkPriceDialogOpen} onOpenChange={setBulkPriceDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Bulk Price Update</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {bulkPriceTarget?.type === 'sport'
                ? `Update price for all ${bulkPriceTarget.value} slots`
                : `Update price for ${bulkPriceTarget?.value} hours`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-price" className="text-foreground">New Price (₹)</Label>
              <Input
                id="bulk-price"
                type="number"
                value={bulkPriceValue}
                onChange={(e) => setBulkPriceValue(e.target.value)}
                placeholder="Enter price"
                className="bg-background border-border/50 text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkPriceDialogOpen(false)} className="bg-background border-border/50 text-foreground">
              Cancel
            </Button>
            <Button onClick={applyBulkPrice} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </OwnerLayout>
  );
}