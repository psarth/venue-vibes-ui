
import React, { useState } from 'react';
import { ChevronDown, Check, Calendar as CalendarIcon, X } from 'lucide-react';
import { format, isSameDay, addDays, isToday, isTomorrow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    selectedSport: string;
    onSelectSport: (sport: string) => void;
    selectedAvailability: string;
    onSelectAvailability: (availability: string) => void;
    selectedDate: Date | null;
    onSelectDate: (date: Date | null) => void;
}

const sportsList = [
    'All Sports',
    'Football',
    'Cricket',
    'Badminton',
    'Basketball',
    'Tennis',
    'Other',
];

const availabilityList = [
    'All',
    'Spots available',
    '1-spot left',
    'Almost full',
];

export const FilterBar: React.FC<FilterBarProps> = ({
    selectedSport,
    onSelectSport,
    selectedAvailability,
    onSelectAvailability,
    selectedDate,
    onSelectDate
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Helper to format date label
    const getDateLabel = () => {
        if (!selectedDate) return 'Date';
        if (isToday(selectedDate)) return 'Today';
        if (isTomorrow(selectedDate)) return 'Tomorrow';
        return format(selectedDate, 'MMM dd');
    };

    return (
        <div className="flex gap-2.5 px-6 pb-2 overflow-x-auto no-scrollbar items-center h-12">
            {/* Date Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 outline-none flex-shrink-0 select-none",
                        selectedDate
                            ? "bg-white border-blue-200 text-primary shadow-sm ring-1 ring-blue-50"
                            : "bg-white text-gray-600 border-gray-200 shadow-sm"
                    )}>
                        <CalendarIcon className="w-4 h-4" />
                        <span>{getDateLabel()}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-auto p-4 rounded-2xl shadow-xl border-gray-100 bg-white z-50">
                    <div className="font-semibold text-gray-900 mb-3 px-1">Select Date</div>
                    <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(d) => {
                            if (d) {
                                onSelectDate(d);
                            }
                        }}
                        initialFocus
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-xl border border-gray-100 shadow-sm"
                    />
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => onSelectDate(new Date())}
                            className="flex-1 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => onSelectDate(addDays(new Date(), 1))}
                            className="flex-1 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
                        >
                            Tomorrow
                        </button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Sport Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 outline-none flex-shrink-0 select-none",
                        selectedSport !== 'All Sports'
                            ? "bg-white border-blue-200 text-primary shadow-sm ring-1 ring-blue-50"
                            : "bg-white text-gray-600 border-gray-200 shadow-sm"
                    )}>
                        <span>{selectedSport}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-2xl shadow-xl border-gray-100 bg-white z-50">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Select Sport</div>
                    {sportsList.map((sport) => (
                        <DropdownMenuItem
                            key={sport}
                            onClick={() => onSelectSport(sport)}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors",
                                selectedSport === sport ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {sport}
                            {selectedSport === sport && <Check className="w-4 h-4 text-blue-600" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Availability Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 outline-none flex-shrink-0 select-none",
                        selectedAvailability !== 'All'
                            ? "bg-white border-blue-200 text-primary shadow-sm ring-1 ring-blue-50"
                            : "bg-white text-gray-600 border-gray-200 shadow-sm"
                    )}>
                        <span>{selectedAvailability === 'All' ? 'Availability' : selectedAvailability}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60 p-1.5 rounded-2xl shadow-xl border-gray-100 bg-white z-50">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Status</div>
                    {availabilityList.map((option) => (
                        <DropdownMenuItem
                            key={option}
                            onClick={() => onSelectAvailability(option)}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors",
                                selectedAvailability === option ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {option === 'All' ? 'Any Availability' : option}
                            {selectedAvailability === option && <Check className="w-4 h-4 text-blue-600" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
