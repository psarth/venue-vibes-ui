
import React, { useState, useEffect } from "react";
import { MapPin, Search, Navigation, Clock, ChevronDown, Check, X } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface LocationSelectorProps {
    selectedCity: string;
    onSelectCity: (city: string) => void;
}

const popularCities = ["Bangalore", "Mumbai", "Delhi", "Kolkata", "Hyderabad", "Chennai"];
const recentLocations = ["Indiranagar, Bangalore", "Koramangala, Bangalore"];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    selectedCity,
    onSelectCity,
}) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLocating, setIsLocating] = useState(false);

    // Initialize from local storage if available
    useEffect(() => {
        const savedCity = localStorage.getItem("venue-vibes-location");
        if (savedCity && savedCity !== selectedCity) {
            onSelectCity(savedCity);
        }
    }, []);

    const handleSelect = (city: string) => {
        onSelectCity(city);
        localStorage.setItem("venue-vibes-location", city);
        setOpen(false);
    };

    const handleUseCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, we'd reverse geocode here.
                    // For now, we'll simulate finding "Bangalore"
                    setTimeout(() => {
                        handleSelect("Bangalore");
                        setIsLocating(false);
                    }, 800);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setIsLocating(false);
                    // Optional: Show toast error
                }
            );
        } else {
            setIsLocating(false);
        }
    };

    const filteredCities = popularCities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="flex items-center gap-1.5 text-white/95 hover:text-white transition-all active:scale-95 group outline-none">
                    <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-md group-hover:bg-white/20 transition-colors">
                        <MapPin className="w-4 h-4 text-white" fill="currentColor" />
                    </div>
                    <span className="font-bold text-base tracking-tight truncate max-w-[120px]">
                        {selectedCity || "Select Location"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80 group-hover:translate-y-0.5 transition-transform" />
                </button>
            </DrawerTrigger>
            <DrawerContent className="h-[95vh] rounded-t-[2rem]">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="pb-0 text-left relative">
                        <div className="flex justify-between items-center mb-4">
                            <DrawerTitle className="text-2xl font-bold">Select Location</DrawerTitle>
                            <DrawerClose asChild>
                                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </DrawerClose>
                        </div>

                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search city, area or locality"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </DrawerHeader>

                    <div className="px-4 pb-8 overflow-y-auto max-h-[60vh] space-y-6">

                        {/* Current Location Option */}
                        <button
                            onClick={handleUseCurrentLocation}
                            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 text-primary transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Navigation className={cn("w-4 h-4", isLocating && "animate-pulse")} fill="currentColor" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold">Use Current Location</span>
                                <span className="text-xs text-gray-500">Using GPS</span>
                            </div>
                        </button>

                        <div className="h-px bg-gray-100 w-full" />

                        {/* Recent Locations */}
                        {!searchQuery && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Locations</h3>
                                {recentLocations.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => handleSelect(loc.split(',')[0])}
                                        className="flex items-center gap-3 w-full py-2 hover:bg-gray-50 rounded-lg transition-colors px-2 -mx-2"
                                    >
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">{loc}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Popular Cities / Search Results */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {searchQuery ? "Search Results" : "Popular Cities"}
                            </h3>
                            <div className="grid grid-cols-1 gap-1">
                                {filteredCities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleSelect(city)}
                                        className="flex items-center justify-between w-full py-3 px-2 -mx-2 hover:bg-gray-50 rounded-lg transition-colors group"
                                    >
                                        <span className={cn(
                                            "text-sm",
                                            selectedCity === city ? "font-bold text-primary" : "font-medium text-gray-700"
                                        )}>
                                            {city}
                                        </span>
                                        {selectedCity === city && <Check className="w-4 h-4 text-primary" />}
                                    </button>
                                ))}
                                {filteredCities.length === 0 && (
                                    <div className="py-4 text-center text-sm text-gray-400">
                                        No cities found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
