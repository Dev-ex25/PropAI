import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, X, Mail, Loader2, ShieldCheck, Zap } from 'lucide-react';
import Logo from '../components/Logo';
import { usePaystackPayment } from 'react-paystack';

interface PricingPageProps {
  onBack: () => void;
  onSignUp: () => void;
  userEmail?: string | null;
}

export default function PricingPage({ onBack, onSignUp, userEmail }: PricingPageProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';

  const plans = [
    {
      id: 'monthly',
      name: "Monthly Access",
      price: 49.99,
      period: "/mo",
      description: "Core automation for high-speed operations.",
      features: [
        "AI Inbox & Fast Response",
        "Automated Lead Follow-Ups",
        "Smart Scheduling & Booking",
        "Real-Time Analytics Dashboard",
        "Reduced Manual Workload"
      ],
      highlight: false
    },
    {
      id: 'annual',
      name: "Annual Protocol",
      price: 500.00,
      period: "/yr",
      description: "Scale your portfolio with maximum efficiency.",
      features: [
        "Centralized Property Database",
        "AI Realtor Assistant Chat",
        "Multi-Workflow Integration",
        "Scalable Operations Protocol",
        "Priority Access & Alpha Features"
      ],
      highlight: true,
      savings: "Save 16.6% Annually"
    }
  ];

  const handlePaystackSuccess = (reference: any) => {
    console.log('Payment successful. Reference:', reference);
    setIsProcessing(false);
    setSelectedPlan(null);
    // In a real app, you'd verify this reference on your server and update the user's subscription
    alert('Payment successful! Your protocol has been activated.');
    onSignUp(); // Redirect to sign up/dashboard after success
  };

  const handlePaystackClose = () => {
    console.log('Payment window closed');
    setIsProcessing(false);
  };

  const initializePayment = usePaystackPayment({
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: selectedPlan ? Math.round(selectedPlan.price * 100) : 0, // In cents/pesewas
    publicKey: publicKey,
    currency: 'USD', // You can change this to 'GHS' if needed
  });

  const handlePlanSelection = (plan: any) => {
    setSelectedPlan(plan);
    if (!email) {
      setShowEmailInput(true);
    } else {
      setIsProcessing(true);
      initializePayment(handlePaystackSuccess, handlePaystackClose);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowEmailInput(false);
      setIsProcessing(true);
      initializePayment(handlePaystackSuccess, handlePaystackClose);
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 px-6 py-4 border-b border-[#1A1A1A] bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="text-base font-sans font-medium tracking-tight text-white">PropAI</span>
          </div>
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full text-[#333] hover:text-white hover:bg-[#1A1A1A] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-4xl font-sans text-white mb-3 tracking-tight font-medium"
          >
            Invest in <span className="text-gold">Momentum.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#444] uppercase tracking-[0.3em] font-bold text-[8px]"
          >
            Choose your protocol for autonomous growth.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative group rounded-[1.5rem] p-6 border transition-all duration-500 overflow-hidden ${
                plan.highlight 
                  ? 'bg-[#0A0A0A] border-gold/20 shadow-[0_0_30px_rgba(197,160,89,0.05)]' 
                  : 'bg-[#080808] border-[#1A1A1A] hover:border-gold/10'
              }`}
            >
              {/* Inner Glow Interaction */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {plan.highlight && (
                <div className="absolute top-4 right-4 bg-gold text-black text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className={`text-[8px] uppercase tracking-[0.3em] font-black mb-2 ${plan.highlight ? 'text-gold' : 'text-[#444]'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl lg:text-4xl font-sans text-white font-medium tracking-tighter">${plan.price}</span>
                    <span className="text-[#666] text-xs">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-[9px] text-green-500/80 font-bold uppercase tracking-wider mb-2">{plan.savings}</p>
                  )}
                  <p className="text-[#666] text-[11px] leading-relaxed max-w-[180px]">{plan.description}</p>
                </div>

                <div className="h-px bg-[#1A1A1A] w-full mb-6" />

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[11px] text-[#888] group/item">
                      <div className={`w-1 h-1 rounded-full ${plan.highlight ? 'bg-gold/60 animate-pulse' : 'bg-[#222]'}`} />
                      <span className="group-hover/item:text-[#A0A0A0] transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePlanSelection(plan)}
                  disabled={isProcessing}
                  className={`w-full py-3.5 rounded-lg text-[8px] uppercase font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn ${
                    plan.highlight
                      ? 'luxury-button shadow-[0_0_15px_rgba(197,160,89,0.1)]'
                      : 'bg-[#0D0D0D] border border-[#1A1A1A] text-[#666] hover:border-gold/30 hover:text-gold'
                  }`}
                >
                  {isProcessing && selectedPlan?.id === plan.id ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <>Deploy Protocol <ArrowRight className="w-2.5 h-2.5 group-hover/btn:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#080808] border border-[#1A1A1A] rounded-2xl">
                <div className="flex items-center gap-2 text-[8px] text-[#444] uppercase tracking-widest font-bold">
                    <ShieldCheck className="w-3 h-3 text-green-500/50" />
                    Secure Payment via Paystack
                </div>
                <div className="w-px h-3 bg-[#1A1A1A]" />
                <div className="flex items-center gap-2 text-[8px] text-[#444] uppercase tracking-widest font-bold">
                    <Zap className="w-3 h-3 text-gold/50" />
                    Instant Activation
                </div>
            </div>
        </div>
      </main>

      <AnimatePresence>
        {showEmailInput && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#050505]/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowEmailInput(false)}
                className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 text-center">
                <Logo className="w-8 h-8 mx-auto mb-4" />
                <h2 className="text-xl font-sans font-medium text-white mb-2 tracking-tight">Deployment Contact</h2>
                <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold">Enter your email to secure your protocol.</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] group-focus-within:text-gold transition-colors" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-gold/50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-black rounded-xl text-[10px] uppercase font-black tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
