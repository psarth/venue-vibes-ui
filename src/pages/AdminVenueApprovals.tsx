import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getPendingApprovals, approveVenue, rejectVenue, type VenueApprovalRequest } from '@/utils/venueApproval';
import { CheckCircle2, XCircle, Clock, Building2, MapPin, DollarSign, Image as ImageIcon, Trophy, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';

function AdminVenueApprovalsContent() {
    const { toast } = useToast();
    const [pendingRequests, setPendingRequests] = useState<VenueApprovalRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<VenueApprovalRequest | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingRequests();
    }, []);

    const loadPendingRequests = () => {
        setLoading(true);
        const requests = getPendingApprovals();
        setPendingRequests(requests);
        setLoading(false);
    };

    const handleApprove = (request: VenueApprovalRequest) => {
        try {
            approveVenue(request.id);
            toast({
                title: "Venue Approved ✅",
                description: "Venue is now live on customer interface"
            });
            loadPendingRequests();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve venue",
                variant: "destructive"
            });
        }
    };

    const handleRejectClick = (request: VenueApprovalRequest) => {
        setSelectedRequest(request);
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = () => {
        if (!selectedRequest || !rejectionReason.trim()) {
            toast({
                title: "Error",
                description: "Please provide a rejection reason",
                variant: "destructive"
            });
            return;
        }

        try {
            rejectVenue(selectedRequest.id, rejectionReason);
            toast({
                title: "Venue Rejected",
                description: "Owner has been notified"
            });
            setRejectDialogOpen(false);
            setRejectionReason('');
            setSelectedRequest(null);
            loadPendingRequests();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject venue",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Venue Approvals">
                <div className="flex justify-center items-center h-64">
                    <Clock className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Venue Approvals" subtitle="Review and approve venue listings">
            <div className="space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                                    <h3 className="text-2xl font-bold text-foreground mt-1">{pendingRequests.length}</h3>
                                </div>
                                <Clock className="w-8 h-8 text-warning" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">New Venues</p>
                                    <h3 className="text-2xl font-bold text-foreground mt-1">
                                        {pendingRequests.filter(r => r.requestType === 'new_venue').length}
                                    </h3>
                                </div>
                                <Building2 className="w-8 h-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Sport Changes</p>
                                    <h3 className="text-2xl font-bold text-foreground mt-1">
                                        {pendingRequests.filter(r => r.requestType === 'sport_change').length}
                                    </h3>
                                </div>
                                <Trophy className="w-8 h-8 text-success" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Requests */}
                {pendingRequests.length === 0 ? (
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                            <p className="text-muted-foreground">No pending venue approvals at the moment</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {pendingRequests.map((request) => {
                            const venueData = request.requestData;

                            return (
                                <Card key={request.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CardTitle className="text-foreground">{venueData.name}</CardTitle>
                                                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Pending
                                                    </Badge>
                                                    {request.requestType === 'sport_change' && (
                                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                                            Sport Change
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardDescription className="text-muted-foreground">
                                                    Submitted {new Date(request.submittedAt).toLocaleDateString()} at {new Date(request.submittedAt).toLocaleTimeString()}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {request.requestType === 'new_venue' ? (
                                            <>
                                                {/* Venue Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Location</p>
                                                                <p className="text-sm text-foreground font-medium">{venueData.address}, {venueData.city}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <DollarSign className="w-4 h-4 text-muted-foreground mt-1" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Starting Price</p>
                                                                <p className="text-sm text-foreground font-medium">₹{venueData.pricePerSlot}/slot</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <Trophy className="w-4 h-4 text-muted-foreground mt-1" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Sports</p>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {venueData.sports?.map((sport: string) => (
                                                                        <Badge key={sport} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                                                            {sport}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-2">
                                                            <ImageIcon className="w-4 h-4 text-muted-foreground mt-1" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Photos</p>
                                                                <p className="text-sm text-foreground font-medium">{venueData.images?.length || 0} uploaded</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <Building2 className="w-4 h-4 text-muted-foreground mt-1" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">About</p>
                                                                <p className="text-sm text-foreground line-clamp-2">{venueData.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Venue Images */}
                                                {venueData.images && venueData.images.length > 0 && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-2">Venue Photos</p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {venueData.images.slice(0, 3).map((img: string, idx: number) => (
                                                                <img
                                                                    key={idx}
                                                                    src={img}
                                                                    alt={`Venue ${idx + 1}`}
                                                                    className="w-full h-24 object-cover rounded-lg border border-border"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            /* Sport Change Request */
                                            <div className="bg-background/50 border border-border rounded-lg p-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-2">Removed Sports</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {request.requestData.removedSports?.map((sport: string) => (
                                                                <Badge key={sport} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
                                                                    {sport}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-2">Added Sports</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {request.requestData.addedSports?.map((sport: string) => (
                                                                <Badge key={sport} variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                                                                    {sport}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-border">
                                            <Button
                                                onClick={() => handleApprove(request)}
                                                className="bg-success hover:bg-success/90 text-white flex-1"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => handleRejectClick(request)}
                                                variant="outline"
                                                className="border-destructive/30 text-destructive hover:bg-destructive/10 flex-1"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            Reject Venue Listing
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Please provide a reason for rejection. This will be shown to the owner.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-foreground">Rejection Reason</Label>
                            <Textarea
                                id="reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g., Incomplete venue photos, incorrect location details..."
                                className="bg-background border-border text-foreground min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="bg-background border-border text-foreground">
                            Cancel
                        </Button>
                        <Button onClick={handleRejectConfirm} className="bg-destructive hover:bg-destructive/90 text-white">
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AdminLayout>
    );
}

export default function AdminVenueApprovals() {
    return (
        <AdminThemeProvider>
            <AdminVenueApprovalsContent />
        </AdminThemeProvider>
    );
}
