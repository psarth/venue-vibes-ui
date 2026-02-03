import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, Lock, User, Building2, Shield, Eye, EyeOff, Phone, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'signup' | 'demo';
type UserRole = 'user' | 'owner' | 'admin';
type DemoLoginType = 'customer' | 'owner' | 'admin';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

// Demo credentials configuration
const DEMO_CREDENTIALS = {
  customer: { mobile: '9999999991', otp: '123456', email: 'customer@demo.sportspot.in', password: 'demo123', role: 'user' as UserRole },
  owner: { mobile: '9999999992', otp: '123456', email: 'owner@demo.sportspot.in', password: 'demo123', role: 'owner' as UserRole },
  admin: { email: 'admin@demo.com', password: 'admin123', role: 'admin' as UserRole },
};

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('demo');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoLoginType, setDemoLoginType] = useState<DemoLoginType | null>(null);
  const [demoMobile, setDemoMobile] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signUp, user, loading, setDemoUser } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleDemoLogin = async (type: DemoLoginType) => {
    setDemoLoginType(type);
    
    if (type === 'admin') {
      // Admin uses email/password
      setValue('email', DEMO_CREDENTIALS.admin.email);
      setValue('password', DEMO_CREDENTIALS.admin.password);
      setMode('login');
    } else {
      // Customer/Owner use mobile OTP
      const creds = type === 'customer' ? DEMO_CREDENTIALS.customer : DEMO_CREDENTIALS.owner;
      setDemoMobile(creds.mobile);
      setShowOtpInput(false);
    }
  };

  const handleSendOtp = () => {
    setShowOtpInput(true);
    const creds = demoLoginType === 'customer' ? DEMO_CREDENTIALS.customer : DEMO_CREDENTIALS.owner;
    setDemoOtp(creds.otp);
    toast({
      title: 'OTP Sent!',
      description: `Demo OTP: ${creds.otp} (auto-filled for testing)`,
    });
  };

  const handleVerifyOtp = async () => {
    if (!demoLoginType) return;
    
    const creds = demoLoginType === 'customer' ? DEMO_CREDENTIALS.customer : DEMO_CREDENTIALS.owner;
    
    if (demoOtp === creds.otp) {
      setIsSubmitting(true);
      
      // Set demo user in context
      setDemoUser({
        id: `demo-${demoLoginType}`,
        email: creds.email,
        role: creds.role,
        name: demoLoginType === 'customer' ? 'Demo Customer' : 'Demo Owner',
      });
      
      toast({
        title: 'Welcome!',
        description: `Logged in as Demo ${demoLoginType === 'customer' ? 'Customer' : 'Owner'}`,
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 500);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP',
      });
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if this is a demo admin login
      if (data.email === DEMO_CREDENTIALS.admin.email && data.password === DEMO_CREDENTIALS.admin.password) {
        setDemoUser({
          id: 'demo-admin',
          email: DEMO_CREDENTIALS.admin.email,
          role: 'admin',
          name: 'Demo Admin',
        });
        
        toast({
          title: 'Welcome Admin!',
          description: 'Logged in with demo admin credentials',
        });
        
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/admin');
        }, 500);
        return;
      }

      if (mode === 'login') {
        const { error } = await signIn(data.email, data.password);
        
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Login failed',
            description: error.message === 'Invalid login credentials' 
              ? 'Email or password is incorrect' 
              : error.message,
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          });
          navigate('/');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(
          data.email, 
          data.password, 
          data.fullName || '', 
          selectedRole
        );
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: 'destructive',
              title: 'Account exists',
              description: 'This email is already registered. Please login instead.',
            });
            setMode('login');
          } else {
            toast({
              variant: 'destructive',
              title: 'Signup failed',
              description: error.message,
            });
          }
        } else {
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
        }
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'user' as UserRole, label: 'Customer', icon: User, description: 'Book venues & play sports' },
    { value: 'owner' as UserRole, label: 'Venue Owner', icon: Building2, description: 'Manage your venues' },
    { value: 'admin' as UserRole, label: 'Admin', icon: Shield, description: 'Platform management' },
  ];

  const demoOptions = [
    { type: 'customer' as DemoLoginType, label: 'Customer', sublabel: 'Browse & Book', icon: User, color: 'bg-primary/10 text-primary border-primary/20' },
    { type: 'owner' as DemoLoginType, label: 'Venue Owner', sublabel: 'Manage Venues', icon: Building2, color: 'bg-success/10 text-success border-success/20' },
    { type: 'admin' as DemoLoginType, label: 'Admin', sublabel: 'Platform Control', icon: Shield, color: 'bg-secondary/10 text-secondary border-secondary/20' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-pattern flex items-center justify-center">
        <div className="animate-pulse-soft text-primary">Loading...</div>
      </div>
    );
  }

  // Demo OTP Login Flow
  if (demoLoginType && demoLoginType !== 'admin') {
    return (
      <div className="min-h-screen bg-background bg-pattern flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-4 p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl"
            onClick={() => {
              setDemoLoginType(null);
              setShowOtpInput(false);
              setDemoMobile('');
              setDemoOtp('');
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">
            Demo {demoLoginType === 'customer' ? 'Customer' : 'Owner'} Login
          </h1>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="card-premium p-8 animate-scale-in">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shadow-premium-lg ${
                  demoLoginType === 'customer' ? 'bg-primary/10' : 'bg-success/10'
                }`}>
                  <Smartphone className={`h-10 w-10 ${
                    demoLoginType === 'customer' ? 'text-primary' : 'text-success'
                  }`} />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                  {showOtpInput ? 'Verify OTP' : 'Enter Mobile Number'}
                </h2>
                <p className="text-muted-foreground">
                  {showOtpInput 
                    ? 'Enter the 6-digit OTP sent to your mobile' 
                    : 'We\'ll send you a verification code'}
                </p>
              </div>

              {!showOtpInput ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Mobile Number</Label>
                    <div className="relative mt-1.5">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <Input
                        type="tel"
                        value={demoMobile}
                        onChange={(e) => setDemoMobile(e.target.value)}
                        placeholder="9999999991"
                        className="input-premium pl-14 text-lg tracking-wider"
                        maxLength={10}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Demo Mobile: {demoLoginType === 'customer' ? '9999999991' : '9999999992'}
                    </p>
                  </div>

                  <Button 
                    className="w-full h-12 btn-premium rounded-xl text-base font-semibold"
                    onClick={handleSendOtp}
                    disabled={demoMobile.length !== 10}
                  >
                    Send OTP
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Enter OTP</Label>
                    <Input
                      type="text"
                      value={demoOtp}
                      onChange={(e) => setDemoOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="input-premium text-center text-2xl tracking-[0.5em] font-mono mt-1.5"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Demo OTP: 123456 (auto-filled)
                    </p>
                  </div>

                  <Button 
                    className="w-full h-12 btn-premium rounded-xl text-base font-semibold"
                    onClick={handleVerifyOtp}
                    disabled={demoOtp.length !== 6 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse-soft">Verifying...</span>
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>

                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Change mobile number
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-11 w-11 rounded-xl"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">
          {mode === 'demo' ? 'Quick Access' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Premium Card */}
          <div className="card-premium p-8 animate-scale-in">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-premium-lg">
                <span className="text-2xl font-bold text-primary-foreground font-display">SP</span>
              </div>
            </div>

            {mode === 'demo' && (
              <>
                {/* Demo Access Title */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                    Quick Demo Access
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Explore the platform instantly as any user type
                  </p>
                </div>

                {/* Demo Login Buttons */}
                <div className="space-y-3 mb-6">
                  {demoOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleDemoLogin(option.type)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 hover:shadow-premium-md ${option.color}`}
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        option.type === 'customer' ? 'bg-primary/10' : 
                        option.type === 'owner' ? 'bg-success/10' : 'bg-secondary/10'
                      }`}>
                        <option.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">Login as {option.label}</p>
                        <p className="text-sm opacity-70">{option.sublabel}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/50">
                        Demo
                      </span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">or use real account</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Real Account Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="h-12 rounded-xl font-medium"
                    onClick={() => setMode('login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-12 rounded-xl font-medium"
                    onClick={() => setMode('signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <>
                {/* Title */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                    {mode === 'login' ? 'Sign In' : 'Join SportSpot'}
                  </h2>
                  <p className="text-muted-foreground">
                    {mode === 'login' 
                      ? 'Enter your credentials to continue' 
                      : 'Create your account to get started'}
                  </p>
                </div>

                {/* Role Selection (Signup only) */}
                {mode === 'signup' && (
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-3 block">I am a</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {roleOptions.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                            selectedRole === role.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <role.icon className={`h-5 w-5 mx-auto mb-1 ${
                            selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <span className="text-xs font-medium block">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          {...register('fullName')}
                          placeholder="John Doe"
                          className="input-premium pl-11"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="input-premium pl-11"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="••••••••"
                        className="input-premium pl-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 btn-premium rounded-xl text-base font-semibold mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse-soft">Please wait...</span>
                    ) : (
                      mode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Social Logins */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-2 font-medium"
                    type="button"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-2 font-medium"
                    type="button"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                  </Button>
                </div>

                {/* Toggle Mode */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      reset();
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                {/* Back to Demo */}
                <button
                  type="button"
                  onClick={() => setMode('demo')}
                  className="w-full text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
                >
                  ← Back to Quick Demo Access
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
