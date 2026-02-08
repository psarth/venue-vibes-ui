
import { useState, useEffect, useRef } from 'react';
import OwnerLayout from '@/layouts/OwnerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Building2, MapPin, DollarSign, Clock, Trophy, Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { initializeVenueSync, setVenueLiveStatus } from '@/utils/venueSync';
import { submitVenueForApproval, getVenueStatus, getStatusMessage, type VenueStatus } from '@/utils/venueApproval';
import { cn } from '@/lib/utils';

export default function OwnerVenue() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Kolkata', // Default city
    description: '',
    pricePerSlot: '',
    upiId: '',
    sports: [] as string[],
    slotDuration: '60',
    startTime: '06:00',
    endTime: '23:00',
    images: [] as string[],
    sportResources: {} as Record<string, number>,
    amenities: [] as string[]
  });

  const availableAmenities = [
    'WiFi', 'Parking', 'Washroom', 'Drinking Water', 'Changing Room',
    'Flood Lights', 'Seating Area', 'AC', 'First Aid', 'Cafeteria', 'Equipment Rental'
  ];

  const availableSports = [
    { id: 'Cricket', icon: '🏏' },
    { id: 'Football', icon: '⚽' },
    { id: 'Badminton', icon: '🏸' },
    { id: 'Tennis', icon: '🎾' },
    { id: 'Basketball', icon: '🏀' },
    { id: 'Swimming', icon: '🏊' },
    { id: 'Squash', icon: '🎾' },
    { id: 'Table Tennis', icon: '🏓' }
  ];

  useEffect(() => {
    // Load venue data
    const loadVenue = () => {
      const stored = localStorage.getItem('owner_venue');
      if (stored) {
        setFormData(prev => ({ ...prev, ...JSON.parse(stored) }));
      }
      setLoading(false);
    };
    loadVenue();
  }, []);

  const handleSportToggle = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64String]
        }));
        toast({
          title: "Photo Added 📸",
          description: "Your photo has been uploaded successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const [status, setStatus] = useState<VenueStatus>('draft');

  useEffect(() => {
    const venueData = localStorage.getItem('owner_venue');
    if (venueData) {
      const parsed = JSON.parse(venueData);
      setFormData(parsed);
      setStatus(parsed.status || 'draft');
    }
    setLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      const oldVenueData = JSON.parse(localStorage.getItem('owner_venue') || '{}');

      const venueData = {
        ...formData,
        id: oldVenueData.id || `venue_${localStorage.getItem('user_mobile') || 'demo'}`,
        ownerId: oldVenueData.ownerId || 'owner_demo',
        pricePerSlot: Number(formData.pricePerSlot) || 1000,
        slotDuration: Number(formData.slotDuration) || 60,
      };

      // Check if critical fields changed
      const nameChanged = oldVenueData.name && oldVenueData.name !== venueData.name;
      const addressChanged = oldVenueData.address && oldVenueData.address !== venueData.address;
      const cityChanged = oldVenueData.city && oldVenueData.city !== venueData.city;
      const sportsChanged = JSON.stringify(oldVenueData.sports) !== JSON.stringify(venueData.sports);

      if (status === 'draft' || status === 'rejected' || nameChanged || addressChanged || cityChanged || sportsChanged) {
        // Initial submission or critical change
        const requestType = (nameChanged || addressChanged || cityChanged || sportsChanged) ? 'critical_edit' : 'new_venue';
        submitVenueForApproval(venueData);
        setStatus('pending');
        toast({
          title: requestType === 'critical_edit' ? "Request Sent 🚀" : "Submitted for Approval 🚀",
          description: requestType === 'critical_edit'
            ? "Critical changes require admin verification. Your venue is pending review."
            : "Your venue details have been sent to admin for verification."
        });
      } else {
        // Simple update (photos, amenities, about, pricePerSlot)
        const updatedVenue = { ...venueData, status };
        localStorage.setItem('owner_venue', JSON.stringify(updatedVenue));

        // 🔥 DEMO SYNC: In demo, we sync even if pending so user can see it works
        // In real app, we'd only sync once approved
        initializeVenueSync(updatedVenue);

        toast({
          title: "Settings Updated ✅",
          description: "Changes have been applied and synced to customer app."
        });
      }

      setSaving(false);
    }, 1000);
  };

  if (loading) {
    return (
      <OwnerLayout title="Manage Venue">
        <div className="flex justify-center p-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </OwnerLayout>
    );
  }

  const statusInfo = getStatusMessage(status);

  const isFirstTime = !localStorage.getItem('owner_venue');

  return (
    <OwnerLayout
      title={isFirstTime ? "Welcome! Register Your Venue" : "Manage Venue"}
      subtitle={isFirstTime ? "Complete your profile to start receiving bookings" : "Update details, sports, and pricing"}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Status Alert */}
        <div className={cn(
          "p-4 rounded-xl border flex items-center justify-between",
          status === 'approved' ? "bg-success/10 border-success/30" :
            status === 'pending' ? "bg-warning/10 border-warning/30" :
              status === 'rejected' ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              status === 'approved' ? "bg-success text-white" :
                status === 'pending' ? "bg-warning text-white" :
                  status === 'rejected' ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
            )}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className={cn("font-bold text-sm", statusInfo.color)}>{statusInfo.title}</p>
              <p className="text-xs text-muted-foreground">{statusInfo.description}</p>
            </div>
          </div>
          {status === 'approved' && (
            <div className="px-2 py-1 rounded bg-success text-[10px] font-bold text-white animate-pulse">
              LIVE
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Header Actions - Mobile/Tablet sticky */}
          <div className="flex items-center justify-between pb-4 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-sm z-30 py-2">
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-foreground">Venue Profile</h2>
              <p className="text-xs text-muted-foreground">This info is visible to customers</p>
            </div>
            <div className="ml-auto">
              <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column: Basic Info */}
            <div className="md:col-span-2 space-y-6">

              {/* Basic Details Card */}
              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Building2 className="w-5 h-5" />
                  <h3 className="font-semibold text-foreground">Basic Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Venue Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border/50 text-foreground h-11"
                      placeholder="e.g. Super Kick Turf"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        className="pl-9 bg-background border-border/50 text-foreground min-h-[80px] resize-none"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full venue address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">City</Label>
                    <select
                      id="city"
                      className="w-full h-11 px-3 rounded-md bg-background border border-border/50 text-foreground"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="Kolkata">Kolkata</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Description</Label>
                    <Textarea
                      id="desc"
                      className="bg-background border-border/50 text-foreground min-h-[100px] resize-none"
                      placeholder="Tell customers about your facilities, lighting, parking..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Sports Selection Card */}
              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Trophy className="w-5 h-5" />
                  <h3 className="font-semibold text-foreground">Sports Offered</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableSports.map(sport => {
                    const isSelected = formData.sports.includes(sport.id);
                    return (
                      <button
                        key={sport.id}
                        type="button"
                        onClick={() => handleSportToggle(sport.id)}
                        className={`
                          relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                          ${isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/40 bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/30'
                          }
                        `}
                      >
                        <span className="text-2xl filter drop-shadow-sm">{sport.icon}</span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground/80'}`}>{sport.id}</span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {formData.sports.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/50 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      <Label className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-black font-display">Resource Capacity</Label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.sports.map(sportId => (
                        <div key={sportId} className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors group">
                          <div className="flex items-center gap-3">
                            <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">
                              {availableSports.find(s => s.id === sportId)?.icon}
                            </span>
                            <span className="text-xs font-bold text-foreground/80">{sportId}</span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              className="w-16 h-8 text-center bg-background border-border/40 text-xs font-bold focus-visible:ring-primary/30"
                              value={formData.sportResources?.[sportId] || 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                setFormData({
                                  ...formData,
                                  sportResources: {
                                    ...formData.sportResources,
                                    [sportId]: val
                                  }
                                });
                              }}
                            />
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Units</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Settings */}
            <div className="space-y-6">

              {/* Pricing & Timing Card */}
              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm h-full">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-semibold text-foreground">Settings</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Base Price (Per Slot)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={formData.pricePerSlot}
                        onChange={e => setFormData({ ...formData, pricePerSlot: e.target.value })}
                        className="pl-9 bg-background border-border/50 text-foreground h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Slot Duration</Label>
                    <select
                      className="flex h-11 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.slotDuration}
                      onChange={e => setFormData({ ...formData, slotDuration: e.target.value })}
                    >
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="90">90 Minutes</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Open</Label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        className="bg-background border-border/50 text-foreground h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Close</Label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        className="bg-background border-border/50 text-foreground h-10"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="upi" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">UPI ID (Payouts)</Label>
                        <Input
                          id="upi"
                          value={formData.upiId}
                          onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                          className="bg-background border-border/50 text-foreground h-11"
                          placeholder="username@upi"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div className="pt-6 border-t border-border/50 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Trophy className="w-5 h-5" />
                      <h3 className="font-semibold text-foreground">Amenities</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableAmenities.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className={cn(
                            "flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 text-[11px] font-bold transition-all",
                            formData.amenities?.includes(amenity)
                              ? "bg-primary/10 border-primary text-primary shadow-sm"
                              : "bg-background border-border/40 text-muted-foreground hover:border-border"
                          )}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground font-bold font-display">Venue Photos</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        className="text-primary border-primary/30 hover:bg-primary/10 h-7 gap-1 text-[10px]"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </Button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAddImage}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-border/30 aspect-square bg-muted/30">
                          <img src={img} alt="Venue" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              className="text-white hover:text-red-400 p-1"
                              onClick={() => handleRemoveImage(idx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {formData.images.length === 0 ? (
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="col-span-3 aspect-[3/1] rounded-lg border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        >
                          <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                          <span className="text-[10px] text-muted-foreground font-medium">Upload Photos</span>
                        </button>
                      ) : (
                        formData.images.length < 9 && (
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="aspect-square rounded-lg border-2 border-dashed border-border/40 flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all group"
                          >
                            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </OwnerLayout>
  );
}