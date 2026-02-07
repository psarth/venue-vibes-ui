import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Building2, Calendar, TrendingUp, Users2, LogOut, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { colors } = useAdminTheme();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Building2, label: 'Venues', path: '/admin/venues' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { icon: TrendingUp, label: 'Revenue', path: '/admin/revenue' },
    { icon: Users2, label: 'Customers', path: '/admin/customers' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside 
      className={`${isMobile ? 'w-72' : 'w-64'} h-screen border-r flex flex-col`}
      style={{ 
        backgroundColor: colors.bg.surface,
        borderColor: colors.accent.border 
      }}
    >
      <div className="p-4 lg:p-6 border-b" style={{ borderColor: colors.accent.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: colors.text.primary }}>
                VenueVibes
              </h2>
              <p className="text-xs" style={{ color: colors.text.secondary }}>
                Admin Control
              </p>
            </div>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
              style={{ color: colors.text.secondary }}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 lg:p-4">
        <ul className="space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg transition-all text-left hover:bg-opacity-80 touch-manipulation"
                  style={{
                    backgroundColor: isActive ? 'rgba(96, 165, 250, 0.12)' : 'transparent',
                    color: isActive ? colors.accent.primary : colors.text.secondary,
                    borderLeft: isActive ? `3px solid ${colors.accent.primary}` : '3px solid transparent',
                  }}
                >
                  <Icon className="h-5 w-5 lg:h-4 lg:w-4" />
                  <span className="font-medium text-sm lg:text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 lg:p-4 border-t" style={{ borderColor: colors.accent.border }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg transition-all text-left hover:bg-red-500/10 touch-manipulation"
          style={{ color: colors.accent.error }}
        >
          <LogOut className="h-5 w-5 lg:h-4 lg:w-4" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}