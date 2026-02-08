import OwnerLayout from '@/layouts/OwnerLayout';
import { useState } from 'react';
import { User, Settings, LogOut, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  allowInstantBooking: boolean;
  allowCancellation: boolean;
}

export default function OwnerSettings() {
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();
  const [profile, setProfile] = useState<OwnerProfile>({
    name: 'Owner User',
    email: 'owner@venuevibes.com',
    phone: '+91 9876543210',
    allowInstantBooking: true,
    allowCancellation: true
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  if (userRole !== 'owner') {
    navigate('/auth');
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <OwnerLayout title="Settings">
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="p-4 rounded-lg border bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Profile Details</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                type="email"
                className="bg-background border-border text-foreground"
              />
            </div>
            
            <div>
              <Label className="text-muted-foreground">Phone Number</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                type="tel"
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="p-4 rounded-lg border bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Booking Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Allow Instant Booking</p>
                <p className="text-sm text-muted-foreground">Customers can book without approval</p>
              </div>
              <Switch
                checked={profile.allowInstantBooking}
                onCheckedChange={(checked) => setProfile({ ...profile, allowInstantBooking: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Allow Cancellation</p>
                <p className="text-sm text-muted-foreground">Customers can cancel bookings</p>
              </div>
              <Switch
                checked={profile.allowCancellation}
                onCheckedChange={(checked) => setProfile({ ...profile, allowCancellation: checked })}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : saved ? (
              '✓ Saved Successfully'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </OwnerLayout>
  );
}