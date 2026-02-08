
/**
 * REVIEW STORAGE SYSTEM - MODULAR & INDEPENDENT
 * Handles both Venue and Site reviews using localStorage as a mock database.
 */

export interface VenueReview {
    id: string;
    venue_id: string;
    booking_id: string;
    user_id: string;
    userName: string;
    rating: number; // Overall
    subRatings?: {
        cleanliness?: number;
        facilities?: number;
        staff?: number;
        value?: number;
    };
    comment?: string;
    date: string;
    images?: string[];
    isVerified: boolean;
    status: 'published' | 'hidden' | 'flagged';
}

export interface SiteReview {
    id: string;
    user_id: string;
    rating: number;
    tags?: string[];
    comment?: string;
    date: string;
    lastUpdated: string;
    status: 'pending' | 'published' | 'hidden';
}

const STORAGE_KEYS = {
    VENUE_REVIEWS: 'vv_venue_reviews',
    SITE_REVIEWS: 'vv_site_reviews',
};

// --- VENUE REVIEWS ---

export const getVenueReviews = (venueId?: string): VenueReview[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VENUE_REVIEWS);
    const reviews: VenueReview[] = data ? JSON.parse(data) : [];
    if (venueId) {
        return reviews.filter(r => r.venue_id === venueId && r.status === 'published');
    }
    return reviews;
};

export const submitVenueReview = (review: Omit<VenueReview, 'id' | 'date' | 'status'>): boolean => {
    const reviews = getVenueReviews();

    // Prevent duplicates for same booking
    if (reviews.some(r => r.booking_id === review.booking_id)) {
        return false;
    }

    const newReview: VenueReview = {
        ...review,
        id: `VR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        status: 'published',
    };

    localStorage.setItem(STORAGE_KEYS.VENUE_REVIEWS, JSON.stringify([...reviews, newReview]));
    return true;
};

export const getVenueStats = (venueId: string) => {
    const reviews = getVenueReviews(venueId);
    if (reviews.length === 0) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) {
            distribution[5 - r.rating]++;
        }
    });

    return {
        avg: (sum / reviews.length).toFixed(1),
        count: reviews.length,
        distribution, // index 0 is 5 stars, index 4 is 1 star
    };
};

// --- SITE REVIEWS ---

export const getSiteReviews = (): SiteReview[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_REVIEWS);
    return data ? JSON.parse(data) : [];
};

export const getMySiteReview = (userId: string): SiteReview | null => {
    const reviews = getSiteReviews();
    return reviews.find(r => r.user_id === userId) || null;
};

export const submitSiteReview = (review: Omit<SiteReview, 'id' | 'date' | 'lastUpdated' | 'status'>): boolean => {
    const reviews = getSiteReviews();
    const existingIndex = reviews.findIndex(r => r.user_id === review.user_id);

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
        // Check for 30-day limit (except for updates which are allowed)
        // Actually the requirement says "One site review per user per 30 days" but "Allow update/edit".
        // We'll treat this as overwriting the existing one if it exists.
        reviews[existingIndex] = {
            ...reviews[existingIndex],
            ...review,
            lastUpdated: now,
        };
    } else {
        const newReview: SiteReview = {
            ...review,
            id: `SR-${Date.now()}`,
            date: now,
            lastUpdated: now,
            status: 'pending',
        };
        reviews.push(newReview);
    }

    localStorage.setItem(STORAGE_KEYS.SITE_REVIEWS, JSON.stringify(reviews));
    return true;
};

// --- ADMIN ---

export const adminUpdateVenueReviewStatus = (reviewId: string, status: VenueReview['status']) => {
    const reviews = getVenueReviews();
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
        reviews[index].status = status;
        localStorage.setItem(STORAGE_KEYS.VENUE_REVIEWS, JSON.stringify(reviews));
    }
};

export const adminDeleteVenueReview = (reviewId: string) => {
    const reviews = getVenueReviews();
    const updated = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(STORAGE_KEYS.VENUE_REVIEWS, JSON.stringify(updated));
};
