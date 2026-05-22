import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2,
  LogOut,
  Building2,
  Cpu,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Compact and unified components
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/PricingPage';
import Logo from './components/Logo';
import { initAuth, logout } from './lib/firebaseAuth';

export default function App() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, tokenStr) => {
        setUser(currentUser);
        if (tokenStr) setToken(tokenStr);
        setLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setLoading(false);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAuthSuccess = (u: any, t?: string) => {
    setUser(u as MockUser);
    if (t) setToken(t);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <p className="text-[10px] uppercase tracking-widest text-[#52525b] font-mono">Initializing System</p>
        </div>
      </div>
    );
  }

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
          {showPricing && (
            <PricingPage 
              userEmail={null}
              onBack={() => setShowPricing(false)}
              onSignUp={() => {
                setShowPricing(false);
                setAuthMode('signup');
                setShowAuth(true);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAuth && (
            <AuthPage 
              onClose={() => setShowAuth(false)}
              onSuccess={handleAuthSuccess}
              initialMode={authMode}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#F5F5F5] flex flex-col font-sans antialiased overflow-hidden">
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  );
}
