import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sports } from '@/data/venues';

interface FilterBarProps {
  selectedSport: string;
  selectedPrice: string;
  selectedAvailability: string;
  onSportChange: (sport: string) => void;
  onPriceChange: (price: string) => void;
  onAvailabilityChange: (availability: string) => void;
}

export const FilterBar = ({
  selectedSport,
  selectedPrice,
  selectedAvailability,
  onSportChange,
  onPriceChange,
  onAvailabilityChange,
}: FilterBarProps) => {
  return (
    <div className="sticky top-0 z-40 bg-card border-b border-border px-3 py-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {/* Sport Type Filter */}
        <Select value={selectedSport} onValueChange={onSportChange}>
          <SelectTrigger className="h-9 min-w-[120px] bg-background border-border text-sm">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Filter */}
        <Select value={selectedPrice} onValueChange={onPriceChange}>
          <SelectTrigger className="h-9 min-w-[140px] bg-background border-border text-sm">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="low-high">Price: Low to High</SelectItem>
            <SelectItem value="high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Availability Filter */}
        <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="h-9 min-w-[130px] bg-background border-border text-sm">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="available">Available now</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
            <SelectItem value="full-day">Full day</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
