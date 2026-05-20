import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Hop as Home, Users, Calendar as CalendarIcon, MessageSquare, LogOut, Menu, X, Loader as Loader2, ShieldCheck, Crown } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

import Dashboard from './pages/Dashboard';
import Database from './pages/Database';
import Leads from './pages/Leads';
import CalendarPage from './pages/Calendar';
import Assistant from './pages/Assistant';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/PricingPage';

type Page = 'dashboard' | 'database' | 'leads' | 'calendar' | 'assistant';

const FREE_ACCESS_EMAIL = 'desmondtetteh155@gmail.com';

import Logo from './components/Logo';

export default function App() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);

  // Subscription state
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [subscription, setSubscription] = useState<{ plan_name: string; billing_status: string } | null>(null);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setAuthInProgress(false);
        if (!newSession) {
          setHasAccess(false);
          setSubscription(null);
          setCheckingAccess(false);
        }
        // After OAuth sign-in, ensure user record exists in users table
        if (event === 'SIGNED_IN' && newSession?.user) {
          (async () => {
            const authUser = newSession.user;
            const { data } = await supabase
              .from('users')
              .select('id')
              .eq('id', authUser.id)
              .maybeSingle();
            if (!data) {
              await supabase.from('users').insert({
                id: authUser.id,
                full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
                email: authUser.email || '',
                role: 'realtor',
              });
            }
          })();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (!currentSession) {
        setCheckingAccess(false);
      }
      setLoading(false);
      setAuthInProgress(false);
    });

    return () => authSub.unsubscribe();
  }, []);

  // Check subscription/access whenever user changes
  useEffect(() => {
    if (!user) return;

    const checkAccess = async () => {
      setCheckingAccess(true);
      const email = user.email?.toLowerCase() || '';

      // Free access for the specific email
      if (email === FREE_ACCESS_EMAIL) {
        // Ensure user record exists in users table
        await ensureUserRecord(user);
        // Ensure active subscription exists
        await ensureFreeSubscription(user.id);
        setHasAccess(true);
        setSubscription({ plan_name: 'annual', billing_status: 'active' });
        setCheckingAccess(false);
        return;
      }

      // Check subscription in database
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_name, billing_status')
        .eq('user_id', user.id)
        .eq('billing_status', 'active')
        .maybeSingle();

      if (sub) {
        setHasAccess(true);
        setSubscription(sub);
      } else {
        setHasAccess(false);
        setSubscription(null);
      }
      setCheckingAccess(false);
    };

    checkAccess();
  }, [user]);

  const ensureUserRecord = async (authUser: SupabaseUser) => {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!data) {
      await supabase.from('users').insert({
        id: authUser.id,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        role: 'realtor',
      });
    }
  };

  const ensureFreeSubscription = async (userId: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!data) {
      await supabase.from('subscriptions').insert({
        user_id: userId,
        plan_name: 'annual',
        billing_status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } else {
      await supabase
        .from('subscriptions')
        .update({ billing_status: 'active', plan_name: 'annual' })
        .eq('user_id', userId);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowPricing(false);
    setAuthInProgress(true);
  };

  const handlePaymentSuccess = async (planName: 'monthly' | 'annual') => {
    if (!user) return;

    // Create or update subscription record
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const periodEnd = planName === 'monthly'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    if (existing) {
      await supabase
        .from('subscriptions')
        .update({
          plan_name: planName,
          billing_status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
        })
        .eq('user_id', user.id);
    } else {
      await supabase.from('subscriptions').insert({
        user_id: user.id,
        plan_name: planName,
        billing_status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd,
      });
    }

    setHasAccess(true);
    setSubscription({ plan_name: planName, billing_status: 'active' });
    setShowPricing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setHasAccess(false);
    setSubscription(null);
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  // Loading screen
  if (loading || authInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  // Not authenticated - show landing page
  if (!user) {
    return (
      <>
        <LandingPage
          onLogin={() => {
            setAuthMode('signin');
            setShowAuth(true);
          }}
          onSignUp={() => {
            setAuthMode('signup');
            setShowAuth(true);
          }}
          onPricing={() => setShowPricing(true)}
        />

        <AnimatePresence>
          {showAuth && (
            <AuthPage
              onClose={() => setShowAuth(false)}
              onSuccess={handleAuthSuccess}
              initialMode={authMode}
            />
          )}
          {showPricing && (
            <PricingPage
              onBack={() => setShowPricing(false)}
              onSignUp={() => {
                setShowPricing(false);
                setAuthMode('signup');
                setShowAuth(true);
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Authenticated but checking access
  if (checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-sm text-[#888] uppercase tracking-widest font-bold">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Authenticated but no active subscription - show paywall
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/[0.03] blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 mx-auto mb-6">
                <Crown className="w-7 h-7 text-gold" />
              </div>

              <h2 className="text-xl font-sans text-white font-medium tracking-tight mb-2">Activate Your Protocol</h2>
              <p className="text-sm text-[#888] mb-8">
                Choose a plan to unlock full access to PropAI's operations platform.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPricing(true)}
                  className="luxury-button w-full py-3.5 text-xs shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                >
                  View Plans & Subscribe
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-xs text-[#666] hover:text-white border border-[#1A1A1A] rounded font-bold uppercase tracking-widest transition-all hover:border-[#333]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showPricing && (
              <PricingPage
                onBack={() => setShowPricing(false)}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Authenticated with active subscription - show main app
  const navItems = [
    { id: 'dashboard', label: 'Executive Hub', icon: LayoutDashboard },
    { id: 'database', label: 'Property Database', icon: Home },
    { id: 'leads', label: 'Priority Leads', icon: Users },
    { id: 'calendar', label: 'Concierge Schedule', icon: CalendarIcon },
    { id: 'assistant', label: 'Operations Assistant', icon: MessageSquare },
  ];

  const sidebarContent = (
    <>
      <div className="p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="w-5 h-5 shrink-0" />
          {isSidebarOpen && <span className="font-sans font-medium text-base text-white tracking-tight">PropAI</span>}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-[#777] hover:text-white hover:bg-[#1A1A1A] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className={`${!isSidebarOpen ? 'hidden' : ''} text-[8px] uppercase tracking-[0.3em] text-[#777] mb-3 px-2 font-black`}>Operations</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePageChange(item.id as Page)}
            className={`w-full flex items-center p-2.5 rounded-lg transition-all group ${
              currentPage === item.id
              ? 'bg-gold/10 text-gold border border-gold/20'
              : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
            title={!isSidebarOpen ? item.label : ''}
          >
            <item.icon className={`w-4 h-4 shrink-0 transition-transform ${isSidebarOpen ? 'mr-3' : 'mx-auto'} group-hover:scale-110 ${currentPage === item.id ? 'text-gold' : ''}`} />
            {isSidebarOpen && <span className="text-[11px] font-medium tracking-wide">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1A1A1A] bg-[#070707]">
        {isSidebarOpen && (
          <div className="bg-[#111111] p-3 rounded-xl border border-[#222] mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[8px] text-[#777] font-sans uppercase tracking-widest font-black">Plan</p>
              {user.email?.toLowerCase() === FREE_ACCESS_EMAIL && (
                <span className="text-[7px] text-gold font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-white capitalize">{subscription?.plan_name || 'Active'}</p>
            <div className="w-full bg-[#222] h-1 mt-2 rounded-full overflow-hidden">
              <div className="bg-gold h-full w-full shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
            <span className="text-[9px] font-bold text-gold">{(user.email || '?')[0].toUpperCase()}</span>
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-white truncate">{user.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2.5 rounded-lg text-[#777] hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className={`w-4 h-4 shrink-0 transition-transform ${isSidebarOpen ? 'mr-3' : 'mx-auto'} group-hover:rotate-12`} />
          {isSidebarOpen && <span className="text-[11px] font-medium tracking-wide">Exit Protocol</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0A0A0A] border-r border-[#1A1A1A] transition-all duration-300 flex-col h-screen`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-r border-[#1A1A1A] z-50 md:hidden flex flex-col h-screen"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#050505] min-w-0">
        <header className="sticky top-0 z-10 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1A1A1A] px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-sans font-black tracking-[0.2em] text-white uppercase">{currentPage.replace(/([A-Z])/g, ' $1').trim()}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2 text-[8px] uppercase tracking-[0.3em] text-gold font-black bg-gold/5 px-2.5 py-1 rounded-lg border border-gold/10">
                <span className="w-1 h-1 bg-gold rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">Active Core</span>
             </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {currentPage === 'dashboard' && <Dashboard user={user} />}
              {currentPage === 'database' && <Database user={user} />}
              {currentPage === 'leads' && <Leads user={user} />}
              {currentPage === 'calendar' && <CalendarPage user={user} token={session?.access_token ?? null} />}
              {currentPage === 'assistant' && <Assistant user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
