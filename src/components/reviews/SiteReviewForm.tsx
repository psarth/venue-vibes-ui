
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from './StarRating';
import { submitSiteReview, getMySiteReview } from '@/utils/reviewStorage';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SiteReviewFormProps {
    userId: string;
}

const REVIEW_TAGS = [
    'Booking Experience',
    'App Performance',
    'Payments',
    'Customer Support',
    'UI/UX'
];

export const SiteReviewForm: React.FC<SiteReviewFormProps> = ({ userId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastReviewDate, setLastReviewDate] = useState<string | null>(null);

    useEffect(() => {
        const myReview = getMySiteReview(userId);
        if (myReview) {
            setRating(myReview.rating);
            setComment(myReview.comment || '');
            setSelectedTags(myReview.tags || []);
            setLastReviewDate(myReview.lastUpdated);
        }
    }, [userId]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please provide a rating.");
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = submitSiteReview({
            user_id: userId,
            rating,
            comment,
            tags: selectedTags
        });

        setIsSubmitting(false);

        if (success) {
            toast.success("Feedback submitted! We value your input.");
            setLastReviewDate(new Date().toISOString());
        }
    };

    return (
        <div className="card-premium p-6 space-y-6 bg-white shadow-xl rounded-3xl animate-fade-in border-none">
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 font-display">Give us Feedback</h3>
                <p className="text-sm text-muted-foreground">Rate your overall experience with the platform.</p>
            </div>

            {/* Star Rating */}
            <div className="flex flex-col items-center gap-3 py-4 bg-blue-50/50 rounded-2xl">
                <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                />
                <Label className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {rating === 5 ? 'Excellent!' : rating === 1 ? 'Poor' : rating > 0 ? 'Good' : 'Select Stars'}
                </Label>
            </div>

            {/* Tags */}
            <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">What are you reviewing?</Label>
                <div className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <Badge
                                key={tag}
                                variant={isSelected ? "default" : "secondary"}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                    "cursor-pointer px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border-none select-none",
                                    isSelected ? "bg-primary text-white scale-105" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                )}
                            >
                                {tag}
                            </Badge>
                        );
                    })}
                </div>
            </div>

            {/* Textarea */}
            <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Detailed Feedback (Optional)</Label>
                <Textarea
                    placeholder="What can we improve? What do you love?"
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="rounded-2xl border-gray-100 bg-gray-50 h-32 focus-visible:ring-primary shadow-inner"
                />
                <p className="text-[10px] text-right text-gray-400 font-medium">
                    {comment.length}/500 characters
                </p>
            </div>

            <div className="pt-2">
                <Button
                    className="btn-premium w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                >
                    {isSubmitting ? "Sending..." : lastReviewDate ? "Update Feedback" : "Submit Feedback"}
                </Button>
                {lastReviewDate && (
                    <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                        Last shared on {new Date(lastReviewDate).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};
