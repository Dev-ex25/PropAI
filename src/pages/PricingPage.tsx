import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, X, Loader as Loader2, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

interface PricingPageProps {
  onBack: () => void;
  onSignUp?: () => void;
  onPaymentSuccess?: (planName: 'monthly' | 'annual') => void;
}

export default function PricingPage({ onBack, onSignUp, onPaymentSuccess }: PricingPageProps) {
  const [processingPlan, setProcessingPlan] = useState<'monthly' | 'annual' | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const plans = [
    {
      name: "Monthly Access",
      planKey: 'monthly' as const,
      price: "49.99",
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
      name: "Annual Protocol",
      planKey: 'annual' as const,
      price: "500",
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

  const handleSelectPlan = (planKey: 'monthly' | 'annual') => {
    setProcessingPlan(planKey);
    setPaymentStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
    }, 2000);
  };

  const handleConfirmSuccess = () => {
    if (onPaymentSuccess && processingPlan) {
      onPaymentSuccess(processingPlan);
    } else if (onSignUp) {
      onSignUp();
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
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1A1A1A] bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-sans font-medium tracking-tight text-white">PropAI</span>
          </div>
          {paymentStep === 'select' && (
            <button
              onClick={onBack}
              className="p-2 sm:p-1.5 rounded-xl text-[#666] hover:text-white hover:bg-[#1A1A1A] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {paymentStep === 'select' && (
          <>
            <div className="text-center mb-8 sm:mb-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-4xl font-sans text-white mb-2 sm:mb-3 tracking-tight font-medium"
              >
                Invest in <span className="text-gold">Momentum.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[#777] uppercase tracking-[0.3em] font-bold text-[7px] sm:text-[8px]"
              >
                Choose your protocol for autonomous growth.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`relative group rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-6 border transition-all duration-500 overflow-hidden ${
                    plan.highlight
                      ? 'bg-[#0A0A0A] border-gold/20 shadow-[0_0_30px_rgba(197,160,89,0.05)]'
                      : 'bg-[#080808] border-[#1A1A1A] hover:border-gold/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {plan.highlight && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gold text-black text-[6px] sm:text-[7px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      Recommended
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="mb-4 sm:mb-6">
                      <h3 className={`text-[7px] sm:text-[8px] uppercase tracking-[0.3em] font-black mb-2 ${plan.highlight ? 'text-gold' : 'text-[#777]'}`}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-sans text-white font-medium tracking-tighter">${plan.price}</span>
                        <span className="text-[#888] text-[10px] sm:text-xs">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-[8px] sm:text-[9px] text-green-500/80 font-bold uppercase tracking-wider mb-2">{plan.savings}</p>
                      )}
                      <p className="text-[#888] text-[10px] sm:text-[11px] leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="h-px bg-[#1A1A1A] w-full mb-4 sm:mb-6" />

                    <ul className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] text-[#888] group/item">
                          <div className={`w-1 h-1 rounded-full ${plan.highlight ? 'bg-gold/60 animate-pulse' : 'bg-[#555]'}`} />
                          <span className="group-hover/item:text-[#A0A0A0] transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.planKey)}
                      disabled={processingPlan !== null}
                      className={`w-full py-3 sm:py-3.5 rounded-lg text-[7px] sm:text-[8px] uppercase font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn ${
                        plan.highlight
                          ? 'luxury-button shadow-[0_0_15px_rgba(197,160,89,0.1)]'
                          : 'bg-[#0D0D0D] border border-[#1A1A1A] text-[#888] hover:border-gold/30 hover:text-gold'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {processingPlan === plan.planKey ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          Deploy Plan <ArrowRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] text-[#666]">
                <ShieldCheck className="w-3.5 h-3.5 text-gold/40" />
                <span>Secure payment. Cancel anytime. No hidden fees.</span>
              </div>
            </div>
          </>
        )}

        {paymentStep === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 sm:py-32"
          >
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 mb-8">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-sans text-white font-medium tracking-tight mb-3">Processing Payment</h2>
            <p className="text-sm text-[#888]">
              {processingPlan === 'annual'
                ? 'Activating your Annual Protocol...'
                : 'Activating your Monthly Access...'}
            </p>
          </motion.div>
        )}

        {paymentStep === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 sm:py-32"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30 mb-8"
            >
              <Check className="w-10 h-10 text-gold" />
            </motion.div>

            <h2 className="text-xl sm:text-2xl font-sans text-white font-medium tracking-tight mb-3">Protocol Activated</h2>
            <p className="text-sm text-[#888] mb-8 text-center max-w-sm">
              {processingPlan === 'annual'
                ? 'Your Annual Protocol is now active. Full access to all PropAI features has been granted.'
                : 'Your Monthly Access is now active. Full access to all PropAI features has been granted.'}
            </p>

            <button
              onClick={handleConfirmSuccess}
              className="luxury-button px-10 py-4 text-xs shadow-[0_0_20px_rgba(197,160,89,0.15)]"
            >
              Enter PropAI <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
