import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'user' | 'owner' | 'admin';

interface DemoUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  demoUser: DemoUser | null;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setDemoUser: (user: DemoUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUserState] = useState<DemoUser | null>(() => {
    // Restore demo user from localStorage
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
    // If demo user is set, use that role
    if (demoUser) {
      setUserRole(demoUser.role);
      setLoading(false);
      return;
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetch
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Then check for existing session
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

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        },
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
    // Clear demo user first
    setDemoUser(null);
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  // Combined user check - either real user or demo user
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
      setDemoUser 
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
