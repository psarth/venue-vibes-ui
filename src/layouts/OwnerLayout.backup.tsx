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
    <div className="min-h-screen flex flex-col pb-24 bg-background">
      <header className="sticky top-0 z-50 h-16 border-b flex items-center px-4 justify-between bg-background border-border">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-primary">{subtitle}</p>}
        </div>
        <button 
          onClick={handleLogout} 
          className="p-2 hover:opacity-80 transition-opacity text-destructive" 
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <OwnerNavigation />
    </div>
  );
}