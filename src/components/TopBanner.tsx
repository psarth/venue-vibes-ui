import { MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'];

interface TopBannerProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const TopBanner = ({ selectedCity, onCityChange }: TopBannerProps) => {
  return (
    <div className="relative h-28 overflow-hidden">
      {/* Background Image - Sports lifestyle */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80')`,
        }}
      />
      
      {/* Gradient Overlay - Ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75" />
      
      {/* Content - 16px horizontal padding */}
      <div className="relative h-full flex flex-col justify-center px-4 py-4">
        {/* City Selector - 44px touch target */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 text-primary-foreground/90 text-sm font-medium hover:text-primary-foreground transition-colors w-fit h-8 mb-1">
            <MapPin className="h-4 w-4" />
            <span>{selectedCity}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-card border-border shadow-lg z-50 min-w-[140px]">
            {cities.map((city) => (
              <DropdownMenuItem
                key={city}
                onClick={() => onCityChange(city)}
                className={`h-11 text-sm font-medium ${city === selectedCity ? 'bg-accent text-primary' : ''}`}
              >
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Tagline - H1: 20px bold */}
        <h1 className="text-xl font-bold text-primary-foreground leading-snug">
          Find turf, courts, grounds near you
        </h1>
      </div>
    </div>
  );
};
