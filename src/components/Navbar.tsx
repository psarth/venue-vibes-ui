import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border/40 shadow-premium-sm backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between h-16 px-4 animate-fade-in">
        {/* Menu Button - 44px touch target */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11 rounded-lg hover:bg-accent transition-smooth active:scale-95"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card border-r border-border/40 animate-slide-in-left">
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-bold gradient-text">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              <a 
                href="#" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-smooth hover:text-primary active:bg-primary/20"
              >
                Home
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-smooth hover:text-primary active:bg-primary/20"
              >
                My Bookings
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-smooth hover:text-primary active:bg-primary/20"
              >
                Favorites
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-smooth hover:text-primary active:bg-primary/20"
              >
                Help & Support
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo - Centered */}
        <div className="flex items-center gap-2 hover-scale-sm">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md hover:shadow-lg transition-smooth">
            <span className="text-primary-foreground font-bold text-sm">SP</span>
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight gradient-text">SportSpot</span>
        </div>

        {/* Profile Button - 44px touch target */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-11 w-11 rounded-lg hover:bg-accent transition-smooth active:scale-95"
        >
          <User className="h-5 w-5 text-foreground" />
        </Button>
      </div>
    </header>
  );
};