import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getVenuesBySport, listenForVenueUpdates, listenForPriceUpdates, listenForSlotBlocking, type VenueData } from '@/utils/venueSync';
import { Radio, RefreshCw, CheckCircle2, XCircle, Zap } from 'lucide-react';

export default function SyncDemo() {
    const [venues, setVenues] = useState<Record<string, VenueData[]>>({});
    const [syncEvents, setSyncEvents] = useState<string[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    // Load venues by sport
    const loadVenues = () => {
        const sports = ['Badminton', 'Cricket', 'Football', 'Tennis'];
        const venuesBySport: Record<string, VenueData[]> = {};

        sports.forEach(sport => {
            venuesBySport[sport] = getVenuesBySport(sport);
        });

        setVenues(venuesBySport);
        setLastUpdate(new Date().toLocaleTimeString());
    };

    // Listen for real-time updates
    useEffect(() => {
        loadVenues();

        const unsubVenue = listenForVenueUpdates((venue) => {
            setSyncEvents(prev => [`🏟️ Venue Updated: ${venue.name}`, ...prev.slice(0, 9)]);
            loadVenues();
        });

        const unsubPrice = listenForPriceUpdates((data) => {
            setSyncEvents(prev => [`💰 Prices Updated: ${data.sport}`, ...prev.slice(0, 9)]);
        });

        const unsubSlots = listenForSlotBlocking((data) => {
            setSyncEvents(prev => [`🔒 Slots Updated: ${data.sport}`, ...prev.slice(0, 9)]);
        });

        return () => {
            unsubVenue();
            unsubPrice();
            unsubSlots();
        };
    }, []);

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                <Radio className="w-6 h-6 text-success animate-pulse" />
                                Real-Time Sync Demo
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Owner changes instantly reflect on customer interface
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Last Update</p>
                            <p className="text-sm font-bold text-foreground">{lastUpdate}</p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={loadVenues}
                                className="mt-2"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Sport-Wise Venue Listing */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-foreground">Sport-Wise Venue Discovery</h2>

                        {['Badminton', 'Cricket', 'Football', 'Tennis'].map(sport => (
                            <Card key={sport} className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center justify-between">
                                        <span>{sport}</span>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                            {venues[sport]?.length || 0} venues
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        Venues supporting {sport}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {venues[sport]?.length > 0 ? (
                                        <div className="space-y-2">
                                            {venues[sport].map(venue => (
                                                <div
                                                    key={venue.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-semibold text-foreground">{venue.name}</p>
                                                        <p className="text-xs text-muted-foreground">{venue.address}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-foreground">₹{venue.pricePerSlot}/slot</p>
                                                        <Badge className="bg-success/10 text-success border-success/30 text-xs mt-1">
                                                            <Radio className="w-2 h-2 mr-1" />
                                                            LIVE
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <XCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No venues available for {sport}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Sync Events Log */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-foreground">Real-Time Sync Events</h2>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-warning" />
                                    Live Updates
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Events triggered by owner actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {syncEvents.length > 0 ? (
                                        syncEvents.map((event, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-2 p-2 rounded bg-background border border-border text-xs"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-foreground font-medium">{event}</p>
                                                    <p className="text-muted-foreground text-[10px]">
                                                        {new Date().toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Waiting for sync events...</p>
                                            <p className="text-xs mt-1">Make changes in Owner Dashboard</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Instructions */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-sm">How to Test</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground space-y-2">
                                <p>1. Login as Owner (9999999992)</p>
                                <p>2. Go to "My Venue" and update details</p>
                                <p>3. Add/remove sports</p>
                                <p>4. Update slot prices</p>
                                <p>5. Block/unblock slots</p>
                                <p className="text-success font-semibold pt-2">
                                    ✅ Changes will appear here instantly!
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                </div>

                {/* Key Features */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Real-Time Sync Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-background border border-border">
                                <CheckCircle2 className="w-6 h-6 text-success mb-2" />
                                <h3 className="font-semibold text-foreground text-sm">Sport-Wise Mapping</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Venues appear in all selected sport categories
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-background border border-border">
                                <CheckCircle2 className="w-6 h-6 text-success mb-2" />
                                <h3 className="font-semibold text-foreground text-sm">Instant Price Sync</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Price changes reflect immediately on customer UI
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-background border border-border">
                                <CheckCircle2 className="w-6 h-6 text-success mb-2" />
                                <h3 className="font-semibold text-foreground text-sm">Slot Availability</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Blocked slots disappear from customer booking
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-background border border-border">
                                <CheckCircle2 className="w-6 h-6 text-success mb-2" />
                                <h3 className="font-semibold text-foreground text-sm">Auto Removal</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Removing sport hides venue from that category
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
