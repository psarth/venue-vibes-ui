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
    <div className="sticky top-14 z-40 bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="flex gap-2">
        {/* Sport Type Filter - 44px height */}
        <Select value={selectedSport} onValueChange={onSportChange}>
          <SelectTrigger className="h-11 flex-1 bg-background border-border text-sm font-medium rounded-lg shadow-sm">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border shadow-lg z-50 max-h-64">
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport} className="h-11 text-sm font-medium">
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Filter - 44px height */}
        <Select value={selectedPrice} onValueChange={onPriceChange}>
          <SelectTrigger className="h-11 flex-1 bg-background border-border text-sm font-medium rounded-lg shadow-sm">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border shadow-lg z-50">
            <SelectItem value="default" className="h-11 text-sm font-medium">Default</SelectItem>
            <SelectItem value="low-high" className="h-11 text-sm font-medium">Low → High</SelectItem>
            <SelectItem value="high-low" className="h-11 text-sm font-medium">High → Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Availability Filter - 44px height */}
        <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="h-11 flex-1 bg-background border-border text-sm font-medium rounded-lg shadow-sm">
            <SelectValue placeholder="Available" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border shadow-lg z-50">
            <SelectItem value="available" className="h-11 text-sm font-medium">Available now</SelectItem>
            <SelectItem value="morning" className="h-11 text-sm font-medium">Morning</SelectItem>
            <SelectItem value="afternoon" className="h-11 text-sm font-medium">Afternoon</SelectItem>
            <SelectItem value="evening" className="h-11 text-sm font-medium">Evening</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
