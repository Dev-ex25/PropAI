import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { TrendingUp, Users, Hop as Home, Calendar, Zap, MessageSquare, Clock } from 'lucide-react';

export default function Dashboard({ user }: { user: User }) {
  const stats = [
    { label: 'Active Inquiries', value: '142', icon: MessageSquare, color: 'text-gold bg-gold/5', trend: '+12%' },
    { label: 'Pending Nudge', value: '38', icon: Zap, color: 'text-gold bg-gold/5', trend: '-5%' },
    { label: 'Confirmations', value: '24', icon: Calendar, color: 'text-gold bg-gold/5', trend: '+18%' },
    { label: 'Precision', value: '99.4%', icon: Clock, color: 'text-gold bg-gold/5', trend: '+1.2%' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-sans font-medium text-white tracking-tight">Executive Hub</h3>
          <p className="text-[#666] text-[10px] sm:text-xs mt-1 uppercase tracking-widest font-medium">Operational overview for PropAI Protocol.</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[8px] text-[#444] uppercase tracking-[0.3em] font-black mb-1">Health</p>
          <div className="flex items-center gap-1.5 text-gold text-[9px] font-black uppercase tracking-widest">
            <div className="w-1 h-1 bg-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(197,160,89,1)]" />
            Active Sync
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2, borderColor: 'rgba(197,160,89,0.2)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0A0A0A] p-3 sm:p-4 rounded-xl border border-[#1A1A1A] flex flex-col shadow-xl group transition-all"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`${stat.color} p-1.5 sm:p-2 rounded-lg border border-gold/10 group-hover:border-gold/30 transition-all`}>
                <stat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[8px] sm:text-[9px] text-gold font-black">{stat.trend}</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#444] font-black mb-0.5">{stat.label}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-sans text-white font-medium">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 bg-[#0A0A0A] p-4 sm:p-6 rounded-xl border border-[#1A1A1A] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-sans text-white font-bold uppercase tracking-widest">Automation Log</h4>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-gold/5 border border-gold/10 text-gold text-[7px] uppercase tracking-widest font-black rounded">Gmail</span>
              <span className="px-2 py-0.5 bg-gold/5 border border-gold/10 text-gold text-[7px] uppercase tracking-widest font-black rounded">WhatsApp</span>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
             {[
               { target: 'Julian Vane', channel: 'WhatsApp', action: 'Scheduling Intent', details: 'Suggested 3 slots for Chelsea Penthouse', time: '2m' },
               { target: 'Elena Ross', channel: 'Gmail', action: 'Pricing Inquiry', details: 'Auto-responded with current valuation', time: '14m' },
               { target: 'Marcus Thorne', channel: 'WhatsApp', action: 'Follow-up', details: 'Sent nudge for unresponsive inquiry', time: '1h' },
               { target: 'Sarah Jenkins', channel: 'Gmail', action: 'Confirmed', details: 'Synced Saturday 2PM slot to calendar', time: '3h' },
             ].map((log, i) => (
               <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#111]/30 hover:bg-[#111]/60 rounded-xl transition-all border border-[#1A1A1A]/30 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold/5 flex items-center justify-center flex-shrink-0 border border-gold/10">
                    {log.channel === 'WhatsApp' ? <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" /> : <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-tight truncate">{log.action}</p>
                      <span className="text-[7px] sm:text-[8px] text-[#444] font-black uppercase flex-shrink-0">{log.time}</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-[#666] mt-0.5 truncate">{log.details}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[7px] sm:text-[8px] text-white/50 font-bold px-2 py-0.5 bg-[#1A1A1A] rounded tracking-wide uppercase">TGT: {log.target}</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-[#0A0A0A] p-4 sm:p-6 rounded-xl border border-[#1A1A1A] shadow-xl flex flex-col relative overflow-hidden group">
            <h4 className="text-xs sm:text-sm font-sans text-white mb-3 sm:mb-4 font-bold uppercase tracking-widest relative z-10">Intelligence Strategy</h4>
            <div className="flex-1 p-3 sm:p-4 bg-gold/5 border border-gold/10 rounded-xl relative overflow-hidden">
              <p className="text-[8px] sm:text-[8px] text-gold uppercase tracking-[0.2em] font-black mb-2">Protocol Status</p>
              <p className="text-[10px] sm:text-[11px] text-[#A0A0A0] leading-relaxed font-sans mb-3 sm:mb-4">
                <span className="text-white font-bold">8 priority leads</span> awaiting activation. Suggested Nudge protocol ready.
              </p>
              <button className="luxury-button w-full py-2 sm:py-2.5 text-[8px] sm:text-[9px]">
                Trigger Protocol
              </button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] p-4 sm:p-6 rounded-xl border border-[#1A1A1A] shadow-xl">
             <h4 className="text-xs sm:text-sm font-sans text-white mb-3 sm:mb-4 font-bold uppercase tracking-widest">Efficiency Analytics</h4>
             <div className="space-y-3">
                {[
                  { label: 'Time Reclaimed', value: '14.7h', percentage: 72 },
                  { label: 'Precision', value: '98.2%', percentage: 98 },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[7px] sm:text-[8px] uppercase font-black tracking-widest mb-1.5">
                      <span className="text-[#444]">{metric.label}</span>
                      <span className="text-gold">{metric.value}</span>
                    </div>
                    <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.percentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gold shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
