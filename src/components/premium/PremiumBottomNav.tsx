import { Home, Calendar, User, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const PremiumBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, demoUser } = useAuth();

  const isLoggedIn = !!user || !!demoUser;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: Calendar,
      label: 'Bookings',
      path: '/bookings',
      active: location.pathname === '/bookings',
      requireAuth: true
    },
    {
      icon: Users,
      label: 'Find Player',
      path: '/find-player',
      active: location.pathname === '/find-player',
      requireAuth: true
    },
    {
      icon: User,
      label: 'Profile',
      path: isLoggedIn ? '/profile' : '/auth',
      active: location.pathname === '/profile' || location.pathname === '/auth'
    }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requireAuth && !isLoggedIn) {
      navigate('/auth');
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-lg border-t-2 border-border shadow-2xl">
      <div className="flex items-center justify-around h-18 px-4 max-w-md mx-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[70px] ${isActive
                  ? 'bg-primary/15 text-primary shadow-sm scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95'
                }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};