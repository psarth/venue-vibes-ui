
import React from 'react';
import { Venue } from '@/data/venues';
import { VenueCardModern } from './VenueCardModern';

interface VenueSectionProps {
    title: string;
    venues: Venue[];
    onVenueClick: (venue: Venue) => void;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ title, venues, onVenueClick }) => {
    if (venues.length === 0) return null;

    return (
        <div className="flex flex-col space-y-3 py-2">
            <div className="flex items-center justify-between px-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    See all
                </button>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar pb-4 pt-1 px-6">
                <div className="flex gap-4 min-w-max">
                    {venues.map((venue) => (
                        <VenueCardModern
                            key={venue.id}
                            venue={venue}
                            onClick={() => onVenueClick(venue)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
