
import { useState, useMemo } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import AdminLayout from '@/layouts/AdminLayout';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import {
    getVenueReviews,
    getSiteReviews,
    adminUpdateVenueReviewStatus,
    adminDeleteVenueReview
} from '@/utils/reviewStorage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/reviews/StarRating';
import {
    MessageSquare,
    Trash2,
    EyeOff,
    Eye,
    Flag,
    Download,
    Search,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AdminReviewsContent = () => {
    const { colors } = useAdminTheme();
    const [activeTab, setActiveTab] = useState<'venue' | 'site'>('venue');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const venueReviews = useMemo(() => getVenueReviews(), [refreshTrigger]);
    const siteReviews = useMemo(() => getSiteReviews(), [refreshTrigger]);

    const filteredVenueReviews = venueReviews.filter(r =>
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.venue_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSiteReviews = siteReviews.filter(r =>
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
        adminUpdateVenueReviewStatus(id, newStatus as any);
        setRefreshTrigger(prev => prev + 1);
        toast.success(`Review ${newStatus === 'published' ? 'published' : 'hidden'}`);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            adminDeleteVenueReview(id);
            setRefreshTrigger(prev => prev + 1);
            toast.success("Review deleted permanently");
        }
    };

    const exportCSV = () => {
        const data = activeTab === 'venue' ? venueReviews : siteReviews;
        const csvContent = "data:text/csv;charset=utf-8,"
            + Object.keys(data[0] || {}).join(",") + "\n"
            + data.map(r => Object.values(r).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${activeTab}_reviews_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout title="Review Management">
            <div className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex bg-black/10 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('venue')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'venue' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'
                                }`}
                        >
                            Venue Reviews ({venueReviews.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('site')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'site' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'
                                }`}
                        >
                            Site Feedback ({siteReviews.length})
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="pl-10 pr-4 py-2 bg-black/5 border border-white/10 rounded-xl text-sm outline-none focus:border-primary/50 w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={exportCSV} className="rounded-xl border-white/10 bg-black/5">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-4">
                    {activeTab === 'venue' ? (
                        filteredVenueReviews.length === 0 ? (
                            <div className="text-center py-20 bg-black/5 rounded-2xl border border-dashed border-white/10">
                                <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No venue reviews found matching your search.</p>
                            </div>
                        ) : (
                            filteredVenueReviews.map((review) => (
                                <div key={review.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white">{review.userName}</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs font-bold text-primary uppercase">{review.venue_id}</span>
                                            </div>
                                            <Badge className={review.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                                                {review.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <StarRating rating={review.rating} readonly size="sm" />
                                            <span className="text-xs text-gray-500">{format(new Date(review.date), 'MMM dd, HH:mm')}</span>
                                            {review.isVerified && (
                                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-300 italic">"{review.comment}"</p>
                                    </div>

                                    <div className="flex md:flex-col gap-2 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-lg h-9 w-9 p-0 hover:bg-white/5"
                                            onClick={() => handleToggleStatus(review.id, review.status)}
                                            title={review.status === 'published' ? "Hide Review" : "Publish Review"}
                                        >
                                            {review.status === 'published' ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-primary" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-lg h-9 w-9 p-0 hover:bg-white/5"
                                            title="Flag as Fake"
                                        >
                                            <Flag className="h-4 w-4 text-orange-400" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-lg h-9 w-9 p-0 hover:bg-red-500/10"
                                            onClick={() => handleDelete(review.id)}
                                            title="Delete Permanently"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        filteredSiteReviews.length === 0 ? (
                            <div className="text-center py-20 bg-black/5 rounded-2xl border border-dashed border-white/10">
                                <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No site feedback found.</p>
                            </div>
                        ) : (
                            filteredSiteReviews.map((review) => (
                                <div key={review.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase">User: {review.user_id.slice(0, 8)}</span>
                                            </div>
                                            <StarRating rating={review.rating} readonly size="sm" />
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                            {review.tags?.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-sm text-gray-300">"{review.comment}"</p>
                                        <div className="text-[10px] text-gray-500">
                                            Submitted on: {format(new Date(review.date), 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default function AdminReviews() {
    return (
        <AdminThemeProvider>
            <AdminReviewsContent />
        </AdminThemeProvider>
    );
}
