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
      className="overflow-hidden bg-card border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Venue Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-foreground">{venue.rating}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{venue.name}</h3>
          <Badge 
            variant="secondary" 
            className="shrink-0 text-xs bg-accent text-accent-foreground"
          >
            {venue.sport}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{venue.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">₹{venue.pricePerHour}</span>
            <span className="text-muted-foreground text-sm">/hr</span>
          </div>
          <Button 
            size="sm" 
            className="h-8 px-4 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Venue
          </Button>
        </div>
      </div>
    </Card>
  );
};
