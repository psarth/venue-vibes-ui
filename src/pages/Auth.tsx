
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, User, Building2, Shield, Eye, EyeOff, Smartphone, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

type DemoRole = 'customer' | 'owner' | 'admin';

const DEMO_CREDENTIALS: Record<DemoRole, { email: string; password: string; label: string; icon: React.ElementType; route: string }> = {
  customer: { email: 'customer@demo.com', password: 'demo123', label: 'Customer Demo', icon: User, route: '/' },
  owner: { email: 'owner@demo.com', password: 'demo123', label: 'Owner Demo', icon: Building2, route: '/owner' },
  admin: { email: 'admin@demo.com', password: 'demo123', label: 'Admin Demo', icon: Shield, route: '/admin' },
};

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, demoLogin, loginWithMobile, signupWithMobile, signIn } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSendOtp = () => {
    if (mobile.length < 10) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsSubmitting(false);
      toast({ title: 'OTP Sent! 📱', description: 'Use 123456 to verify.' });
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (authMethod === 'mobile') {
      const result = mode === 'signup'
        ? signupWithMobile(mobile, otp, role)
        : loginWithMobile(mobile, otp);

      if (result.success) {
        toast({
          title: mode === 'signup' ? 'Welcome to Venue Vibes! 🎉' : 'Welcome Back! 👋',
          description: mode === 'signup' ? `You're now registered as a ${role}.` : 'Ready to play?'
        });
        navigate(result.route || '/');
      } else {
        setError(result.error || 'Check your OTP and try again');
      }
    } else {
      const demoResult = demoLogin(email, password);
      if (demoResult.success) {
        toast({ title: 'Success!', description: 'Logged in to demo account.' });
        navigate(demoResult.route || '/');
      } else {
        const { error: authError } = await signIn(email, password);
        if (authError) setError(authError.message);
        else navigate('/');
      }
    }
    setIsSubmitting(false);
  };

  const handleQuickLogin = (role: DemoRole) => {
    const creds = DEMO_CREDENTIALS[role];
    const result = demoLogin(creds.email, creds.password);
    if (result.success) {
      toast({ title: 'Demo Access Granted', description: `Logged in as ${creds.label}` });
      navigate(result.route || '/');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-display overflow-hidden">
      {/* Left Section: Visual Content (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-primary/60" />
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000"
          alt="Sports Venue"
          className="absolute inset-0 w-full h-full object-cover scale-110 animate-pulse-slow"
        />

        <div className="relative z-20 w-full h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">VENUEVIBES</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-black leading-tight mb-6">Elevate Your Playing Experience.</h2>
            <p className="text-blue-100 text-lg font-medium opacity-90 leading-relaxed">
              Book the finest turfs, courts, and tables in your city with real-time availability and instant confirmation.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-blue-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-blue-100 italic">Trusted by 10,000+ Players</p>
          </div>
        </div>
      </div>

      {/* Right Section: Auth Form */}
      <div className="flex-1 flex flex-col relative bg-slate-50 md:bg-white">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 md:left-8 w-10 h-10 rounded-full bg-white md:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-blue-50 transition-all z-20 shadow-sm md:shadow-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 max-w-[600px] mx-auto w-full">
          {/* Form Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Your Next Game Starts Here</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              <button
                onClick={() => setMode('login')}
                className={cn(
                  "text-3xl md:text-4xl font-black tracking-tight",
                  mode === 'login' ? "text-gray-900" : "text-gray-300 hover:text-gray-400"
                )}
              >
                Login
              </button>
              <span className="text-3xl md:text-4xl text-gray-200">/</span>
              <button
                onClick={() => setMode('signup')}
                className={cn(
                  "text-3xl md:text-4xl font-black tracking-tight",
                  mode === 'signup' ? "text-gray-900" : "text-gray-300 hover:text-gray-400"
                )}
              >
                Sign Up
              </button>
            </div>
            <p className="text-gray-500 font-medium">
              {mode === 'login' ? 'Access your dashboard and bookings.' : 'Create your free account in seconds.'}
            </p>
          </div>

          {/* Role Selection Grid (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4 mb-8 animate-in slide-in-from-bottom-2 duration-300">
              <button
                onClick={() => setRole('customer')}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                  role === 'customer' ? "border-primary bg-primary/5 shadow-md shadow-blue-100" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role === 'customer' ? "bg-primary text-white" : "bg-white text-gray-400")}>
                  <User className="w-5 h-5" />
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-wider", role === 'customer' ? "text-primary" : "text-gray-500")}>Player</span>
              </button>

              <button
                onClick={() => setRole('owner')}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                  role === 'owner' ? "border-primary bg-primary/5 shadow-md shadow-blue-100" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role === 'owner' ? "bg-primary text-white" : "bg-white text-gray-400")}>
                  <Building2 className="w-5 h-5" />
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-wider", role === 'owner' ? "text-primary" : "text-gray-500")}>Venue Owner</span>
              </button>
            </div>
          )}

          {/* Form Container */}
          <div className="space-y-6">
            <div className="flex p-1 bg-gray-100/80 rounded-2xl mb-2">
              <button
                onClick={() => setAuthMethod('mobile')}
                className={cn("flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
                  authMethod === 'mobile' ? "bg-white text-primary shadow-sm" : "text-gray-500")}
              >
                Mobile
              </button>
              <button
                onClick={() => setAuthMethod('email')}
                className={cn("flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
                  authMethod === 'email' ? "bg-white text-primary shadow-sm" : "text-gray-500")}
              >
                Email
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {authMethod === 'mobile' ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-gray-200">
                        <span className="text-sm font-black text-gray-400">+91</span>
                      </div>
                      <Input
                        type="tel"
                        placeholder="00000 00000"
                        className="h-14 pl-16 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-base font-bold tracking-widest"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        disabled={otpSent}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Verification Code</Label>
                      <Input
                        type="text"
                        placeholder="• • • • • •"
                        className="h-14 text-center text-2xl font-black tracking-[0.5em] rounded-2xl bg-blue-50/50 border-blue-100 focus:bg-white focus:border-primary transition-all"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                      />
                      <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-bold text-primary hover:underline ml-1">Change mobile number?</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email ID</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-14 px-5 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</Label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="h-14 px-5 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all font-bold tracking-widest"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </div>
              )}

              <Button
                type={authMethod === 'mobile' && !otpSent ? 'button' : 'submit'}
                onClick={authMethod === 'mobile' && !otpSent ? handleSendOtp : undefined}
                className="w-full h-15 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-50 h-14"
                disabled={isSubmitting || (authMethod === 'mobile' && !otpSent && mobile.length < 10)}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  authMethod === 'mobile' ? (otpSent ? 'Verify OTP' : 'Get Magic Code') : 'Sign In'
                )}
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-300 bg-white px-4">Instant Access</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(DEMO_CREDENTIALS) as DemoRole[]).map((r) => {
                const creds = DEMO_CREDENTIALS[r];
                return (
                  <button
                    key={r}
                    onClick={() => handleQuickLogin(r)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-blue-50 hover:border-blue-100 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                      {r === 'customer' ? <User className="w-4 h-4" /> : r === 'owner' ? <Building2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">{r}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-gray-400 font-medium">
            By continuing, you agree to our <button className="text-gray-900 font-bold hover:underline underline-offset-4">Terms of Service</button> and <button className="text-gray-900 font-bold hover:underline underline-offset-4">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;