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
    <div className="relative h-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1461896836934- voices-of-a-distant-star-8a4b4e4b?w=800&q=80'), url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80')`,
          backgroundImage: `url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80')`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-primary-foreground/90 text-sm font-medium hover:text-primary-foreground transition-colors w-fit mb-2">
            <MapPin className="h-4 w-4" />
            <span>{selectedCity}</span>
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-card border-border z-50">
            {cities.map((city) => (
              <DropdownMenuItem
                key={city}
                onClick={() => onCityChange(city)}
                className={city === selectedCity ? 'bg-accent' : ''}
              >
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <h1 className="text-xl font-bold text-primary-foreground leading-tight">
          Find the best sports venues
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Book courts, turfs & arenas near you
        </p>
      </div>
    </div>
  );
};
