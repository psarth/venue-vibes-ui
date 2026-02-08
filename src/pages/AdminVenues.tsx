import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { Building2, MapPin, User, Phone, Ban, CheckCircle, Loader2, Eye, DollarSign, Info, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { syncVenueFees } from '@/utils/venueSync';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

interface Venue {
  _id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  location: string;
  sports: string[];
  status: 'active' | 'disabled';
  totalBookings: number;
  performance: 'high' | 'medium' | 'low';
  convenienceFee?: number;
  feeType?: 'fixed' | 'percentage';
  isFeeEnabled?: boolean;
}

const AdminVenuesContent = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { colors } = useAdminTheme();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  // Fee Editing State
  const [editingFeeVenue, setEditingFeeVenue] = useState<Venue | null>(null);
  const [feeValue, setFeeValue] = useState('');
  const [feeType, setFeeType] = useState<'fixed' | 'percentage'>('fixed');
  const [isFeeEnabled, setIsFeeEnabled] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Load real synced venues if any
        const synced = localStorage.getItem('customer_venues');
        if (synced) {
          const parsed = JSON.parse(synced);
          const mapped: Venue[] = parsed.map((v: any) => ({
            _id: v.id,
            name: v.name,
            ownerName: v.ownerName || 'Demo Owner',
            ownerPhone: v.upiId || 'Not provided',
            location: v.address,
            sports: v.sports,
            status: v.isLive ? 'active' : 'disabled',
            totalBookings: Math.floor(Math.random() * 200),
            performance: 'high',
            convenienceFee: v.convenienceFee,
            feeType: v.feeType,
            isFeeEnabled: v.isFeeEnabled
          }));
          setVenues(mapped);
        } else {
          setVenues([
            {
              _id: '1',
              name: 'PowerPlay Arena',
              ownerName: 'Rajesh Kumar',
              ownerPhone: '9876543210',
              location: 'Indiranagar',
              sports: ['Cricket', 'Football'],
              status: 'active',
              totalBookings: 156,
              performance: 'high'
            }
          ]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setLoading(false);
      }
    };

    if (userRole === 'admin') {
      fetchVenues();
    }
  }, [userRole]);

  if (userRole !== 'admin') {
    return null;
  }

  const openFeeDialog = (venue: Venue) => {
    setEditingFeeVenue(venue);
    setFeeValue((venue.convenienceFee || 50).toString());
    setFeeType(venue.feeType || 'fixed');
    setIsFeeEnabled(venue.isFeeEnabled !== false);
  };

  const handleSaveFee = () => {
    if (!editingFeeVenue) return;

    const newValue = parseFloat(feeValue);
    if (isNaN(newValue)) return;

    syncVenueFees(editingFeeVenue._id, newValue, feeType, isFeeEnabled);

    setVenues(venues.map(v =>
      v._id === editingFeeVenue._id
        ? { ...v, convenienceFee: newValue, feeType, isFeeEnabled }
        : v
    ));

    toast({
      title: "Platform Fee Updated ✅",
      description: `New fee structure applied to ${editingFeeVenue.name}`
    });

    setEditingFeeVenue(null);
  };

  const toggleVenueStatus = (venueId: string) => {
    setVenues(venues.map(v =>
      v._id === venueId
        ? { ...v, status: v.status === 'active' ? 'disabled' : 'active' }
        : v
    ));
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-900/20 text-green-400'
      : 'bg-red-900/20 text-red-400';
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high': return 'bg-green-900/20 text-green-400';
      case 'medium': return 'bg-yellow-900/20 text-yellow-400';
      case 'low': return 'bg-red-900/20 text-red-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Venue Management">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2" style={{ color: colors.text.secondary }}>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading venues...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Venue Management">
      <div className="space-y-4 lg:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="p-3 lg:p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4" style={{ color: colors.accent.primary }} />
              <span className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>Total Venues</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>{venues.length}</p>
          </div>

          <div className="p-3 lg:p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" style={{ color: colors.accent.success }} />
              <span className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>Active</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.accent.success }}>
              {venues.filter(v => v.status === 'active').length}
            </p>
          </div>

          <div className="p-3 lg:p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Ban className="h-4 w-4" style={{ color: colors.accent.error }} />
              <span className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>Disabled</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.accent.error }}>
              {venues.filter(v => v.status === 'disabled').length}
            </p>
          </div>

          <div className="p-3 lg:p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4" style={{ color: colors.accent.warning }} />
              <span className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>High Performers</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold" style={{ color: colors.accent.warning }}>
              {venues.filter(v => v.performance === 'high').length}
            </p>
          </div>
        </div>

        {/* Venues List */}
        {isMobile ? (
          /* Mobile Card Layout */
          <div className="space-y-3">
            {venues.map(venue => (
              <div key={venue._id} className="p-4 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Building2 className="h-5 w-5 flex-shrink-0" style={{ color: colors.text.secondary }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate" style={{ color: colors.text.primary }}>
                        {venue.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs" style={{ color: colors.text.secondary }}>
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{venue.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.secondary }}>
                    <User className="h-3 w-3" />
                    <span>{venue.ownerName}</span>
                    <Phone className="h-3 w-3 ml-2" />
                    <span>{venue.ownerPhone}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {venue.sports.map(sport => (
                      <span
                        key={sport}
                        className="px-2 py-1 rounded text-xs font-medium bg-blue-900/20 text-blue-400"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(venue.performance)}`}>
                        {venue.performance.charAt(0).toUpperCase() + venue.performance.slice(1)}
                      </span>
                      <span className="text-xs" style={{ color: colors.text.secondary }}>
                        {venue.totalBookings} bookings
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 p-2 rounded-lg transition-colors hover:bg-blue-900/20 text-blue-400 text-sm font-medium touch-manipulation"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => openFeeDialog(venue)}
                    className="flex-1 p-2 rounded-lg transition-colors hover:bg-yellow-900/20 text-yellow-500 text-sm font-medium touch-manipulation"
                    title="Manage Fees"
                  >
                    <DollarSign className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => toggleVenueStatus(venue._id)}
                    className={`flex-1 p-2 rounded-lg transition-colors text-sm font-medium touch-manipulation ${venue.status === 'active'
                      ? 'hover:bg-red-900/20 text-red-400'
                      : 'hover:bg-green-900/20 text-green-400'
                      }`}
                    title={venue.status === 'active' ? 'Disable Venue' : 'Enable Venue'}
                  >
                    {venue.status === 'active' ? <Ban className="h-4 w-4 mx-auto" /> : <CheckCircle className="h-4 w-4 mx-auto" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.accent.border }}>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Venue & Owner</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Location</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Sports</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Performance</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Fee structure</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Status</th>
                  <th className="text-left py-3 px-4" style={{ color: colors.text.secondary }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map(venue => (
                  <tr key={venue._id} className="border-b" style={{ borderColor: colors.accent.border }}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5" style={{ color: colors.text.secondary }} />
                        <div>
                          <p className="font-medium" style={{ color: colors.text.primary }}>
                            {venue.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm" style={{ color: colors.text.secondary }}>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {venue.ownerName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {venue.ownerPhone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm" style={{ color: colors.text.secondary }}>
                        <MapPin className="h-3 w-3" />
                        {venue.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {venue.sports.map(sport => (
                          <span
                            key={sport}
                            className="px-2 py-1 rounded text-xs font-medium bg-blue-900/20 text-blue-400"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(venue.performance)}`}>
                          {venue.performance.charAt(0).toUpperCase() + venue.performance.slice(1)}
                        </span>
                        <p className="text-xs" style={{ color: colors.text.secondary }}>
                          {venue.totalBookings} bookings
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold" style={{ color: colors.text.primary }}>
                          {venue.feeType === 'percentage' ? `${venue.convenienceFee}%` : `₹${venue.convenienceFee}`}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                          {venue.isFeeEnabled !== false ? 'Enabled' : 'Bypassed'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                        {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded-lg transition-colors hover:bg-blue-900/20 text-blue-400"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openFeeDialog(venue)}
                          className="p-2 rounded-lg transition-colors hover:bg-yellow-900/20 text-yellow-500"
                          title="Manage Fee"
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleVenueStatus(venue._id)}
                          className={`p-2 rounded-lg transition-colors ${venue.status === 'active'
                            ? 'hover:bg-red-900/20 text-red-400'
                            : 'hover:bg-green-900/20 text-green-400'
                            }`}
                          title={venue.status === 'active' ? 'Disable Venue' : 'Enable Venue'}
                        >
                          {venue.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Performance Alerts */}
        <div className="space-y-3">
          <h3 className="text-base lg:text-lg font-semibold" style={{ color: colors.text.primary }}>Performance Alerts</h3>

          {venues.filter(v => v.performance === 'low' || v.status === 'disabled').map(venue => (
            <div key={venue._id} className="p-3 lg:p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm lg:text-base" style={{ color: colors.text.primary }}>
                    {venue.name} - {venue.status === 'disabled' ? 'Inactive Venue' : 'Low Performance'}
                  </p>
                  <p className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>
                    Owner: {venue.ownerName} • {venue.totalBookings} bookings
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Management Dialog */}
      <Dialog open={!!editingFeeVenue} onOpenChange={(open) => !open && setEditingFeeVenue(null)}>
        <DialogContent className="border-border/50 shadow-2xl max-w-sm" style={{ backgroundColor: colors.bg.surface }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: colors.text.primary }}>
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <DollarSign className="w-5 h-5" />
              </div>
              Platform Fee Control
            </DialogTitle>
            <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
              Set convenience fee for <strong>{editingFeeVenue?.name}</strong>. Reflects instantly on customer payments.
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold" style={{ color: colors.text.primary }}>Platform Fee</Label>
                <p className="text-[10px]" style={{ color: colors.text.secondary }}>Enable or disable for this venue</p>
              </div>
              <Switch
                checked={isFeeEnabled}
                onCheckedChange={setIsFeeEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {isFeeEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-black" style={{ color: colors.text.secondary }}>Fee Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFeeType('fixed')}
                      className={cn(
                        "py-2 rounded-lg text-xs font-bold border transition-all",
                        feeType === 'fixed'
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20"
                      )}
                    >
                      Fixed Amount (₹)
                    </button>
                    <button
                      onClick={() => setFeeType('percentage')}
                      className={cn(
                        "py-2 rounded-lg text-xs font-bold border transition-all",
                        feeType === 'percentage'
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20"
                      )}
                    >
                      Percentage (%)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-black" style={{ color: colors.text.secondary }}>
                    Fee Value {feeType === 'fixed' ? '(₹)' : '(%)'}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={feeValue}
                      onChange={(e) => setFeeValue(e.target.value)}
                      className="bg-muted/10 border-border/40 h-11 text-lg font-bold pl-10"
                      style={{ color: colors.text.primary }}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {feeType === 'fixed' ? '₹' : '%'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-blue-200/60">
                    {feeType === 'fixed'
                      ? "A flat fee will be added to every booking total for this venue."
                      : "The fee will be calculated as a percentage of the slot's base price."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              onClick={() => setEditingFeeVenue(null)}
              className="border-border/40 hover:bg-muted/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveFee}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 px-6"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default function AdminVenues() {
  return (
    <AdminThemeProvider>
      <AdminVenuesContent />
    </AdminThemeProvider>
  );
}