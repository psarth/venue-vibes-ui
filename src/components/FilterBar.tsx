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
    <div className="sticky top-14 z-40 bg-card border-b border-border px-4 py-3">
      <div className="flex gap-2">
        {/* Sport Type Filter */}
        <Select value={selectedSport} onValueChange={onSportChange}>
          <SelectTrigger className="h-10 flex-1 bg-background border-border text-sm font-medium">
            <SelectValue placeholder="Sport Type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport} className="text-sm">
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Filter */}
        <Select value={selectedPrice} onValueChange={onPriceChange}>
          <SelectTrigger className="h-10 flex-1 bg-background border-border text-sm font-medium">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="default" className="text-sm">Default</SelectItem>
            <SelectItem value="low-high" className="text-sm">Low to High</SelectItem>
            <SelectItem value="high-low" className="text-sm">High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Availability Filter */}
        <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="h-10 flex-1 bg-background border-border text-sm font-medium">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="available" className="text-sm">Available now</SelectItem>
            <SelectItem value="morning" className="text-sm">Morning (6AM-12PM)</SelectItem>
            <SelectItem value="afternoon" className="text-sm">Afternoon (12PM-5PM)</SelectItem>
            <SelectItem value="evening" className="text-sm">Evening (5PM-10PM)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
