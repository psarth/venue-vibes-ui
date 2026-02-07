import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import OwnerNavigation from '@/components/OwnerNavigation';

interface OwnerLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function OwnerLayout({ children, title, subtitle }: OwnerLayoutProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="theme-owner min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="sticky top-0 z-50 h-16 bg-card border-b border-border shadow-sm flex items-center justify-between px-6 transition-colors duration-200">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-muted/10 text-muted-foreground hover:text-destructive transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
        {children}
      </main>

      <OwnerNavigation />
    </div>
  );
}