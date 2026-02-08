
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    max?: number;
    onRatingChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    max = 5,
    onRatingChange,
    size = 'md',
    readonly = false,
}) => {
    const sizes = {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-8 h-8',
    };

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                const isActive = starValue <= rating;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={readonly}
                        onClick={() => onRatingChange?.(starValue)}
                        className={cn(
                            "transition-all duration-200 outline-none",
                            !readonly && "hover:scale-110 active:scale-95",
                            readonly ? "cursor-default" : "cursor-pointer"
                        )}
                    >
                        <Star
                            className={cn(
                                sizes[size],
                                isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300 fill-transparent"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};
