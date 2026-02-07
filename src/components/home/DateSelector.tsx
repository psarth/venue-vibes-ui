
import React, { useRef, useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelectDate }) => {
    const dates = Array.from({ length: 3 }, (_, i) => addDays(new Date(), i));
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <div className="w-full py-4">
            <div className="flex gap-3 min-w-max">
                {dates.map((date, i) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const dayName = format(date, 'dd');
                    const dayOfWeek = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEE');

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onSelectDate(date)}
                            className={cn(
                                "flex flex-col items-center justify-center w-20 h-16 rounded-2xl transition-all duration-200 border-2",
                                isSelected
                                    ? "bg-white border-white text-primary shadow-lg scale-105 transform"
                                    : "bg-white/10 border-transparent text-white hover:bg-white/20"
                            )}
                        >
                            <span className={cn("text-lg font-bold", isSelected ? "text-gray-900" : "text-white")}>
                                {dayName}
                            </span>
                            <span className={cn("text-[10px] font-medium uppercase tracking-wide", isSelected ? "text-gray-500" : "text-white/70")}>
                                {dayOfWeek}
                            </span>
                        </button>
                    );
                })}

                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 border-2",
                                "bg-white/10 border-transparent text-white hover:bg-white/20"
                            )}
                        >
                            <CalendarIcon className="w-6 h-6 text-white" />
                            <span className="text-[10px] font-medium uppercase tracking-wide text-white/70 mt-1">
                                More
                            </span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) {
                                    onSelectDate(date);
                                    setIsCalendarOpen(false);
                                }
                            }}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};
