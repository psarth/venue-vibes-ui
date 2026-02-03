import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Camera, Calendar, CreditCard, LogOut, ChevronRight, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut, loading, demoUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user && !demoUser) {
      navigate('/auth');
    }
  }, [user, loading, navigate, demoUser]);

  useEffect(() => {
    if (demoUser) {
      // Set demo profile data
      setProfile({
        full_name: demoUser.name,
        phone: demoUser.role === 'admin' ? '+91 9876543210' : '+91 ' + (demoUser.role === 'owner' ? '9999999992' : '9999999991'),
        avatar_url: null,
      });
      setEditData({
        full_name: demoUser.name,
        phone: demoUser.role === 'admin' ? '+91 9876543210' : '+91 ' + (demoUser.role === 'owner' ? '9999999992' : '9999999991'),
      });
    } else if (user) {
      fetchProfile();
    }
  }, [user, demoUser]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, phone, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
      setEditData({
        full_name: data.full_name || '',
        phone: data.phone || '',
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editData.full_name,
        phone: editData.phone,
      })
      .eq('user_id', user.id);

    setIsSaving(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile',
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
      setIsEditing(false);
      fetchProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin': return Shield;
      case 'owner': return Building2;
      default: return User;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'Administrator';
      case 'owner': return 'Venue Owner';
      default: return 'Customer';
    }
  };

  const RoleIcon = getRoleIcon();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-premium-sm">
        <div className="flex items-center gap-4 h-14 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">Profile</h1>
        </div>
      </header>

      {/* Profile Header Card */}
      <div className="p-4">
        <div className="card-premium p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-premium-lg">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary-foreground" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-premium-md">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold font-display">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-premium">
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Section */}
      {isEditing ? (
        <div className="p-4">
          <div className="card-premium p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold font-display">Edit Profile</h3>
            
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editData.full_name}
                onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                className="input-premium mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
                className="input-premium mt-1.5"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 h-11 rounded-xl"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-11 btn-premium rounded-xl"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Menu Items */
        <div className="p-4 space-y-3">
          <button 
            onClick={() => setIsEditing(true)}
            className="card-premium w-full p-4 flex items-center gap-4 animate-fade-in"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Edit Profile</p>
              <p className="text-sm text-muted-foreground">Update your information</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button 
            onClick={() => navigate('/bookings')}
            className="card-premium w-full p-4 flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="h-11 w-11 rounded-xl bg-success/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">My Bookings</p>
              <p className="text-sm text-muted-foreground">View your booking history</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button 
            className="card-premium w-full p-4 flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="h-11 w-11 rounded-xl bg-warning/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Payment Methods</p>
              <p className="text-sm text-muted-foreground">Manage your payment options</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Role-specific links */}
          {userRole === 'owner' && (
            <button 
              onClick={() => navigate('/owner')}
              className="card-premium w-full p-4 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Owner Dashboard</p>
                <p className="text-sm text-muted-foreground">Manage your venues</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          {userRole === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="card-premium w-full p-4 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="h-11 w-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Admin Dashboard</p>
                <p className="text-sm text-muted-foreground">Platform management</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          <button 
            onClick={handleSignOut}
            className="card-premium w-full p-4 flex items-center gap-4 animate-fade-in border-destructive/20"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="h-11 w-11 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-destructive">Sign Out</p>
              <p className="text-sm text-muted-foreground">Log out of your account</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;