import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export const PremiumNavbar = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-premium-md">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-muted transition-colors">
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-card border-r-0 shadow-premium-xl">
            <SheetHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-premium-md">
                  <span className="text-lg font-bold text-primary-foreground font-display">SP</span>
                </div>
                <div>
                  <SheetTitle className="text-left text-lg font-bold font-display">SportSpot</SheetTitle>
                  <p className="text-sm text-muted-foreground">Find & Book Venues</p>
                </div>
              </div>
            </SheetHeader>
            
            <nav className="mt-6 space-y-1">
              <a 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
              >
                Home
              </a>
              
              {user ? (
                <>
                  <a 
                    onClick={() => navigate('/bookings')}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
                  >
                    My Bookings
                  </a>
                  <a 
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
                  >
                    Profile
                  </a>
                  
                  {userRole === 'owner' && (
                    <a 
                      onClick={() => navigate('/owner')}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted text-primary font-medium transition-colors cursor-pointer"
                    >
                      Owner Dashboard
                    </a>
                  )}
                  
                  {userRole === 'admin' && (
                    <a 
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted text-secondary font-medium transition-colors cursor-pointer"
                    >
                      Admin Dashboard
                    </a>
                  )}
                  
                  <div className="pt-4 border-t border-border mt-4">
                    <a 
                      onClick={async () => {
                        await signOut();
                        navigate('/');
                      }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-destructive/10 text-destructive font-medium transition-colors cursor-pointer"
                    >
                      Sign Out
                    </a>
                  </div>
                </>
              ) : (
                <a 
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-primary/10 text-primary font-medium transition-colors cursor-pointer"
                >
                  Sign In / Sign Up
                </a>
              )}
            </nav>
            
            <div className="absolute bottom-8 left-6 right-6">
              <a className="block px-4 py-3 rounded-xl hover:bg-muted text-sm text-muted-foreground font-medium transition-colors cursor-pointer">
                Help & Support
              </a>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-premium-md">
            <span className="text-primary-foreground font-bold text-sm font-display">SP</span>
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight font-display">SportSpot</span>
        </div>

        {/* Profile Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-11 w-11 rounded-xl hover:bg-muted transition-colors"
          onClick={handleProfileClick}
        >
          {user ? (
            <div className="h-8 w-8 rounded-lg bg-gradient-premium flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : (
            <User className="h-5 w-5 text-foreground" />
          )}
        </Button>
      </div>
    </header>
  );
};