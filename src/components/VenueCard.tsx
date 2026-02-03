import { MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Venue } from '@/data/venues';

interface VenueCardProps {
  venue: Venue;
  onClick: () => void;
}

export const VenueCard = ({ venue, onClick }: VenueCardProps) => {
  return (
    <Card 
      className="overflow-hidden bg-card border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer rounded-xl"
      onClick={onClick}
    >
      {/* Venue Image - 160px minimum height */}
      <div className="relative h-44 min-h-[160px] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Sport Badge - Top left corner */}
        <Badge 
          className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
        >
          {venue.sport}
        </Badge>
      </div>

      {/* Card Content - 16px padding, 8-point spacing */}
      <div className="p-4">
        {/* Venue Name - H2: 18px bold */}
        <h3 className="font-bold text-lg leading-tight text-foreground mb-2 line-clamp-1">
          {venue.name}
        </h3>

        {/* Location with map pin - 8px gap */}
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm line-clamp-1">{venue.location}</span>
        </div>

        {/* Price - Clear typography */}
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">From </span>
          <span className="text-xl font-bold text-primary">₹{venue.pricePerHour}</span>
          <span className="text-sm text-muted-foreground">/hr</span>
        </div>

        {/* Trust Section - Rating + reviews */}
        <div className="flex items-center gap-2 py-3 border-y border-border mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-foreground">{venue.rating}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{venue.reviewCount}+ reviews</span>
        </div>

        {/* CTA Button - 44px height (h-11), 16px font */}
        <Button 
          className="w-full h-11 text-base font-semibold rounded-xl shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Venue
        </Button>
      </div>
    </Card>
  );
};
