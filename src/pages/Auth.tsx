import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Building2, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type DemoRole = 'customer' | 'owner' | 'admin';

const DEMO_CREDENTIALS: Record<DemoRole, { email: string; password: string; label: string; icon: React.ElementType; route: string }> = {
  customer: { email: 'customer@demo.com', password: 'demo123', label: 'Customer Demo', icon: User, route: '/' },
  owner: { email: 'owner@demo.com', password: 'demo123', label: 'Owner Demo', icon: Building2, route: '/owner' },
  admin: { email: 'admin@demo.com', password: 'demo123', label: 'Admin Demo', icon: Shield, route: '/admin' },
};

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, demoLogin, signIn } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Try demo login first
    const demoResult = demoLogin(email, password);
    if (demoResult.success) {
      toast({ title: 'Welcome!', description: 'Logged in successfully' });
      navigate(demoResult.route || '/');
      return;
    }

    // Try real auth
    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'Email or password is incorrect' : authError.message);
    } else {
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  const handleDemoLogin = (role: DemoRole) => {
    const creds = DEMO_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
    
    const result = demoLogin(creds.email, creds.password);
    if (result.success) {
      toast({ title: 'Welcome!', description: `Logged in as ${creds.label}` });
      navigate(creds.route);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-3 text-lg font-semibold font-display">Sign In</h1>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary mb-4">
            <span className="text-2xl font-bold text-primary-foreground">S</span>
          </div>
          <h2 className="text-2xl font-bold font-display">Welcome Back</h2>
          <p className="text-muted-foreground mt-1">Sign in to continue booking</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-11 btn-premium" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">Demo Access</span>
          </div>
        </div>

        {/* Demo Login Buttons */}
        <div className="space-y-2">
          {(Object.keys(DEMO_CREDENTIALS) as DemoRole[]).map((role) => {
            const creds = DEMO_CREDENTIALS[role];
            const Icon = creds.icon;
            return (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                disabled={isSubmitting}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">{creds.label}</p>
                  <p className="text-xs text-muted-foreground">{creds.email}</p>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">demo123</span>
              </button>
            );
          })}
        </div>

        {/* Info */}
        <p className="mt-6 text-xs text-center text-muted-foreground">
          Demo mode: Click any demo button above to explore
        </p>
      </div>
    </div>
  );
};

export default Auth;