import { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { sports } from '@/data/venues';

interface PremiumFilterBarProps {
  selectedSport: string;
  selectedPrice: string;
  selectedAvailability: string;
  onSportChange: (sport: string) => void;
  onPriceChange: (price: string) => void;
  onAvailabilityChange: (availability: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const PremiumFilterBar = ({
  selectedSport,
  selectedPrice,
  selectedAvailability,
  onSportChange,
  onPriceChange,
  onAvailabilityChange,
  searchQuery,
  onSearchChange,
}: PremiumFilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const priceOptions = [
    { value: 'default', label: 'Default' },
    { value: 'low-high', label: 'Low → High' },
    { value: 'high-low', label: 'High → Low' },
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available Now' },
    { value: 'all', label: 'Show All' },
  ];

  const handlePriceChange = (price: string) => {
    onPriceChange(price);
    setIsOpen(false);
  };

  const handleAvailabilityChange = (availability: string) => {
    onAvailabilityChange(availability);
    setIsOpen(false);
  };

  const getPriceLabel = () => {
    const option = priceOptions.find(p => p.value === selectedPrice);
    return option?.label || 'Default';
  };

  const getAvailabilityLabel = () => {
    const option = availabilityOptions.find(a => a.value === selectedAvailability);
    return option?.label || 'Available';
  };

  return (
    <div className="backdrop-blur-lg border-b" style={{ backgroundColor: 'rgba(244, 251, 251, 0.95)', borderColor: 'rgba(229, 231, 235, 0.2)' }}>
      {/* Desktop Filter Bar */}
      <div className="hidden sm:flex gap-3 px-4 sm:px-6 py-4 overflow-x-auto no-scrollbar">
        {/* Sport Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
            style={selectedSport !== 'All Sports' 
              ? { backgroundColor: '#1BA6A6', color: '#FFFFFF', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }
              : { backgroundColor: '#FFFFFF', border: '1px solid rgba(229, 231, 235, 0.6)', color: '#1F2937' }
            }
          >
            <span>{selectedSport}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border shadow-lg z-50 min-w-[180px] rounded-xl p-1.5" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(229, 231, 235, 0.4)' }}>
            {['All Sports', ...sports].map((sport) => (
              <DropdownMenuItem
                key={sport}
                onClick={() => onSportChange(sport)}
                className="h-10 text-sm font-medium rounded-lg cursor-pointer transition-all"
                style={selectedSport === sport
                  ? { backgroundColor: 'rgba(27, 166, 166, 0.1)', color: '#1BA6A6', fontWeight: 600 }
                  : {}
                }
              >
                {sport}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
            style={selectedPrice !== 'default'
              ? { backgroundColor: '#1BA6A6', color: '#FFFFFF', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }
              : { backgroundColor: '#FFFFFF', border: '1px solid rgba(229, 231, 235, 0.6)', color: '#1F2937' }
            }
          >
            <span>{getPriceLabel()}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border shadow-lg z-50 min-w-[160px] rounded-xl p-1.5" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(229, 231, 235, 0.4)' }}>
            {priceOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onPriceChange(option.value)}
                className="h-10 text-sm font-medium rounded-lg cursor-pointer transition-all"
                style={selectedPrice === option.value
                  ? { backgroundColor: 'rgba(27, 166, 166, 0.1)', color: '#1BA6A6', fontWeight: 600 }
                  : {}
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Availability Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
            selectedAvailability === 'available' 
              ? 'bg-success text-success-foreground shadow-premium-sm' 
              : 'bg-card border border-border/60 text-foreground hover:border-success/40 hover:bg-success/5'
          }`}>
            <span>{getAvailabilityLabel()}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border/40 shadow-premium-lg z-50 min-w-[160px] rounded-xl p-1.5">
            {availabilityOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onAvailabilityChange(option.value)}
                className={`h-10 text-sm font-medium rounded-lg cursor-pointer transition-all ${
                  selectedAvailability === option.value
                    ? 'bg-success/10 text-success font-semibold'
                    : 'hover:bg-muted/60'
                }`}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Filter Button */}
      <div className="sm:hidden p-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <Button
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-semibold shadow-premium-sm active:scale-95 transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>

          <SheetContent side="bottom" className="w-full max-h-[80vh] rounded-t-3xl p-0 bg-card border-t border-border">
            <SheetHeader className="sticky top-0 z-50 bg-card border-b border-border p-4 flex flex-row items-center justify-between">
              <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
              <SheetClose className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </SheetClose>
            </SheetHeader>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {/* Sport Filter */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Sport</p>
                <div className="space-y-2">
                  {['All Sports', ...sports].map((sport) => (
                    <button
                      key={sport}
                      onClick={() => onSportChange(sport)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                        selectedSport === sport
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'border-border/50 text-foreground active:bg-muted'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Price</p>
                <div className="space-y-2">
                  {priceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePriceChange(option.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                        selectedPrice === option.value
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'border-border/50 text-foreground active:bg-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Availability</p>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAvailabilityChange(option.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                        selectedAvailability === option.value
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'border-border/50 text-foreground active:bg-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-4 border-t border-border bg-card">
              <SheetClose asChild>
                <Button
                  className="w-full h-11 font-semibold rounded-xl active:scale-95 transition-transform"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};