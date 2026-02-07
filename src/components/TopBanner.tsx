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
    <div className="relative h-40 overflow-hidden animate-fade-in">
      {/* Background Image - Sports lifestyle */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-125 transition-transform duration-500"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80')`,
        }}
      />
      
      {/* Gradient Overlay - Premium gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-transparent backdrop-blur-sm" />
      
      {/* Animated accent shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-40 -mt-40 animate-pulse-glow" />
      
      {/* Content - 16px horizontal padding */}
      <div className="relative h-full flex flex-col justify-center px-4 py-6">
        {/* City Selector - 44px touch target */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-primary-foreground/95 text-sm font-semibold hover:text-primary-foreground transition-smooth w-fit py-2 px-3 rounded-lg hover:bg-primary-foreground/10 active:bg-primary-foreground/20">
            <MapPin className="h-4 w-4" />
            <span>{selectedCity}</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-card border-border/40 shadow-premium-lg z-50 min-w-[140px] animate-fade-in">
            {cities.map((city) => (
              <DropdownMenuItem
                key={city}
                onClick={() => onCityChange(city)}
                className={`h-11 text-sm font-medium cursor-pointer transition-smooth ${city === selectedCity ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent'}`}
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
