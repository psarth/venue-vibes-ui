import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sports } from '@/data/venues';

interface PremiumFilterBarProps {
  selectedSport: string;
  selectedPrice: string;
  selectedAvailability: string;
  onSportChange: (sport: string) => void;
  onPriceChange: (price: string) => void;
  onAvailabilityChange: (availability: string) => void;
}

export const PremiumFilterBar = ({
  selectedSport,
  selectedPrice,
  selectedAvailability,
  onSportChange,
  onPriceChange,
  onAvailabilityChange,
}: PremiumFilterBarProps) => {
  const priceOptions = [
    { value: 'default', label: 'Price' },
    { value: 'low-high', label: 'Low to High' },
    { value: 'high-low', label: 'High to Low' },
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available Now' },
    { value: 'all', label: 'Show All' },
  ];

  const FilterDropdown = ({ 
    value, 
    options, 
    onChange, 
    displayValue 
  }: { 
    value: string; 
    options: { value: string; label: string }[]; 
    onChange: (value: string) => void;
    displayValue: string;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between gap-2 h-11 px-4 bg-card border-2 border-border rounded-xl text-sm font-medium text-foreground hover:border-primary/30 transition-all shadow-premium-sm min-w-[100px]">
        <span className="truncate">{displayValue}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-card border-border shadow-premium-xl z-50 min-w-[160px] rounded-xl p-1"
        align="start"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`h-11 text-sm font-medium rounded-lg cursor-pointer ${
              value === option.value ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {/* Sport Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between gap-2 h-11 px-4 bg-card border-2 border-border rounded-xl text-sm font-medium text-foreground hover:border-primary/30 transition-all shadow-premium-sm min-w-[120px]">
            <span className="truncate">{selectedSport}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-card border-border shadow-premium-xl z-50 min-w-[180px] rounded-xl p-1 max-h-[300px] overflow-y-auto"
            align="start"
          >
            {sports.map((sport) => (
              <DropdownMenuItem
                key={sport}
                onClick={() => onSportChange(sport)}
                className={`h-11 text-sm font-medium rounded-lg cursor-pointer ${
                  selectedSport === sport ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                {sport}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Filter */}
        <FilterDropdown
          value={selectedPrice}
          options={priceOptions}
          onChange={onPriceChange}
          displayValue={priceOptions.find(o => o.value === selectedPrice)?.label || 'Price'}
        />

        {/* Availability Filter */}
        <FilterDropdown
          value={selectedAvailability}
          options={availabilityOptions}
          onChange={onAvailabilityChange}
          displayValue={availabilityOptions.find(o => o.value === selectedAvailability)?.label || 'Availability'}
        />
      </div>
    </div>
  );
};