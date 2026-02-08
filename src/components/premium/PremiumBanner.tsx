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
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -mr-40 -mt-40 animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl -ml-20 -mb-20" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)`
        }} />
      </div>
      
      {/* Content */}
      <div className="relative px-4 py-8 animate-fade-in">
        {/* City Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-primary-foreground/95 text-sm font-semibold hover:text-primary-foreground transition-smooth w-fit py-2 px-3 rounded-lg hover:bg-primary-foreground/10 active:bg-primary-foreground/20 backdrop-blur-sm">
            <MapPin className="h-4 w-4" />
            <span>{selectedCity}</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="bg-card border-border/40 shadow-premium-xl z-50 min-w-[160px] rounded-xl animate-fade-in"
          >
            {cities.map((city) => (
              <DropdownMenuItem
                key={city}
                onClick={() => onCityChange(city)}
                className={`h-11 text-sm font-medium rounded-lg mx-1 my-0.5 cursor-pointer transition-smooth ${
                  city === selectedCity ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent'
                }`}
              >
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-primary-foreground leading-tight font-display mt-3 animate-slide-in-left">
          Find Venues Near You
        </h1>
        <p className="text-primary-foreground/85 text-sm mt-2 font-medium animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
          Book courts, turfs & grounds instantly
        </p>
      </div>
    </div>
  );
};