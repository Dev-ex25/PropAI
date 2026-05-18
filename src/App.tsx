import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Hop as Home, Users, Calendar as CalendarIcon, MessageSquare, CirclePlus as PlusCircle, LogOut, Menu, X, Loader as Loader2, Building2, FileText } from 'lucide-react';
import { auth, googleSignIn, logout, initAuth } from './lib/firebase';
import { User } from 'firebase/auth';

import Dashboard from './pages/Dashboard';
import Database from './pages/Database';
import Leads from './pages/Leads';
import CalendarPage from './pages/Calendar';
import Assistant from './pages/Assistant';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/PricingPage';

type Page = 'dashboard' | 'database' | 'leads' | 'calendar' | 'assistant';

import Logo from './components/Logo';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        setLoading(false);
        setShowAuth(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (u: User, t?: string) => {
    setUser(u);
    if (t) setToken(t);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
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
          error={loginError}
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
          className="md:hidden p-1.5 rounded-lg text-[#444] hover:text-white hover:bg-[#1A1A1A] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className={`${!isSidebarOpen ? 'hidden' : ''} text-[8px] uppercase tracking-[0.3em] text-[#444] mb-3 px-2 font-black`}>Operations</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePageChange(item.id as Page)}
            className={`w-full flex items-center p-2.5 rounded-lg transition-all group ${
              currentPage === item.id
              ? 'bg-gold/10 text-gold border border-gold/20'
              : 'text-[#666] hover:text-white hover:bg-[#111]'
            }`}
            title={!isSidebarOpen ? item.label : ''}
          >
            <item.icon className={`w-4 h-4 shrink-0 transition-transform ${isSidebarOpen ? 'mr-3' : 'mx-auto'} group-hover:scale-110 ${currentPage === item.id ? 'text-gold' : ''}`} />
            {isSidebarOpen && <span className="text-[11px] font-medium tracking-wide">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1A1A1A] bg-[#070707]">
        <div className={`${!isSidebarOpen ? 'hidden' : ''} bg-[#111111] p-3 rounded-xl border border-[#222] mb-4`}>
          <p className="text-[8px] text-[#444] mb-1 font-sans uppercase tracking-widest font-black">Efficiency</p>
          <p className="text-lg font-light text-white">88%</p>
          <div className="w-full bg-[#222] h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-gold h-full w-[88%] shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 px-1">
          <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full border border-[#333]" />
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-white truncate">{user.displayName}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2.5 rounded-lg text-[#444] hover:text-red-500 hover:bg-red-500/5 transition-all group"
          title={!isSidebarOpen ? "Logout" : ''}
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
              className="md:hidden p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1A1A1A] transition-all"
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
              {currentPage === 'calendar' && <CalendarPage user={user} token={token} />}
              {currentPage === 'assistant' && <Assistant user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
