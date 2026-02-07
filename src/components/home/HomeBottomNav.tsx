
import React from 'react';
import { Home, Users, Calendar, Trophy, User } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BottomNavProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export const HomeBottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'find-players', label: 'Find Players', icon: Users },
        { id: 'book', label: 'Book', icon: Calendar },
        { id: 'my-games', label: 'My Games', icon: Trophy },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-1 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto h-16">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 outline-none select-none",
                                isActive ? "text-primary" : "text-gray-400 hover:text-gray-500"
                            )}
                        >
                            <div className={cn(
                                "relative p-1 rounded-xl transition-all duration-300",
                                isActive && "bg-primary/10"
                            )}>
                                <Icon
                                    className={cn(
                                        "w-6 h-6 transition-all duration-300",
                                        isActive && "scale-105"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-all duration-200",
                                isActive ? "font-semibold" : ""
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
