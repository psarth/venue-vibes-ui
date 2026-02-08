
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { StarRating } from './StarRating';
import { VenueReview, getVenueStats, getVenueReviews } from '@/utils/reviewStorage';
import { format } from 'date-fns';
import { CheckCircle2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueReviewListProps {
    venueId: string;
}

export const VenueReviewList: React.FC<VenueReviewListProps> = ({ venueId }) => {
    const reviews = getVenueReviews(venueId);
    const stats = getVenueStats(venueId);

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">No reviews yet</h3>
                <p className="text-sm text-gray-500">Be the first to review this venue after your next game!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Header */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center md:border-r md:pr-10 border-gray-100">
                    <div className="text-5xl font-black text-gray-900 mb-2">{stats.avg}</div>
                    <StarRating rating={Math.floor(Number(stats.avg))} readonly size="md" />
                    <div className="text-xs text-gray-400 mt-2 font-medium">{stats.count} Verified Reviews</div>
                </div>

                <div className="flex-1 w-full space-y-2.5">
                    {stats.distribution.map((count, i) => {
                        const star = 5 - i;
                        const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-3">
                                <div className="text-[10px] font-bold text-gray-500 w-4">{star}★</div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="text-[10px] font-medium text-gray-400 w-8 text-right">{count}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                    {review.userName.slice(0, 1)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{review.userName}</div>
                                    <div className="text-[10px] text-gray-400 font-medium">{format(new Date(review.date), 'MMM dd, yyyy')}</div>
                                </div>
                            </div>
                            <StarRating rating={review.rating} readonly size="sm" />
                        </div>

                        {review.isVerified && (
                            <Badge variant="secondary" className="bg-green-50 text-green-600 border-none text-[9px] px-2 py-0.5 mb-2 font-bold flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified Booking
                            </Badge>
                        )}

                        {review.comment && (
                            <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                                "{review.comment}"
                            </p>
                        )}

                        {/* Sub Ratings chips if any */}
                        {review.subRatings && Object.values(review.subRatings).some(v => v > 0) && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50">
                                {review.subRatings.cleanliness > 0 && (
                                    <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] text-gray-500 font-semibold">
                                        Cleanliness: {review.subRatings.cleanliness}★
                                    </div>
                                )}
                                {review.subRatings.facilities > 0 && (
                                    <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] text-gray-500 font-semibold">
                                        Facilities: {review.subRatings.facilities}★
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
