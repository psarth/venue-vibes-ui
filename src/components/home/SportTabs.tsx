
import React from 'react';
import { sports } from '@/data/venues';

interface SportTabsProps {
    selectedSport: string;
    onSelectSport: (sport: string) => void;
}

export const SportTabs: React.FC<SportTabsProps> = ({ selectedSport, onSelectSport }) => {
    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="flex gap-2 px-4 min-w-max">
                {sports.map((sport) => {
                    const isSelected = selectedSport === sport;

                    return (
                        <button
                            key={sport}
                            onClick={() => onSelectSport(sport)}
                            className={`
                px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap
                ${isSelected
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                                }
              `}
                        >
                            {sport}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
