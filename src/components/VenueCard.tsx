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
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 text-muted-foreground/30" />
        );
      }
    }
    return stars;
  };

  return (
    <Card 
      className="overflow-hidden bg-card border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Venue Image - Minimum 160px height */}
      <div className="relative h-40 min-h-[160px] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Sport Type Badge - Corner position */}
        <Badge 
          className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1"
        >
          {venue.sport}
        </Badge>
      </div>

      {/* Card Content - 16px padding */}
      <div className="p-4">
        {/* Venue Name */}
        <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">
          {venue.name}
        </h3>

        {/* Location with map pin */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="line-clamp-1">{venue.location}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-muted-foreground text-sm">From </span>
          <span className="text-xl font-bold text-primary">₹{venue.pricePerHour}</span>
          <span className="text-muted-foreground text-sm">/hour</span>
        </div>

        {/* Trust Section - Rating stars + review count */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-0.5">
            {renderStars(venue.rating)}
          </div>
          <span className="text-sm font-medium text-foreground">{venue.rating}</span>
          <span className="text-sm text-muted-foreground">({venue.reviewCount} reviews)</span>
        </div>

        {/* CTA Button - Minimum 44px height */}
        <Button 
          className="w-full h-11 text-base font-semibold"
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
