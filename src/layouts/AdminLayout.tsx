import { ReactNode, useState } from 'react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { colors } = useAdminTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.bg.primary }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300' : 'relative'} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <header 
          className="h-16 border-b flex items-center px-4 lg:px-6" 
          style={{ backgroundColor: colors.bg.primary, borderColor: colors.accent.border }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-3 rounded-lg hover:bg-black/5 transition-colors"
              style={{ color: colors.text.primary }}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg lg:text-xl font-bold truncate" style={{ color: colors.text.primary }}>{title}</h1>
            {subtitle && <p className="text-xs lg:text-sm truncate" style={{ color: colors.text.secondary }}>{subtitle}</p>}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}