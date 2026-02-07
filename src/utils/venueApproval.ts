/**
 * Venue Status Management System
 * Handles venue approval workflow and admin verification
 */
import { initializeVenueSync } from './venueSync';

export type VenueStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'disabled';

export interface VenueApprovalRequest {
    id: string;
    venueId: string;
    ownerId: string;
    requestType: 'new_venue' | 'sport_change' | 'critical_edit' | 'additional_venue';
    requestData: any;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
}

export interface VenueWithStatus {
    id: string;
    ownerId: string;
    name: string;
    address: string;
    description: string;
    sports: string[];
    pricePerSlot: number;
    slotDuration: number;
    startTime: string;
    endTime: string;
    upiId: string;
    images: string[];
    amenities: string[];
    city: string;
    rating: number;

    // Status fields
    status: VenueStatus;
    isLive: boolean;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectionReason?: string;
}

/**
 * Submit venue for admin approval
 */
export const submitVenueForApproval = (venueData: Partial<VenueWithStatus>): string => {
    try {
        const requestId = `req_${Date.now()}`;

        const approvalRequest: VenueApprovalRequest = {
            id: requestId,
            venueId: venueData.id || `venue_${Date.now()}`,
            ownerId: venueData.ownerId || 'owner_demo',
            requestType: 'new_venue',
            requestData: venueData,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        // Save to pending approvals
        const pendingApprovals = localStorage.getItem('admin_pending_approvals');
        const approvals: VenueApprovalRequest[] = pendingApprovals ? JSON.parse(pendingApprovals) : [];
        approvals.push(approvalRequest);
        localStorage.setItem('admin_pending_approvals', JSON.stringify(approvals));

        // Update venue status to pending
        const venueWithStatus: VenueWithStatus = {
            ...venueData as VenueWithStatus,
            status: 'pending',
            isLive: false,
            updatedAt: new Date().toISOString()
        };

        // Save to owner's venue storage
        localStorage.setItem('owner_venue', JSON.stringify(venueWithStatus));

        console.log('✅ Venue submitted for admin approval:', requestId);
        return requestId;
    } catch (error) {
        console.error('❌ Error submitting venue for approval:', error);
        throw error;
    }
};

/**
 * Admin: Get all pending approval requests
 */
export const getPendingApprovals = (): VenueApprovalRequest[] => {
    try {
        const pendingApprovals = localStorage.getItem('admin_pending_approvals');
        const approvals: VenueApprovalRequest[] = pendingApprovals ? JSON.parse(pendingApprovals) : [];
        return approvals.filter(a => a.status === 'pending');
    } catch (error) {
        console.error('❌ Error getting pending approvals:', error);
        return [];
    }
};

/**
 * Admin: Approve venue
 */
export const approveVenue = (requestId: string, adminId: string = 'admin_demo'): void => {
    try {
        // Get approval request
        const pendingApprovals = localStorage.getItem('admin_pending_approvals');
        const approvals: VenueApprovalRequest[] = pendingApprovals ? JSON.parse(pendingApprovals) : [];

        const request = approvals.find(a => a.id === requestId);
        if (!request) {
            throw new Error('Approval request not found');
        }

        // Update request status
        request.status = 'approved';
        request.reviewedAt = new Date().toISOString();
        request.reviewedBy = adminId;

        localStorage.setItem('admin_pending_approvals', JSON.stringify(approvals));

        // Update venue status
        const venueData: VenueWithStatus = {
            ...request.requestData,
            status: 'approved',
            isLive: true,
            approvedAt: new Date().toISOString(),
            approvedBy: adminId,
            updatedAt: new Date().toISOString()
        };

        // Save to owner's venue storage
        localStorage.setItem('owner_venue', JSON.stringify(venueData));

        // 🔥 SYNC TO CUSTOMER INTERFACE
        initializeVenueSync(venueData);

        console.log('✅ Venue approved and synced to customer interface');
    } catch (error) {
        console.error('❌ Error approving venue:', error);
        throw error;
    }
};

/**
 * Admin: Reject venue
 */
export const rejectVenue = (requestId: string, reason: string, adminId: string = 'admin_demo'): void => {
    try {
        // Get approval request
        const pendingApprovals = localStorage.getItem('admin_pending_approvals');
        const approvals: VenueApprovalRequest[] = pendingApprovals ? JSON.parse(pendingApprovals) : [];

        const request = approvals.find(a => a.id === requestId);
        if (!request) {
            throw new Error('Approval request not found');
        }

        // Update request status
        request.status = 'rejected';
        request.reviewedAt = new Date().toISOString();
        request.reviewedBy = adminId;
        request.rejectionReason = reason;

        localStorage.setItem('admin_pending_approvals', JSON.stringify(approvals));

        // Update venue status
        const ownerVenue = localStorage.getItem('owner_venue');
        if (ownerVenue) {
            const venueData: VenueWithStatus = JSON.parse(ownerVenue);
            venueData.status = 'rejected';
            venueData.isLive = false;
            venueData.rejectionReason = reason;
            venueData.updatedAt = new Date().toISOString();

            localStorage.setItem('owner_venue', JSON.stringify(venueData));
        }

        console.log('✅ Venue rejected with reason:', reason);
    } catch (error) {
        console.error('❌ Error rejecting venue:', error);
        throw error;
    }
};

/**
 * Owner: Get venue status
 */
export const getVenueStatus = (venueId: string): VenueStatus => {
    try {
        const ownerVenue = localStorage.getItem('owner_venue');
        if (!ownerVenue) return 'draft';

        const venueData: VenueWithStatus = JSON.parse(ownerVenue);
        return venueData.status || 'draft';
    } catch (error) {
        return 'draft';
    }
};

/**
 * Owner: Check if can add more venues
 */
export const canAddMoreVenues = (ownerId: string): boolean => {
    try {
        // Check how many venues this owner has
        const ownerVenue = localStorage.getItem('owner_venue');

        // For now, allow only 1 venue by default
        // Additional venues require admin approval
        return !ownerVenue;
    } catch (error) {
        return false;
    }
};

/**
 * Submit sport change request for approval
 */
export const submitSportChangeRequest = (
    venueId: string,
    ownerId: string,
    oldSports: string[],
    newSports: string[]
): string => {
    try {
        const requestId = `req_${Date.now()}`;

        const approvalRequest: VenueApprovalRequest = {
            id: requestId,
            venueId,
            ownerId,
            requestType: 'sport_change',
            requestData: {
                oldSports,
                newSports,
                addedSports: newSports.filter(s => !oldSports.includes(s)),
                removedSports: oldSports.filter(s => !newSports.includes(s))
            },
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        // Save to pending approvals
        const pendingApprovals = localStorage.getItem('admin_pending_approvals');
        const approvals: VenueApprovalRequest[] = pendingApprovals ? JSON.parse(pendingApprovals) : [];
        approvals.push(approvalRequest);
        localStorage.setItem('admin_pending_approvals', JSON.stringify(approvals));

        console.log('✅ Sport change request submitted for approval:', requestId);
        return requestId;
    } catch (error) {
        console.error('❌ Error submitting sport change request:', error);
        throw error;
    }
};

/**
 * Check if venue edit requires admin approval
 */
export const requiresAdminApproval = (field: string): boolean => {
    const criticalFields = ['name', 'address', 'sports', 'city'];
    return criticalFields.includes(field);
};

/**
 * Get venue approval status message
 */
export const getStatusMessage = (status: VenueStatus): { title: string; description: string; color: string } => {
    switch (status) {
        case 'draft':
            return {
                title: 'Draft',
                description: 'Complete your venue details and submit for approval',
                color: 'text-muted-foreground'
            };
        case 'pending':
            return {
                title: 'Pending Approval',
                description: 'Your venue is under review by our admin team',
                color: 'text-warning'
            };
        case 'approved':
            return {
                title: 'Approved & Live',
                description: 'Your venue is live on the customer app',
                color: 'text-success'
            };
        case 'rejected':
            return {
                title: 'Rejected',
                description: 'Your venue listing was rejected. Please review feedback.',
                color: 'text-destructive'
            };
        case 'disabled':
            return {
                title: 'Disabled',
                description: 'Your venue is temporarily hidden from customers',
                color: 'text-muted-foreground'
            };
        default:
            return {
                title: 'Unknown',
                description: 'Status unknown',
                color: 'text-muted-foreground'
            };
    }
};
