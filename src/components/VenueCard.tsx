import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Venue } from '@/data/venues';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-[16px] shadow-sm overflow-hidden cursor-pointer touch-none pb-6 group"
      onClick={onClick}
    >
      {/* Image carousel (16:9) */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollerRef}
          className="w-full aspect-[16/9] overflow-x-auto flex snap-x snap-mandatory scrollbar-hidden touch-pan-x"
        >
          {gallery.map((src, i) => (
            <div key={src + i} className="flex-shrink-0 w-full h-full snap-center">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
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
              className={`h-2 transition-all rounded-full ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Optional top-left badge */}
        {venue.sport && (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute left-3 top-3 bg-primary/95 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
          >
            {venue.sport}
          </motion.div>
        )}

        {/* Top-right turf initials badge */}
        <div className="absolute right-3 top-3 flex flex-col items-center">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-black/30 text-white text-xs font-bold border border-white/30"
          >
            {venue.name ? venue.name.split(' ').slice(0,2).map(s => s[0]).join('') : '–'}
          </motion.div>
          <div className="text-white text-xs mt-0.5 drop-shadow-md">★</div>
        </div>
      </div>

      {/* Content section */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-bold text-lg text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {venue.name}
        </h3>
        <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <span className="opacity-70">{venue.location}</span>
          {venue.city ? <span className="text-xs opacity-50"> • {venue.city}</span> : null}
        </div>

        {/* Meta Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {venue.amenities.slice(0, 2).map((a) => (
              <span key={a} className="text-[10px] uppercase tracking-wider font-bold bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">{a}</span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-foreground">{venue.rating}</span>
            <span className="text-[10px] font-medium text-muted-foreground">({venue.reviewCount})</span>
          </div>
        </div>

        {/* Spacing to avoid bottom nav overlap */}
        <div className="h-3" />
      </div>
    </motion.article>
  );
};
