import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  ChevronDown,
  ArrowRight,
  PlusCircle,
  Zap
} from 'lucide-react';

import Logo from '../components/Logo';

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
  onPricing: () => void;
  error?: string | null;
}

export default function LandingPage({ onLogin, onSignUp, onPricing, error }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: 'Automation Savings', value: '15h+' },
    { label: 'Response Latency', value: 'Instant' },
    { label: 'Lead Conversion', value: '3x' },
    { label: 'Operations Managed', value: '100%' },
  ];

  const features = [
    {
      title: 'Unified Communication',
      desc: 'Connect Gmail and WhatsApp into a single automation hub. Detecting pricing, scheduling, and general inquiries instantly.',
      icon: MessageSquare,
    },
    {
      title: 'Intelligent Scheduling',
      desc: 'Real-time calendar syncing for viewings and meetings. Double-booking prevention with automated reminders.',
      icon: Clock,
    },
    {
      title: 'Operational Hub',
      desc: 'A central property database that contextualizes AI responses with property-specific facts and details.',
      icon: Building2,
    },
    {
      title: 'Automated Follow-ups',
      desc: 'Never lose a lead. Automated sequences for unresponsive prospects and missed meeting engagement.',
      icon: Zap,
    },
    {
      title: 'Business Analytics',
      desc: 'Visual metrics on lead performance, scheduling density, and operational efficiency analytics.',
      icon: TrendingUp,
    },
    {
      title: 'Conversational Control',
      desc: 'Give real-time instructions and manage platform actions via a built-in AI operation assistant.',
      icon: Sparkles,
    },
  ];

  const faqs = [
    {
      q: 'Which accounts can I connect?',
      a: 'PropAI supports direct integration with Gmail and WhatsApp Business, allowing the AI to detect and respond to inquiries across your primary channels.',
    },
    {
      q: 'How does it know my property details?',
      a: 'The system includes a property database where you upload listing information. The AI uses this context to provide accurate, property-specific answers.',
    },
    {
      q: 'Does it prevent overbooking?',
      a: 'Yes. By connecting your Google Calendar, PropAI checks availability in real time and only suggests slots that are truly vacant.',
    },
    {
      q: 'Can I monitor the AI activity?',
      a: 'Absolutely. The executive dashboard provides a full summary of all automated replies, scheduled calls, and pending follow-ups.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="w-5 h-5" />
              <span className="text-base font-satoshi font-semibold tracking-tight text-white">PropAI</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-[#666]">
              <button onClick={onPricing} className="hover:text-gold transition-colors">Pricing</button>
              <button onClick={onLogin} className="luxury-button px-4 py-1.5 text-[9px]">Sign In</button>
            </div>
          </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center pt-20 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 lg:space-y-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.2,
                ease: [0.21, 0.45, 0.32, 0.9]
              }}
              className="text-4xl lg:text-7xl font-satoshi font-medium leading-[1.1] text-white tracking-tight"
            >
              Close More <span className="text-gold">Deals.</span><br />
              Handle Less <span className="text-gold">Work.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.4,
                ease: [0.21, 0.45, 0.32, 0.9]
              }}
              className="text-base lg:text-lg text-[#666] max-w-xl leading-relaxed"
            >
              Automate communication, organize scheduling, and follow up with leads across Gmail and WhatsApp — effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.6,
                ease: [0.21, 0.45, 0.32, 0.9]
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
            >
              <button onClick={onSignUp} className="luxury-button px-10 py-4 text-[11px] shadow-[0_0_30px_rgba(197,160,89,0.15)] w-full sm:w-auto">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </button>
            </motion.div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 p-3 rounded-lg max-w-lg"
              >
                {error}
              </motion.p>
            )}
          </div>
        </div>
        
        {/* Background Ambient Glow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"
        />
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#1A1A1A] bg-[#070707] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 lg:gap-24">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-3xl font-satoshi text-white mb-1">{stat.value}</p>
              <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem vs Solution */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24 max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-satoshi text-white mb-6">Designed for Operation-Focused Realtors</h2>
            <p className="text-[#A0A0A0]">Realtors care about getting more leads and closing faster. PropAI attacks the manual friction points that hold you back.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#0A0A0A] p-10 rounded-3xl border border-red-900/10 shadow-xl"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold mb-8">The Traditional Burden</p>
              <ul className="space-y-6">
                {[
                  'Responding to identical pricing queries manually',
                  'Inconsistent follow-ups with cold prospects',
                  'Scheduling viewings via endless back-and-forth',
                  'Managing disconnected property data in spreadsheets',
                  'Losing track of lead intent across multiple apps',
                ].map((item) => (
                  <li key={item} className="flex gap-4 items-start text-[#666] line-through decoration-red-900/50">
                    <div className="w-5 h-5 rounded-full border border-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px]">✕</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-[#0A0A0A] p-10 rounded-3xl border border-gold/10 shadow-xl"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-8">The PropAI Protocol</p>
              <ul className="space-y-6">
                {[
                  'Real-time automated intent detection & response',
                  'Predictive follow-ups for unresponsive leads',
                  'Autonomous scheduling synced to your calendar',
                  'Centralized property database for AI context',
                  'Visual operations dashboard for business insights',
                ].map((item) => (
                  <li key={item} className="flex gap-4 items-start text-[#F5F5F5]">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Bento */}
      <section className="py-32 bg-[#070707] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[#0A0A0A] p-8 rounded-2xl border border-[#1A1A1A] hover:border-gold/20 transition-all group shadow-lg"
              >
                <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center mb-6 border border-[#222] group-hover:border-gold/20 group-hover:bg-gold/5 transition-all">
                  <feature.icon className="w-6 h-6 text-[#444] group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-satoshi text-xl text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-6xl font-satoshi text-white leading-tight">Elevate Your Agency with the <span className="text-gold">PropAI Protocol.</span></h2>
            <p className="text-[#666] text-xs max-w-xl mx-auto leading-relaxed uppercase tracking-[0.2em] font-bold">Reclaim your time. Scale your portfolio. Close faster.</p>
            
            <button onClick={onSignUp} className="luxury-button px-10 py-5 text-[10px] shadow-[0_0_30px_rgba(197,160,89,0.2)] mx-auto">
               Get Started <ArrowRight className="w-3 h-3 ml-2" />
            </button>

            <div className="flex flex-col items-center gap-6">
              <div className="mt-4 p-6 bg-[#0A0A0A]/50 backdrop-blur-sm border border-[#1A1A1A] rounded-xl max-w-xl mx-auto relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-satoshi text-white mb-2 tracking-tight">Absolute Simplicity</h3>
                  <p className="text-xs text-[#444] font-sans leading-relaxed">
                    PropAI integrates into your existing business flow with <span className="text-gold/40">zero friction.</span>
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 mt-4 max-w-md mx-auto uppercase tracking-widest font-bold">{error}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] py-8 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-4">
           <div className="flex items-center gap-2">
              <Logo className="w-4 h-4" />
              <span className="text-[10px] font-sans text-white font-black uppercase tracking-[0.2em] opacity-60">PropAI Operations</span>
           </div>
           <p className="text-[7px] text-[#222] uppercase tracking-[0.4em] font-black">© 2026 PROPAI LTD. INTEL SECURED.</p>
        </div>
      </footer>
    </div>
  );
}
