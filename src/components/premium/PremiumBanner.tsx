import { MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'];

interface PremiumBannerProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const PremiumBanner = ({ selectedCity, onCityChange }: PremiumBannerProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-premium" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)`
        }} />
      </div>
      
      {/* Content */}
      <div className="relative px-4 py-5">
        {/* City Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 text-primary-foreground/90 text-sm font-medium hover:text-primary-foreground transition-colors w-fit h-8 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{selectedCity}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="bg-card border-border shadow-premium-xl z-50 min-w-[160px] rounded-xl"
          >
            {cities.map((city) => (
              <DropdownMenuItem
                key={city}
                onClick={() => onCityChange(city)}
                className={`h-11 text-sm font-medium rounded-lg mx-1 my-0.5 cursor-pointer ${
                  city === selectedCity ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-primary-foreground leading-tight font-display">
          Find Venues Near You
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Book courts, turfs & grounds instantly
        </p>
      </div>
    </div>
  );
};