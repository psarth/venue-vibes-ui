import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'user' | 'owner' | 'admin';

export interface DemoUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

// Demo credentials
const DEMO_USERS: Record<string, { password: string; user: DemoUser }> = {
  'customer@demo.com': {
    password: 'demo123',
    user: { id: 'demo-customer-001', email: 'customer@demo.com', role: 'user', name: 'Demo Customer' },
  },
  'owner@demo.com': {
    password: 'demo123',
    user: { id: 'demo-owner-001', email: 'owner@demo.com', role: 'owner', name: 'Demo Owner' },
  },
  'admin@demo.com': {
    password: 'demo123',
    user: { id: 'demo-admin-001', email: 'admin@demo.com', role: 'admin', name: 'Demo Admin' },
  },
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  demoUser: DemoUser | null;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  demoLogin: (email: string, password: string) => { success: boolean; error?: string; route?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUserState] = useState<DemoUser | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('demoUser');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        setUserRole(data.role as UserRole);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  useEffect(() => {
    if (demoUser) {
      setUserRole(demoUser.role);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [demoUser]);

  const setDemoUser = (user: DemoUser | null) => {
    setDemoUserState(user);
    if (user) {
      localStorage.setItem('demoUser', JSON.stringify(user));
      setUserRole(user.role);
    } else {
      localStorage.removeItem('demoUser');
      setUserRole(null);
    }
  };

  const demoLogin = (email: string, password: string): { success: boolean; error?: string; route?: string } => {
    const normalizedEmail = email.toLowerCase().trim();
    const demoAccount = DEMO_USERS[normalizedEmail];

    if (!demoAccount) {
      return { success: false, error: 'Invalid email address' };
    }

    if (demoAccount.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    setDemoUser(demoAccount.user);
    
    // Determine route
    const route = demoAccount.user.role === 'admin' ? '/admin' : 
                  demoAccount.user.role === 'owner' ? '/owner' : '/';
    
    return { success: true, route };
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName, role: role },
      },
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    setDemoUser(null);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  const effectiveUser = demoUser 
    ? { id: demoUser.id, email: demoUser.email } as User 
    : user;

  return (
    <AuthContext.Provider value={{ 
      user: effectiveUser, 
      session, 
      userRole, 
      loading, 
      demoUser,
      signUp, 
      signIn, 
      signOut,
      demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};