import { useNavigate, useLocation } from 'react-router-dom';

export default function OwnerNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: '📊', label: 'Overview', path: '/owner' },
    { icon: '🏟️', label: 'Venues', path: '/owner/venues' },
    { icon: '📅', label: 'Bookings', path: '/owner/bookings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around gap-1 px-2 bg-sidebar-background border-sidebar-border">
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all ${
              isActive 
                ? 'bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary' 
                : 'text-sidebar-foreground'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium text-center line-clamp-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}