import { MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
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
    <div className="relative bg-gradient-to-r from-primary/90 to-primary overflow-hidden">
      {/* Subtle sports pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-primary-foreground/90 text-sm font-medium hover:text-primary-foreground transition-colors">
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
        </div>
        
        <h1 className="text-xl font-semibold text-primary-foreground">
          Book sports venues near you
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Discover and book the best courts & turfs
        </p>
      </div>
    </div>
  );
};
