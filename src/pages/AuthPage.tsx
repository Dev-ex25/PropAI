import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ArrowRight, Loader as Loader2, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onClose: () => void;
  onSuccess: () => void;
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
  const [showPassword, setShowPassword] = useState(false);

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
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `${firstName} ${lastName}`,
            },
          },
        });
        if (signUpError) throw signUpError;

        // Create user record in users table
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          await supabase.from('users').upsert({
            id: authUser.id,
            full_name: `${firstName} ${lastName}`,
            email: authUser.email || email,
            role: 'realtor',
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      onSuccess();
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed';
      // Clean up common Supabase error messages
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (msg.includes('User already registered')) {
        setError('This email is already registered. Try signing in instead.');
      } else if (msg.includes('Password should be')) {
        setError('Password must be at least 6 characters');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto selection:bg-gold/30"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gold/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gold/[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-xl text-[#777] hover:text-white hover:bg-[#1A1A1A] transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.45, 0.32, 0.9] }}
          className="w-full max-w-[420px] relative"
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 mb-5"
            >
              <Logo className="w-7 h-7" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-sans text-white font-medium tracking-tight text-center">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-[#888] text-sm mt-2 text-center">
              {mode === 'signin'
                ? 'Sign in to access your PropAI dashboard'
                : 'Get started with PropAI in seconds'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#0A0A0A]/95 backdrop-blur-2xl border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/[0.03] blur-[60px] rounded-full pointer-events-none" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="name-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#888] px-0.5">First name</label>
                      <input
                        type="text"
                        required
                        placeholder="First"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:border-gold/40 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#888] px-0.5">Last name</label>
                      <input
                        type="text"
                        required
                        placeholder="Last"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:border-gold/40 outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[#888] px-0.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-[#555] focus:border-gold/40 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[#888] px-0.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-[#555] focus:border-gold/40 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#666] hover:text-[#888] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="luxury-button w-full py-3.5 text-xs mt-2 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(197,160,89,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Toggle */}
            <div className="mt-6 pt-5 border-t border-[#1A1A1A] text-center">
              <p className="text-sm text-[#888]">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError(null);
                  }}
                  className="text-gold hover:text-gold-muted font-medium ml-1.5 transition-colors"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-[10px] text-[#666] text-center mt-6">
            By continuing, you agree to PropAI's Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
