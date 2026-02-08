
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from './StarRating';
import { submitVenueReview } from '@/utils/reviewStorage';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";

interface VenueReviewFormProps {
    venueId: string;
    venueName: string;
    bookingId: string;
    userId: string;
    userName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const PROFANITY_LIST = ['badword1', 'badword2']; // Example placeholder

export const VenueReviewForm: React.FC<VenueReviewFormProps> = ({
    venueId,
    venueName,
    bookingId,
    userId,
    userName,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [subRatings, setSubRatings] = useState({
        cleanliness: 0,
        facilities: 0,
        staff: 0,
        value: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please provide an overall rating.");
            return;
        }

        // Basic profanity filter
        let cleanedComment = comment;
        PROFANITY_LIST.forEach(word => {
            const reg = new RegExp(word, 'gi');
            cleanedComment = cleanedComment.replace(reg, '***');
        });

        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = submitVenueReview({
            venue_id: venueId,
            booking_id: bookingId,
            user_id: userId,
            userName: userName || 'Anonymous Player',
            rating,
            subRatings,
            comment: cleanedComment,
            isVerified: true
        });

        setIsSubmitting(false);

        if (success) {
            toast.success("Thanks for reviewing this venue!");
            onSuccess?.();
            onClose();
        } else {
            toast.error("You have already reviewed this booking.");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Review {venueName}</DialogTitle>
                    <DialogDescription>
                        How was your experience? Your feedback helps the community!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Overall Rating */}
                    <div className="flex flex-col items-center gap-3 py-2 bg-gray-50 rounded-2xl">
                        <Label className="font-bold text-gray-700">Overall Rating *</Label>
                        <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                            size="lg"
                        />
                    </div>

                    {/* Sub Ratings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-500 uppercase">Cleanliness</Label>
                            <StarRating
                                rating={subRatings.cleanliness}
                                onRatingChange={(r) => setSubRatings(prev => ({ ...prev, cleanliness: r }))}
                                size="sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-500 uppercase">Facilities</Label>
                            <StarRating
                                rating={subRatings.facilities}
                                onRatingChange={(r) => setSubRatings(prev => ({ ...prev, facilities: r }))}
                                size="sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-500 uppercase">Management</Label>
                            <StarRating
                                rating={subRatings.staff}
                                onRatingChange={(r) => setSubRatings(prev => ({ ...prev, staff: r }))}
                                size="sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-500 uppercase">Value</Label>
                            <StarRating
                                rating={subRatings.value}
                                onRatingChange={(r) => setSubRatings(prev => ({ ...prev, value: r }))}
                                size="sm"
                            />
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Write a Review (Optional)</Label>
                        <Textarea
                            placeholder="Tell us what you liked or what could be better..."
                            maxLength={300}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="rounded-xl border-gray-100 bg-gray-50 h-24"
                        />
                        <p className="text-[10px] text-right text-gray-400">
                            {comment.length}/300 characters
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        className="w-full h-12 rounded-xl text-md font-bold shadow-lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
