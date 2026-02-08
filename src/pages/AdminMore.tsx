import { useState, useEffect } from 'react';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Settings, LogOut, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  allowOwnerRegistration: boolean;
  requireVenueApproval: boolean;
}

const AdminMoreContent = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { signOut, userRole } = useAuth();
  const [profile, setProfile] = useState<AdminProfile>({
    name: 'Admin User',
    email: 'admin@venuevibes.com',
    phone: '+91 9876543210',
    allowOwnerRegistration: true,
    requireVenueApproval: true
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  if (userRole !== 'admin') {
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
    <AdminLayout title="Admin Settings">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5" style={{ color: colors.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Admin Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label style={{ color: colors.text.secondary }}>Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ backgroundColor: colors.bg.primary, borderColor: colors.accent.border, color: colors.text.primary }}
              />
            </div>
            
            <div>
              <Label style={{ color: colors.text.secondary }}>Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                type="email"
                style={{ backgroundColor: colors.bg.primary, borderColor: colors.accent.border, color: colors.text.primary }}
              />
            </div>
            
            <div>
              <Label style={{ color: colors.text.secondary }}>Phone Number</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                type="tel"
                style={{ backgroundColor: colors.bg.primary, borderColor: colors.accent.border, color: colors.text.primary }}
              />
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5" style={{ color: colors.accent.secondary }} />
            <h2 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Platform Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Allow Owner Registration</p>
                <p className="text-sm" style={{ color: colors.text.secondary }}>New owners can register on platform</p>
              </div>
              <Switch
                checked={profile.allowOwnerRegistration}
                onCheckedChange={(checked) => setProfile({ ...profile, allowOwnerRegistration: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Require Venue Approval</p>
                <p className="text-sm" style={{ color: colors.text.secondary }}>New venues need admin approval</p>
              </div>
              <Switch
                checked={profile.requireVenueApproval}
                onCheckedChange={(checked) => setProfile({ ...profile, requireVenueApproval: checked })}
              />
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.bg.surface, borderColor: colors.accent.border }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Platform Commission</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ color: colors.text.secondary }}>Platform Commission</span>
              <span className="font-semibold" style={{ color: colors.accent.success }}>10%</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: colors.text.secondary }}>Convenience Fee</span>
              <span className="font-semibold" style={{ color: colors.accent.success }}>2%</span>
            </div>
            <div className="border-t pt-3" style={{ borderColor: colors.accent.border }}>
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color: colors.text.primary }}>Total Platform Revenue</span>
                <span className="text-xl font-bold" style={{ color: colors.accent.success }}>12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: colors.accent.success, color: '#fff' }}
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
            className="w-full h-12 text-base font-semibold"
            style={{ 
              borderColor: colors.accent.error, 
              color: colors.accent.error,
              backgroundColor: 'transparent'
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function AdminMore() {
  return (
    <AdminThemeProvider>
      <AdminMoreContent />
    </AdminThemeProvider>
  );
}