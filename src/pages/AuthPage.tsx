import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { emailSignIn, emailSignUp, googleSignIn } from '../lib/firebase';

interface AuthPageProps {
  onClose: () => void;
  onSuccess: (user: any, token?: string) => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthPage({ onClose, onSuccess, initialMode = 'signin' }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const user = await emailSignUp(email, password, `${firstName} ${lastName}`);
        onSuccess(user);
      } else {
        const user = await emailSignIn(email, password);
        onSuccess(user);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) onSuccess(res.user, res.accessToken);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden selection:bg-gold/30"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-4 border-b border-[#1A1A1A]/50 bg-gradient-to-b from-[#050505] to-transparent">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="text-base font-sans font-medium tracking-tight text-white">PropAI</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-[#333] hover:text-white hover:bg-[#1A1A1A] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="h-screen w-full flex items-center justify-center p-4 sm:p-6 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[320px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xs font-sans text-white font-medium tracking-tight text-center">
              {mode === 'signin' ? 'Sign in to PropAI' : 'Create Account'}
            </h2>
            <p className="text-[#444] text-[6px] uppercase tracking-[0.2em] font-bold mt-1">Autonomous growth starts here</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-2 mb-0.5"
                >
                  <div className="space-y-0.5">
                    <label className="text-[6px] uppercase tracking-widest font-black text-[#444] px-1">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="First"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-md px-2 py-1.5 text-[9px] text-white focus:border-gold/30 outline-none transition-all placeholder:text-[#222]"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[6px] uppercase tracking-widest font-black text-[#444] px-1">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-md px-2 py-1.5 text-[9px] text-white focus:border-gold/30 outline-none transition-all placeholder:text-[#222]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              <label className="text-[6px] uppercase tracking-widest font-black text-[#444] px-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 text-[#333]" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-md pl-7 pr-2 py-1.5 text-[9px] text-white focus:border-gold/30 outline-none transition-all placeholder:text-[#222]"
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="text-[6px] uppercase tracking-widest font-black text-[#444] px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 text-[#333]" />
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-md pl-7 pr-2 py-1.5 text-[9px] text-white focus:border-gold/30 outline-none transition-all placeholder:text-[#222]"
                />
              </div>
            </div>

            {error && (
              <p className="text-[6px] text-red-500 font-bold uppercase tracking-widest text-center py-0.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="luxury-button w-full py-2.5 text-[7px] mt-2 flex items-center justify-center gap-1.5 group shadow-[0_0_10px_rgba(197,160,89,0.1)]"
            >
              {loading ? <Loader2 className="w-2 h-2 animate-spin" /> : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-2 h-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 w-full">
              <div className="h-px bg-[#1A1A1A] flex-1" />
              <span className="text-[6px] text-[#222] uppercase font-black tracking-widest">or</span>
              <div className="h-px bg-[#1A1A1A] flex-1" />
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md font-bold text-[7px] uppercase tracking-widest hover:bg-[#F0F0F0] transition-all"
            >
              <svg className="w-2 h-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
              </svg>
              Continue with Google
            </button>

            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-[7px] uppercase font-black tracking-widest text-[#444] hover:text-gold transition-colors"
            >
              {mode === 'signin' ? "Need a protocol? Sign up" : "Registered? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
