import { ReactNode } from 'react';

interface OwnerThemeProps {
  children: ReactNode;
}

export default function OwnerTheme({ children }: OwnerThemeProps) {
  return (
    <div 
      className="min-h-screen"
      style={{
        // Owner Theme Colors - Applied via CSS Custom Properties
        '--background': '210 100% 95%', // #E3F2FD - Soft Blue Background
        '--foreground': '210 40% 20%', // #263238 - Text Primary
        '--card': '0 0% 100%', // #FFFFFF - White Cards
        '--card-foreground': '210 40% 20%', // #263238
        '--popover': '0 0% 100%',
        '--popover-foreground': '210 40% 20%',
        '--primary': '207 85% 52%', // #1E88E5 - Primary Blue
        '--primary-foreground': '0 0% 100%',
        '--secondary': '210 30% 55%',
        '--secondary-foreground': '0 0% 100%',
        '--muted': '210 25% 94%',
        '--muted-foreground': '210 30% 45%',
        '--accent': '210 40% 90%',
        '--accent-foreground': '207 85% 52%',
        '--success': '122 39% 49%', // #2E7D32 - Success Green
        '--success-foreground': '0 0% 100%',
        '--warning': '36 100% 50%', // #FB8C00 - Warning Orange
        '--warning-foreground': '0 0% 100%',
        '--destructive': '4 90% 58%', // #D32F2F - Error Red
        '--destructive-foreground': '0 0% 100%',
        '--border': '0 0% 88%', // #E0E0E0 - Border
        '--input': '0 0% 88%',
        '--ring': '207 85% 52%',
        '--sidebar-background': '210 85% 11%', // #0D1B2A - Dark Navy Sidebar
        '--sidebar-foreground': '0 0% 100%', // White text
        '--sidebar-primary': '207 85% 52%', // #1E88E5
        '--sidebar-primary-foreground': '0 0% 100%',
        '--sidebar-accent': '210 60% 20%',
        '--sidebar-accent-foreground': '0 0% 95%',
        '--sidebar-border': '0 0% 88%',
        '--sidebar-ring': '207 85% 52%'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}