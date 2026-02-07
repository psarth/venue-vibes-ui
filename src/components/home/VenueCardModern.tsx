import React, { useState, useEffect, useMemo } from 'react';
import { Venue } from '@/data/venues';
import { cn } from "@/lib/utils";
import { Star, MapPin, Calendar, Clock } from 'lucide-react';

interface VenueCardModernProps {
    venue: Venue;
    onClick: () => void;
}

export const VenueCardModern: React.FC<VenueCardModernProps> = ({ venue, onClick }) => {
    // Carousel State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Ensure we have a valid gallery, fallback to main image if empty
    const images = useMemo(() => {
        return venue.gallery && venue.gallery.length > 0
            ? venue.gallery.slice(0, 4)
            : [venue.image, venue.image, venue.image]; // Fallback to 3 duplicate images for demo if gallery missing
    }, [venue.gallery, venue.image]);

    // Auto-scroll logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, images.length]);

    // Derived State for Badges (Mocking real data logic)
    const isPopular = venue.rating >= 4.8;
    const isNew = venue.id.includes('dup'); // Mock "New" for duplicates
    // Mock availability: 0=Full, 1=1 spot, 2=Almost full, 3=Available
    const availabilityStatus = venue.id.length % 4;

    const getBadge = () => {
        if (availabilityStatus === 1) return { text: '1 spot left', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        if (availabilityStatus === 2) return { text: 'Almost full', color: 'bg-orange-100 text-orange-800 border-orange-200' };
        if (isNew) return { text: 'New venue', color: 'bg-green-100 text-green-800 border-green-200' };
        if (isPopular) return { text: 'Popular', color: 'bg-purple-100 text-purple-800 border-purple-200' };
        return { text: 'Spots available', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    };

    const badge = getBadge();
    // Memoize random distance
    const distance = useMemo(() => (Math.random() * 5 + 0.5).toFixed(1), []); // Random distance 0.5 - 5.5 km

    return (
        <div
            className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer snap-center group flex flex-col h-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onClick={onClick}
        >
            {/* Image Carousel Section */}
            <div className="relative h-48 w-full bg-gray-100">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`${venue.name} - view ${index + 1}`}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
                            index === currentImageIndex ? "opacity-100" : "opacity-0"
                        )}
                    />
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Badges - Top Left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm backdrop-blur-md", badge.color)}>
                        {badge.text}
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                            )}
                        />
                    ))}
                </div>

                {/* Rating Badge - Top Right */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 text-xs font-bold text-gray-800">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{venue.rating}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Header Info */}
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-1 flex-1 pr-2 group-hover:text-primary transition-colors">
                            {venue.name}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                            {venue.sport}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" /> {distance} km
                        </span>
                    </div>
                </div>

                {/* Date & Time Mock */}
                <div className="flex items-center gap-3 py-2 border-t border-b border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Today</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>6:00 PM - 7:00 PM</span>
                    </div>
                </div>

                {/* Footer: Price & CTA */}
                <div className="flex items-center justify-between mt-auto pt-1 gap-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium uppercase">Price</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-lg font-bold text-gray-900">₹{venue.pricePerHour}</span>
                        </div>
                    </div>

                    <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] text-sm">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};
