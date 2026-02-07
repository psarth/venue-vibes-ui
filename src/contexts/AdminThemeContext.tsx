import { createContext, useContext, ReactNode } from 'react';

interface AdminThemeColors {
  bg: {
    primary: string;
    surface: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  accent: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    border: string;
  };
}

interface AdminThemeContextType {
  colors: AdminThemeColors;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const adminTheme: AdminThemeColors = {
  bg: {
    primary: '#0B0F1A',
    surface: '#121829',
    secondary: '#1A1F35',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
  },
  accent: {
    primary: '#60A5FA',
    secondary: '#A78BFA',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    border: 'rgba(255,255,255,0.08)',
  },
};

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AdminThemeContext.Provider value={{ colors: adminTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
};
