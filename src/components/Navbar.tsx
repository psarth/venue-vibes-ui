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
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu Button - 44px touch target */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-lg hover:bg-accent">
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card">
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-bold">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-foreground font-medium transition-colors">
                Home
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-foreground font-medium transition-colors">
                My Bookings
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-foreground font-medium transition-colors">
                Favorites
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-foreground font-medium transition-colors">
                Help & Support
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo - Centered */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">SP</span>
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight">SportSpot</span>
        </div>

        {/* Profile Button - 44px touch target */}
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-lg hover:bg-accent">
          <User className="h-5 w-5 text-foreground" />
        </Button>
      </div>
    </header>
  );
};