import { useEffect, useRef, useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/data/venues';

interface PremiumVenueCardProps {
  venue: Venue;
  onClick: () => void;
}

export const PremiumVenueCard = ({ venue, onClick }: PremiumVenueCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isLocationScrolling, setIsLocationScrolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const gallery = venue.gallery && venue.gallery.length ? venue.gallery : [venue.image];
  const hasMultipleImages = gallery.length > 1;

  // Auto-scroll images
  useEffect(() => {
    if (!hasMultipleImages || !isAutoScrolling) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gallery.length, hasMultipleImages, isAutoScrolling]);

  // Auto-scroll location text
  useEffect(() => {
    const locationEl = locationRef.current;
    if (!locationEl || !isLocationScrolling) return;

    const scrollWidth = locationEl.scrollWidth;
    const clientWidth = locationEl.clientWidth;
    
    if (scrollWidth <= clientWidth) return; // No need to scroll if text fits

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    
    const scroll = () => {
      if (!isLocationScrolling) return;
      
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollWidth - clientWidth + 20) {
        scrollPosition = -20; // Reset with small gap
      }
      
      if (locationEl) {
        locationEl.scrollLeft = scrollPosition;
      }
      
      requestAnimationFrame(scroll);
    };
    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scroll);
    }, 1000); // Start after 1 second
    
    return () => clearTimeout(timeoutId);
  }, [isLocationScrolling]);

  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
    setIsLocationScrolling(false);
  };
  
  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
    setIsLocationScrolling(true);
  };

  const getSportIcons = () => {
    const sportIconMap: { [key: string]: string } = {
      'Badminton': '🏸',
      'Football': '⚽',
      'Cricket': '🏏',
      'Tennis': '🎾',
      'Basketball': '🏀',
      'Swimming': '🏊',
      'Table Tennis': '🏓',
      'Squash': '🎯',
      'Volleyball': '🏐',
      'Pool': '🎱'
    };
    return sportIconMap[venue.sport] || '🏃';
  };

  const getMultipleSports = () => {
    // Mock multiple sports for demo - in real app this would come from venue data
    const sports = [venue.sport];
    const icons = sports.map(sport => getSportIcons()).slice(0, 4);
    const remaining = Math.max(0, sports.length - 4);
    return { icons, remaining, sportNames: sports };
  };

  const { icons, remaining, sportNames } = getMultipleSports();

  return (
    <article 
      className="rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col"
      style={{ backgroundColor: '#FFFFFF' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {gallery.map((src, i) => (
            <div key={i} className="w-full h-full flex-shrink-0">
              <img 
                src={src} 
                alt={`${venue.name} ${i + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                loading="lazy" 
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />

        <div className="absolute top-3 right-3 flex items-center gap-1 backdrop-blur-sm text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#1F2937' }}>
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span>{venue.rating}</span>
        </div>

        <div className="absolute top-3 left-3 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-xl shadow-md" style={{ backgroundColor: '#1BA6A6', color: '#FFFFFF' }}>
          {getSportIcons()} {venue.sport}
        </div>

        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {gallery.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2" style={{ color: '#1F2937' }}>
          {venue.name}
        </h3>

        <div 
          ref={locationRef}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3 overflow-hidden"
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{venue.location}</span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Starting from</p>
            <p className="text-xl font-bold" style={{ color: '#1BA6A6' }}>
              ₹{venue.pricePerHour}
              <span className="text-xs font-normal text-muted-foreground">/hr</span>
            </p>
          </div>
          <Button 
            variant="default" 
            size="sm"
            className="h-10 px-5 font-semibold text-sm rounded-xl transition-all shadow-sm hover:opacity-90" 
            style={{ backgroundColor: '#1BA6A6', color: '#FFFFFF' }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
};