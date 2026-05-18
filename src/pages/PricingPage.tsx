import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, X } from 'lucide-react';
import Logo from '../components/Logo';

interface PricingPageProps {
  onBack: () => void;
  onSignUp: () => void;
}

export default function PricingPage({ onBack, onSignUp }: PricingPageProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const plans = [
    {
      name: "Monthly Access",
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
                  onClick={onSignUp}
                  className={`w-full py-3.5 rounded-lg text-[8px] uppercase font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn ${
                    plan.highlight
                      ? 'luxury-button shadow-[0_0_15px_rgba(197,160,89,0.1)]'
                      : 'bg-[#0D0D0D] border border-[#1A1A1A] text-[#666] hover:border-gold/30 hover:text-gold'
                  }`}
                >
                  Deploy Plan <ArrowRight className="w-2.5 h-2.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </motion.div>
  );
}
