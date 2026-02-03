import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/data/venues';

interface PremiumVenueCardProps {
  venue: Venue;
  onClick: () => void;
}

export const PremiumVenueCard = ({ venue, onClick }: PremiumVenueCardProps) => {
  return (
    <div 
      className="card-premium overflow-hidden cursor-pointer group animate-fade-in"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Sport Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-premium-md">
            {venue.sport}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1.5 bg-card/95 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full shadow-premium-md flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {venue.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Venue Name */}
        <h3 className="text-lg font-bold text-foreground font-display mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {venue.name}
        </h3>
        
        {/* Location */}
        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{venue.location}</span>
        </p>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-lg font-bold text-primary font-display">
              ₹{venue.pricePerHour}<span className="text-sm font-normal text-muted-foreground">/hr</span>
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-semibold">{venue.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">{venue.reviewCount}+ reviews</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button className="w-full h-12 btn-premium rounded-xl text-base font-semibold">
          View Venue
        </Button>
      </div>
    </div>
  );
};