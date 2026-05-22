import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, X, Mail, Loader2, ShieldCheck, Zap, Settings, Save, ExternalLink, Copy } from 'lucide-react';
import Logo from '../components/Logo';
import { usePaystackPayment } from 'react-paystack';

interface PricingPageProps {
  onBack: () => void;
  onSignUp: () => void;
  userEmail?: string | null;
  isInline?: boolean;
}

export default function PricingPage({ onBack, onSignUp, userEmail, isInline }: PricingPageProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [triggerPayment, setTriggerPayment] = useState(false);

  // Custom subscription URLs (Read from Local Storage falling back to environment variables or user's Paystack links)
  const [customMonthlyUrl, setCustomMonthlyUrl] = useState(() => {
    return localStorage.getItem('propai_monthly_sub_url') || (import.meta as any).env.VITE_MONTHLY_SUBSCRIPTION_URL || 'https://paystack.shop/pay/2n7duu6cji';
  });
  const [customAnnualUrl, setCustomAnnualUrl] = useState(() => {
    return localStorage.getItem('propai_annual_sub_url') || (import.meta as any).env.VITE_ANNUAL_SUBSCRIPTION_URL || 'https://paystack.shop/pay/nc-tbxadff';
  });

  // Automatically opt for Checkout Redirect if custom URLs exist
  const [useCheckoutRedirect, setUseCheckoutRedirect] = useState(() => {
    const stored = localStorage.getItem('propai_use_checkout_redirect');
    if (stored !== null) return stored === 'true';
    return true; // Auto-redirection is true by default now that we have custom links configured
  });

  // Integrator Console configuration states
  const [showIntegratorConsole, setShowIntegratorConsole] = useState(false);
  const [tempMonthlyUrl, setTempMonthlyUrl] = useState(customMonthlyUrl);
  const [tempAnnualUrl, setTempAnnualUrl] = useState(customAnnualUrl);
  const [tempUseCheckoutRedirect, setTempUseCheckoutRedirect] = useState(useCheckoutRedirect);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Redirecting Modal states
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectingPlan, setRedirectingPlan] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Supported currency is GHS
  const currency = 'GHS';

  const conversionRates: Record<'GHS', { rate: number; symbol: string }> = {
    GHS: { rate: 15, symbol: 'GH₵' }
  };

  const getPlanPrice = (basePrice: number) => {
    const rateInfo = conversionRates[currency];
    return Math.round(basePrice * rateInfo.rate);
  };

  useEffect(() => {
    if (!isInline) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isInline]);

  const publicKey = (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';

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
    setTriggerPayment(false);
    alert('Payment successful! Your protocol has been activated.');
    onSignUp(); // Redirect to sign up/dashboard after success
  };

  const handlePaystackClose = () => {
    console.log('Payment window closed');
    setIsProcessing(false);
    setTriggerPayment(false);
  };

  const config = React.useMemo(() => {
    const rateInfo = conversionRates[currency];
    const basePrice = selectedPlan ? selectedPlan.price : 1;
    const finalAmount = Math.round(basePrice * rateInfo.rate * 100);

    return {
      reference: selectedPlan ? `${selectedPlan.id}-${currency}-${Date.now()}` : `placeholder-${Date.now()}`,
      email: email || 'customer@example.com',
      amount: finalAmount,
      publicKey: publicKey,
      currency: currency,
    };
  }, [selectedPlan, email, publicKey, currency]);

  const initializePayment = usePaystackPayment(config);

  // Safely trigger payment popup once the state is fully applied and the hook receives the updated config
  useEffect(() => {
    if (triggerPayment && email && selectedPlan) {
      setTriggerPayment(false);
      try {
        const paystackFunc = initializePayment as any;
        if (typeof paystackFunc === 'function') {
          paystackFunc(handlePaystackSuccess, handlePaystackClose);
        } else {
          console.error('initializePayment is not a function', initializePayment);
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Launch Paystack popup failed:', err);
        setIsProcessing(false);
      }
    }
  }, [triggerPayment, email, selectedPlan, initializePayment]);

  const handlePlanSelection = (plan: any) => {
    setSelectedPlan(plan);
    const targetUrl = plan.id === 'monthly' ? customMonthlyUrl : customAnnualUrl;

    if (useCheckoutRedirect && targetUrl) {
      try {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Direct window.open failed', err);
      }
      onSignUp();
    } else {
      if (!email) {
        setShowEmailInput(true);
      } else {
        setIsProcessing(true);
        setTriggerPayment(true);
      }
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowEmailInput(false);
      setIsProcessing(true);
      setTriggerPayment(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={isInline ? "w-full selection:bg-gold/30" : "fixed inset-0 z-[100] bg-[#050505] overflow-y-auto selection:bg-gold/30"}
    >
      {/* Background Decor */}
      {!isInline && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
        </div>
      )}

      {!isInline && (
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
      )}

      <main className={isInline ? "max-w-4xl mx-auto py-4 relative z-10" : "max-w-4xl mx-auto px-6 py-10 relative z-10"}>
        <div className="text-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-4xl font-satoshi text-white mb-3 tracking-tight font-medium"
          >
            Invest in <span className="text-gold">Momentum.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#444] uppercase tracking-[0.3em] font-bold text-[8px] mb-8"
          >
            Choose your protocol for autonomous growth.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {plans.map((plan, i) => {
            const hasCustomUrl = plan.id === 'monthly' ? !!customMonthlyUrl : !!customAnnualUrl;
            const isUsingRedirect = useCheckoutRedirect && hasCustomUrl;

            return (
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
                      <span className="text-3xl lg:text-4xl font-satoshi text-white font-medium tracking-tighter">
                        {conversionRates[currency].symbol}{getPlanPrice(plan.price).toLocaleString()}
                      </span>
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

                  {isUsingRedirect ? (
                    <button
                      onClick={() => handlePlanSelection(plan)}
                      className={`w-full py-3.5 rounded-lg text-[8px] uppercase font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer ${
                        plan.highlight
                          ? 'luxury-button text-black shadow-[0_0_15px_rgba(197,160,89,0.1)]'
                          : 'bg-[#0D0D0D] border border-[#1A1A1A] text-gold hover:border-gold/30 hover:bg-gold/5'
                      }`}
                    >
                      Checkout on Website <ExternalLink className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform text-gold" />
                    </button>
                  ) : (
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
                        <>
                          Deploy Protocol <ArrowRight className="w-2.5 h-2.5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap justify-center items-center gap-4 px-6 py-3 bg-[#080808] border border-[#1A1A1A] rounded-2xl">
            <div className="flex items-center gap-2 text-[8px] text-[#444] uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3 h-3 text-green-500/50" />
              Secure Checkout Gateway
            </div>
            <div className="w-px h-3 bg-[#1A1A1A] hidden sm:block" />
            <div className="flex items-center gap-2 text-[8px] text-[#444] uppercase tracking-widest font-bold">
              <Zap className="w-3 h-3 text-gold/50" />
              Instant Protocol Activation
            </div>
          </div>
        </div>

        {/* Dynamic Integrator Configuration Console */}
        <div className="mt-16 border-t border-[#151515] pt-12 max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-[#070707] border border-[#151515] p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gold/5 border border-gold/15 rounded-lg flex items-center justify-center text-gold">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-white uppercase font-black tracking-widest">Subscription Integrator Console</p>
                <p className="text-[8px] text-[#444] uppercase font-black">Configure checkout URLs & gateway routing options</p>
              </div>
            </div>
            <button
              onClick={() => setShowIntegratorConsole(!showIntegratorConsole)}
              className="text-[8px] uppercase font-black tracking-widest bg-[#151515] border border-[#222] hover:border-gold/30 hover:text-gold px-4 py-2.5 rounded-xl text-[#AAA] transition-all"
            >
              {showIntegratorConsole ? 'Close Settings' : 'Configure Links'}
            </button>
          </div>

          <AnimatePresence>
            {showIntegratorConsole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#070707] border border-[#151515] p-6 rounded-2xl space-y-5 overflow-hidden text-left"
              >
                {configSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    Subscription parameters saved to browser environment!
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#151515]">
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase font-black text-white tracking-wider">Gateway Routing</p>
                      <p className="text-[7px] text-[#555] uppercase font-black">Route client selectors straight to checkout websites</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tempUseCheckoutRedirect}
                        onChange={(e) => setTempUseCheckoutRedirect(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#151515] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#444] peer-checked:after:bg-gold after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold/10 peer-checked:border-gold/35 border border-[#222]"></div>
                      <span className="ml-3 text-[9px] uppercase tracking-wider font-extrabold text-[#777] peer-checked:text-gold">
                        {tempUseCheckoutRedirect ? 'Redirect active' : 'Paystack inline'}
                      </span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] uppercase font-black text-[#555] tracking-widest px-1">Monthly Subscription Link / Website</label>
                    <input
                      type="url"
                      placeholder="https://checkout.paystack.com/monthly-plan-slug"
                      value={tempMonthlyUrl}
                      onChange={(e) => setTempMonthlyUrl(e.target.value)}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3 text-xs text-white placeholder-[#2ea] focus:outline-none focus:border-gold/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] uppercase font-black text-[#555] tracking-widest px-1">Yearly Subscription Link / Website</label>
                    <input
                      type="url"
                      placeholder="https://checkout.paystack.com/yearly-plan-slug"
                      value={tempAnnualUrl}
                      onChange={(e) => setTempAnnualUrl(e.target.value)}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3 text-xs text-white placeholder-[#2ea] focus:outline-none focus:border-gold/50 transition-all font-mono"
                    />
                  </div>

                  <div className="p-4 bg-[#050505]/40 border border-[#111] rounded-xl space-y-1 text-[#444] text-[9px] uppercase font-black leading-relaxed">
                    <p className="text-[#666]">💡 Permanent Production Deployment Instruction</p>
                    <p>To persist these variables permanently in production, configure these two values in your environment variables:</p>
                    <p className="text-gold font-mono lowercase normal-case select-all pt-1 leading-normal">
                      VITE_MONTHLY_SUBSCRIPTION_URL="https://your-monthly-checkout-link.com"<br/>
                      VITE_ANNUAL_SUBSCRIPTION_URL="https://your-yearly-checkout-link.com"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem('propai_monthly_sub_url', tempMonthlyUrl);
                      localStorage.setItem('propai_annual_sub_url', tempAnnualUrl);
                      localStorage.setItem('propai_use_checkout_redirect', String(tempUseCheckoutRedirect));
                      setCustomMonthlyUrl(tempMonthlyUrl);
                      setCustomAnnualUrl(tempAnnualUrl);
                      setUseCheckoutRedirect(tempUseCheckoutRedirect);
                      setConfigSuccess(true);
                      setTimeout(() => setConfigSuccess(false), 3000);
                    }}
                    className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black font-black uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Checkout Configuration
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
