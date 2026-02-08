
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut, ChevronRight, Heart, Headphones, Building2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { HomeBottomNav } from '@/components/home/HomeBottomNav';
import OwnerNavigation from '@/components/OwnerNavigation';
import { SiteReviewForm } from '@/components/reviews/SiteReviewForm';
import { MessageSquare } from 'lucide-react';

interface Profile {
  full_name: string | null;
  phone: string | null;
  role: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading, demoUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && !user && !demoUser) {
      navigate('/auth');
    }
  }, [user, loading, navigate, demoUser]);

  useEffect(() => {
    if (demoUser) {
      setProfile({
        full_name: demoUser.name,
        phone: demoUser.phone || null,
        role: demoUser.role
      });
    } else if (user) {
      setProfile({
        full_name: user.user_metadata?.full_name || 'User',
        phone: user.user_metadata?.phone || user.phone || null,
        role: user.user_metadata?.role || 'customer'
      });
    }
  }, [user, demoUser]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || (!user && !demoUser)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const displayPhone = profile?.phone || 'Not Available';
  const displayName = profile?.full_name || 'User';
  const displayRole = profile?.role === 'owner' ? 'Venue Owner' : 'Customer';
  const isOwner = profile?.role === 'owner';

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 bg-card border-b border-border flex items-center px-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-3 text-lg font-semibold font-display">Profile</h1>
      </header>

      {/* Profile Info Card */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{displayName}</h2>
            <p className="text-sm font-medium text-gray-500">{displayPhone}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold uppercase">
              {displayRole}
            </span>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <nav className="flex-1 p-4 space-y-2">

        {isOwner ? (
          /* Owner Features */
          <>
            <button
              onClick={() => navigate('/owner/venue')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 active:bg-muted transition-colors min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="block font-medium">Linked Venues</span>
                  <span className="text-xs text-gray-500">View & Edit Venue Details</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </button>

            <button
              onClick={() => navigate('/owner/venue')} // Reusing venue edit for profile edit as requested context implies venue info
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 active:bg-muted transition-colors min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Edit className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <span className="block font-medium">Edit Profile</span>
                  <span className="text-xs text-gray-500">Update Venue Information</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </button>
          </>
        ) : (
          /* Customer Features */
          <>
            <button
              onClick={() => navigate('/bookings')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 active:bg-muted transition-colors min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <span className="block font-medium">My Bookings</span>
                  <span className="text-xs text-gray-500">View Booking History</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </button>

            <button
              onClick={() => toast({ title: 'Coming soon', description: 'Saved venues feature coming soon' })}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 active:bg-muted transition-colors min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 text-warning" />
                </div>
                <span className="font-medium text-left">Saved Venues</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </button>
          </>
        )}

        {/* Support - Common */}
        <button
          onClick={() => toast({ title: 'Support', description: 'Email us at support@venuevibe.com' })}
          className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 active:bg-muted transition-colors min-h-[52px]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <Headphones className="h-5 w-5 text-success" />
            </div>
            <span className="font-medium text-left">Support</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </button>

        {/* Site Feedback Section - CUSTOMER ONLY */}
        {!isOwner && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-gray-900 font-display">App Feedback</h3>
            </div>
            <SiteReviewForm userId={user?.id || demoUser?.id?.toString() || ''} />
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full h-12 text-destructive border-destructive/30 hover:bg-destructive/5 font-semibold"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {!isOwner && <HomeBottomNav currentTab="profile" onTabChange={(tab) => {
        if (tab === 'profile') return;
        if (tab === 'find-player') navigate('/find-player');
        else if (tab === 'my-games') navigate('/bookings');
        else navigate('/');
      }} />}

      {isOwner && <OwnerNavigation />}
    </div>
  );
};

export default Profile;