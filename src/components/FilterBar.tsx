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
    <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border/40 px-4 py-3 shadow-premium-md animate-fade-in">
      <div className="flex gap-2">
        {/* Sport Type Filter - 44px height */}
        <Select value={selectedSport} onValueChange={onSportChange}>
          <SelectTrigger className="h-11 flex-1 bg-background/50 border-border/40 text-sm font-medium rounded-lg shadow-sm transition-smooth hover:bg-background hover:border-primary/30">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/40 shadow-premium-lg z-50 max-h-64 animate-fade-in">
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport} className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Filter - 44px height */}
        <Select value={selectedPrice} onValueChange={onPriceChange}>
          <SelectTrigger className="h-11 flex-1 bg-background/50 border-border/40 text-sm font-medium rounded-lg shadow-sm transition-smooth hover:bg-background hover:border-primary/30">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/40 shadow-premium-lg z-50 animate-fade-in">
            <SelectItem value="default" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">Default</SelectItem>
            <SelectItem value="low-high" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">Low → High</SelectItem>
            <SelectItem value="high-low" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">High → Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Availability Filter - 44px height */}
        <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="h-11 flex-1 bg-background/50 border-border/40 text-sm font-medium rounded-lg shadow-sm transition-smooth hover:bg-background hover:border-primary/30">
            <SelectValue placeholder="Available" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/40 shadow-premium-lg z-50 animate-fade-in">
            <SelectItem value="available" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">Available now</SelectItem>
            <SelectItem value="morning" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">Morning</SelectItem>
            <SelectItem value="afternoon" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">Afternoon</SelectItem>
            <SelectItem value="evening" className="h-11 text-sm font-medium cursor-pointer hover:bg-primary/10 transition-smooth">Evening</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
