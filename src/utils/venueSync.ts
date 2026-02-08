/**
 * Real-time Venue Sync Utility - Enhanced Version
 * Ensures owner changes instantly reflect on customer interface with sport-wise mapping
 */

export interface VenueData {
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
    isLive: boolean;
    createdAt: string;
    updatedAt: string;
    city?: string;
    rating?: number;
    amenities?: string[];
    sportResources?: Record<string, number>;
    convenienceFee?: number;
    feeType?: 'fixed' | 'percentage';
    isFeeEnabled?: boolean;
}

export interface SlotPrice {
    venueId: string;
    sport: string;
    date: string;
    slotId: string;
    price: number;
}

export interface BlockedSlot {
    venueId: string;
    sport: string;
    date: string;
    slotId: string;
}

/**
 * 🔥 SPORT-WISE VENUE MAPPING
 * Maps venue to all selected sports for customer discovery
 */
export const syncVenueToCustomer = (venueData: VenueData): void => {
    try {
        // Get existing venues from customer storage
        const existingVenues = localStorage.getItem('customer_venues');
        const venues = existingVenues ? JSON.parse(existingVenues) : [];

        // Find and update or add new venue
        const venueIndex = venues.findIndex((v: VenueData) => v.id === venueData.id);

        const updatedVenue = {
            ...venueData,
            updatedAt: new Date().toISOString(),
            createdAt: venueData.createdAt || new Date().toISOString()
        };

        if (venueIndex >= 0) {
            venues[venueIndex] = updatedVenue;
        } else {
            venues.push(updatedVenue);
        }

        // Save to customer storage
        localStorage.setItem('customer_venues', JSON.stringify(venues));

        // 🔥 SPORT-WISE MAPPING: Map venue to each sport category
        syncSportWiseMapping(venueData);

        // Trigger custom event for real-time UI updates
        window.dispatchEvent(new CustomEvent('venue-updated', { detail: updatedVenue }));

        console.log('✅ Venue synced to customer interface:', venueData.name);
        console.log('📍 Mapped to sports:', venueData.sports.join(', '));
    } catch (error) {
        console.error('❌ Error syncing venue:', error);
    }
};

/**
 * 🔥 SPORT-WISE MAPPING
 * Creates sport-specific venue indexes for customer discovery
 */
const syncSportWiseMapping = (venueData: VenueData): void => {
    try {
        const sportMapping = localStorage.getItem('customer_sport_venues');
        const mapping: Record<string, string[]> = sportMapping ? JSON.parse(sportMapping) : {};

        // Remove venue from all sports first (in case sports were removed)
        Object.keys(mapping).forEach(sport => {
            mapping[sport] = mapping[sport].filter(id => id !== venueData.id);
        });

        // Add venue to selected sports only if it's live
        if (venueData.isLive) {
            venueData.sports.forEach(sport => {
                if (!mapping[sport]) {
                    mapping[sport] = [];
                }
                if (!mapping[sport].includes(venueData.id)) {
                    mapping[sport].push(venueData.id);
                }
            });
        }

        localStorage.setItem('customer_sport_venues', JSON.stringify(mapping));

        // Trigger sport mapping update event
        window.dispatchEvent(new CustomEvent('sport-mapping-updated', {
            detail: { venueId: venueData.id, sports: venueData.sports }
        }));

        console.log('✅ Sport-wise mapping updated');
    } catch (error) {
        console.error('❌ Error updating sport mapping:', error);
    }
};

/**
 * 🔥 GET VENUES BY SPORT
 * Customer interface uses this to get sport-specific venues
 */
export const getVenuesBySport = (sport: string): VenueData[] => {
    try {
        const sportMapping = localStorage.getItem('customer_sport_venues');
        const mapping: Record<string, string[]> = sportMapping ? JSON.parse(sportMapping) : {};

        const venueIds = mapping[sport] || [];

        const allVenues = localStorage.getItem('customer_venues');
        const venues: VenueData[] = allVenues ? JSON.parse(allVenues) : [];

        // Filter venues by IDs and ensure they're live
        return venues.filter(v => venueIds.includes(v.id) && v.isLive);
    } catch (error) {
        console.error('❌ Error getting venues by sport:', error);
        return [];
    }
};

/**
 * 🔥 SYNC SLOT PRICES
 * Updates slot prices and triggers customer UI refresh
 */
export const syncSlotPrices = (venueId: string, sport: string, date: string, prices: Record<string, number>): void => {
    try {
        const storageKey = 'customer_slot_prices';
        const existing = localStorage.getItem(storageKey);
        const priceMap = existing ? JSON.parse(existing) : {};

        // Update prices for this venue/sport/date
        Object.keys(prices).forEach(slotId => {
            const key = `${venueId}_${date}_${sport}_${slotId}`;
            priceMap[key] = prices[slotId];
        });

        localStorage.setItem(storageKey, JSON.stringify(priceMap));

        // Trigger event for real-time customer UI update
        window.dispatchEvent(new CustomEvent('prices-updated', {
            detail: { venueId, sport, date, prices }
        }));

        console.log('✅ Slot prices synced to customer interface');
    } catch (error) {
        console.error('❌ Error syncing prices:', error);
    }
};

/**
 * 🔥 GET SLOT PRICE
 * Customer interface uses this to get current slot price
 */
export const getSlotPrice = (venueId: string, sport: string, date: string, slotId: string, defaultPrice: number): number => {
    try {
        const storageKey = 'customer_slot_prices';
        const existing = localStorage.getItem(storageKey);
        const priceMap = existing ? JSON.parse(existing) : {};

        const key = `${venueId}_${date}_${sport}_${slotId}`;
        return priceMap[key] || defaultPrice;
    } catch (error) {
        return defaultPrice;
    }
};

/**
 * 🔥 SYNC BLOCKED SLOTS
 * Updates slot availability and triggers customer UI refresh
 */
export const syncBlockedSlots = (venueId: string, sport: string, date: string, blockedSlotIds: string[]): void => {
    try {
        const storageKey = 'customer_blocked_slots';
        const existing = localStorage.getItem(storageKey);
        const blockedMap = existing ? JSON.parse(existing) : {};

        const key = `${venueId}_${date}_${sport}`;
        blockedMap[key] = blockedSlotIds;

        localStorage.setItem(storageKey, JSON.stringify(blockedMap));

        // Trigger event for real-time customer UI update
        window.dispatchEvent(new CustomEvent('slots-blocked', {
            detail: { venueId, sport, date, blockedSlotIds }
        }));

        console.log('✅ Blocked slots synced to customer interface');
    } catch (error) {
        console.error('❌ Error syncing blocked slots:', error);
    }
};

/**
 * 🔥 CHECK IF SLOT IS BLOCKED
 * Customer interface uses this to check slot availability
 */
export const isSlotBlocked = (venueId: string, sport: string, date: string, slotId: string): boolean => {
    try {
        const storageKey = 'customer_blocked_slots';
        const existing = localStorage.getItem(storageKey);
        const blockedMap = existing ? JSON.parse(existing) : {};

        const key = `${venueId}_${date}_${sport}`;
        const blockedSlots = blockedMap[key] || [];

        return blockedSlots.includes(slotId);
    } catch (error) {
        return false;
    }
};

/**
 * 🔥 REMOVE SPORT FROM VENUE
 * Handles edge case: Owner removes a sport
 */
export const removeSportFromVenue = (venueId: string, sport: string): void => {
    try {
        // Update sport mapping
        const sportMapping = localStorage.getItem('customer_sport_venues');
        const mapping: Record<string, string[]> = sportMapping ? JSON.parse(sportMapping) : {};

        if (mapping[sport]) {
            mapping[sport] = mapping[sport].filter(id => id !== venueId);
            localStorage.setItem('customer_sport_venues', JSON.stringify(mapping));
        }

        // Trigger event
        window.dispatchEvent(new CustomEvent('sport-removed', {
            detail: { venueId, sport }
        }));

        console.log(`✅ Venue removed from ${sport} category`);
    } catch (error) {
        console.error('❌ Error removing sport:', error);
    }
};

/**
 * 🔥 UNPUBLISH VENUE
 * Handles edge case: Owner unpublishes venue
 */
export const unpublishVenue = (venueId: string): void => {
    try {
        // Update venue status
        const allVenues = localStorage.getItem('customer_venues');
        const venues: VenueData[] = allVenues ? JSON.parse(allVenues) : [];

        const venue = venues.find(v => v.id === venueId);
        if (venue) {
            venue.isLive = false;
            venue.updatedAt = new Date().toISOString();
            localStorage.setItem('customer_venues', JSON.stringify(venues));
        }

        // Remove from all sport mappings
        const sportMapping = localStorage.getItem('customer_sport_venues');
        const mapping: Record<string, string[]> = sportMapping ? JSON.parse(sportMapping) : {};

        Object.keys(mapping).forEach(sport => {
            mapping[sport] = mapping[sport].filter(id => id !== venueId);
        });

        localStorage.setItem('customer_sport_venues', JSON.stringify(mapping));

        // Trigger event
        window.dispatchEvent(new CustomEvent('venue-unpublished', {
            detail: { venueId }
        }));

        console.log('✅ Venue unpublished from customer interface');
    } catch (error) {
        console.error('❌ Error unpublishing venue:', error);
    }
};

/**
 * Get venue live status
 */
export const getVenueLiveStatus = (venueId: string): boolean => {
    try {
        const venueData = localStorage.getItem('owner_venue');
        if (!venueData) return false;

        const venue = JSON.parse(venueData);
        return venue.isLive !== false;
    } catch (error) {
        return false;
    }
};

/**
 * Set venue live status
 */
export const setVenueLiveStatus = (venueId: string, isLive: boolean): void => {
    try {
        const venueData = localStorage.getItem('owner_venue');
        if (!venueData) return;

        const venue = JSON.parse(venueData);
        venue.isLive = isLive;
        venue.updatedAt = new Date().toISOString();

        localStorage.setItem('owner_venue', JSON.stringify(venue));

        if (isLive) {
            syncVenueToCustomer(venue);
        } else {
            unpublishVenue(venueId);
        }

        console.log(`✅ Venue ${isLive ? 'published' : 'unpublished'}`);
    } catch (error) {
        console.error('❌ Error updating venue status:', error);
    }
};

/**
 * Initialize venue sync (call when owner saves venue)
 */
export const initializeVenueSync = (venueData: Partial<VenueData>): void => {
    const fullVenueData: VenueData = {
        id: venueData.id || `venue_${Date.now()}`,
        ownerId: venueData.ownerId || 'owner_demo',
        name: venueData.name || '',
        address: venueData.address || '',
        description: venueData.description || '',
        sports: venueData.sports || [],
        pricePerSlot: venueData.pricePerSlot || 1000,
        slotDuration: venueData.slotDuration || 60,
        startTime: venueData.startTime || '06:00',
        endTime: venueData.endTime || '23:00',
        upiId: venueData.upiId || '',
        images: venueData.images || [],
        isLive: venueData.isLive !== false,
        createdAt: venueData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        city: venueData.city || 'Kolkata',
        rating: venueData.rating || 4.5,
        amenities: venueData.amenities || [],
        sportResources: venueData.sportResources || {},
        convenienceFee: venueData.convenienceFee ?? 50, // Default 50
        feeType: venueData.feeType || 'fixed',
        isFeeEnabled: venueData.isFeeEnabled ?? true
    };

    syncVenueToCustomer(fullVenueData);
};

/**
 * Listen for venue updates (for customer interface)
 */
export const listenForVenueUpdates = (callback: (venue: VenueData) => void): (() => void) => {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent;
        callback(customEvent.detail);
    };

    window.addEventListener('venue-updated', handler);

    return () => {
        window.removeEventListener('venue-updated', handler);
    };
};

/**
 * Listen for price updates (for customer interface)
 */
export const listenForPriceUpdates = (callback: (data: any) => void): (() => void) => {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent;
        callback(customEvent.detail);
    };

    window.addEventListener('prices-updated', handler);

    return () => {
        window.removeEventListener('prices-updated', handler);
    };
};

/**
 * Listen for slot blocking updates (for customer interface)
 */
export const listenForSlotBlocking = (callback: (data: any) => void): (() => void) => {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent;
        callback(customEvent.detail);
    };

    window.addEventListener('slots-blocked', handler);

    return () => {
        window.removeEventListener('slots-blocked', handler);
    };
};

/**
 * 🔥 SYNC VENUE FEES (Admin functionality)
 */
export const syncVenueFees = (venueId: string, convenienceFee: number, feeType: 'fixed' | 'percentage', isFeeEnabled: boolean): void => {
    try {
        const storageKey = 'customer_venues';
        const existing = localStorage.getItem(storageKey);
        if (!existing) return;

        let venues: VenueData[] = JSON.parse(existing);
        const index = venues.findIndex(v => v.id === venueId);

        if (index !== -1) {
            venues[index] = {
                ...venues[index],
                convenienceFee,
                feeType,
                isFeeEnabled,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(storageKey, JSON.stringify(venues));

            // Trigger event for real-time customer UI update
            window.dispatchEvent(new CustomEvent('venue-fees-updated', {
                detail: { venueId, convenienceFee, feeType, isFeeEnabled }
            }));

            console.log(`✅ convenience fee updated for venue ${venueId}: ${convenienceFee} (${feeType})`);
        }
    } catch (error) {
        console.error('❌ Error syncing fees:', error);
    }
};

/**
 * Listen for fee updates
 */
export const listenForFeeUpdates = (callback: (data: any) => void): (() => void) => {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent;
        callback(customEvent.detail);
    };

    window.addEventListener('venue-fees-updated', handler);

    return () => {
        window.removeEventListener('venue-fees-updated', handler);
    };
};
