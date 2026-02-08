import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Venue } from '@/data/venues';

interface VenueCardProps {
  venue: Venue;
  onClick: () => void;
}


export const VenueCard = ({ venue, onClick }: VenueCardProps) => {
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const gallery = venue.gallery && venue.gallery.length ? venue.gallery : [venue.image];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const i = Math.round(el.scrollLeft / w);
        setIndex(i);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <article
      className="bg-white rounded-[16px] shadow-sm overflow-hidden cursor-pointer touch-none pb-6"
      onClick={onClick}
    >
      {/* Image carousel (16:9) */}
      <div className="relative">
        <div
          ref={scrollerRef}
          className="w-full aspect-[16/9] overflow-x-auto flex snap-x snap-mandatory scrollbar-hidden touch-pan-x"
        >
          {gallery.map((src, i) => (
            <div key={src + i} className="flex-shrink-0 w-full h-full snap-center">
              <img
                src={src}
                alt={venue.name + ' image ' + (i + 1)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="absolute left-0 right-0 bottom-3 flex items-center justify-center gap-2">
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 w-8 rounded-full transition-all ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Optional top-left badge */}
        {venue.sport && (
          <div className="absolute left-3 top-3 bg-primary/95 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-md">
            {venue.sport}
          </div>
        )}

        {/* Top-right turf initials badge with symbols */}
        <div className="absolute right-3 top-3 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-black/30 text-white text-xs font-bold border border-white/30">
            {venue.name ? venue.name.split(' ').slice(0,2).map(s => s[0]).join('') : '–'}
          </div>
          <div className="text-white text-xs mt-0.5">★</div>
        </div>
      </div>

      {/* Content section */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-base text-foreground leading-tight mb-1 line-clamp-2">
          {venue.name}
        </h3>
        <div className="text-sm text-muted-foreground mb-2">
          {venue.location}
          {venue.city ? <span className="text-xs text-muted-foreground"> • {venue.city}</span> : null}
        </div>

        {/* Meta Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {venue.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-xs bg-muted px-2 py-1 rounded-full">{a}</span>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-card/60 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold">{venue.rating}</span>
            <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
          </div>
        </div>

        {/* Spacing to avoid bottom nav overlap */}
        <div className="h-3" />
      </div>
    </article>
  );
};
