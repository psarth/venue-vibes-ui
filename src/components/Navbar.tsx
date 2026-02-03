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
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent text-foreground">
                Home
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent text-foreground">
                My Bookings
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent text-foreground">
                Favorites
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent text-foreground">
                Help & Support
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SP</span>
          </div>
          <span className="font-bold text-lg text-foreground">SportSpot</span>
        </div>

        {/* Profile Button */}
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <User className="h-5 w-5 text-foreground" />
        </Button>
      </div>
    </header>
  );
};
