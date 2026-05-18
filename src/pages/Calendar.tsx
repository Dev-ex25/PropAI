import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar as CalendarIcon, Clock, MapPin, Loader as Loader2, Plus, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
}

export default function CalendarPage({ user, token }: { user: User, token: string | null }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchCalendarEvents();
    }
  }, [token]);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=' + new Date().toISOString() + '&maxResults=10&singleEvents=true&orderBy=startTime',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar. You might need to sign in again.');
      }

      const data = await response.json();
      setEvents(data.items || []);
    } catch (err: any) {
      console.error('Calendar error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const suggestedSlots = [
    { day: 'Friday', time: '2:00 PM - 3:00 PM', rating: 'High Demand', reason: 'Common request window' },
    { day: 'Saturday', time: '10:00 AM - 11:30 AM', rating: 'Optimal', reason: 'Zero traffic conflict' },
    { day: 'Saturday', time: '4:00 PM - 5:00 PM', rating: 'Open', reason: 'Low scheduling density' },
  ];

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-sans font-medium text-white tracking-tight">Concierge Schedule</h3>
          <p className="text-[#A0A0A0] text-xs sm:text-sm tracking-wide mt-1 italic opacity-80">Real-time oversight and conflict prevention.</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
           {!token && (
              <span className="text-[9px] sm:text-[10px] text-red-500 uppercase font-black bg-red-500/5 px-3 sm:px-4 py-2 border border-red-500/10 rounded flex items-center gap-2">
                 <AlertCircle className="w-3 h-3" /> Sync Offline
              </span>
           )}
           <button className="luxury-button text-[9px] sm:text-[10px]">
             <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Manual Entry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold flex items-center gap-2">
                 <div className="w-2 h-2 bg-gold/40 rounded-full" /> Verified Sessions
              </h4>
              {token && <span className="text-[9px] sm:text-[10px] text-gold font-bold uppercase tracking-widest bg-gold/5 px-2 py-0.5 border border-gold/10 rounded hidden sm:inline">Live Google Sync</span>}
           </div>

           {error && (
            <div className="bg-red-500/5 border border-red-500/20 p-4 sm:p-6 rounded-2xl flex items-start gap-3 sm:gap-4 text-red-400">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                 <p className="font-bold uppercase tracking-widest text-[9px] sm:text-[10px] mb-1">Authorization Conflict</p>
                 <p className="opacity-80 text-xs">{error}</p>
              </div>
            </div>
          )}

          {loading && token ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#333]" />
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {events.length > 0 ? (
                events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#0A0A0A] p-4 sm:p-6 rounded-2xl border border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 group hover:border-gold/20 transition-all shadow-xl"
                  >
                    <div className="flex-shrink-0 sm:w-24 flex sm:flex-col sm:text-center sm:border-r sm:border-[#1A1A1A] sm:pr-8 items-center gap-3 sm:gap-0">
                      <p className="text-[9px] sm:text-[10px] font-bold text-gold uppercase tracking-[0.2em] sm:mb-1">
                        {new Date(event.start.dateTime || event.start.date || '').toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-2xl sm:text-3xl font-sans text-white">
                        {new Date(event.start.dateTime || event.start.date || '').toLocaleDateString('en-US', { day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                         <h4 className="text-base sm:text-lg font-sans font-medium text-white group-hover:text-gold transition-colors truncate">{event.summary}</h4>
                         <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold/30 flex-shrink-0" title="PropAI Secured" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666]">
                        <span className="flex items-center gap-1.5 sm:gap-2"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1.5 sm:gap-2 truncate max-w-[180px] sm:max-w-[200px]"><MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.location}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 sm:py-24 bg-[#0A0A0A] rounded-2xl sm:rounded-3xl border border-dashed border-[#1A1A1A]">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#1A1A1A] flex items-center justify-center mx-auto mb-4 sm:mb-6 bg-[#070707]">
                      <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A1A1A]" />
                   </div>
                   <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[#333] font-bold">Horizon Clear</p>
                   <p className="text-[7px] sm:text-[8px] uppercase tracking-widest text-[#222] mt-2">No upcoming sessions detected</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-8">
           <div className="bg-[#0A0A0A] p-5 sm:p-8 rounded-2xl border border-[#1A1A1A] shadow-xl">
              <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-4 sm:mb-6 flex items-center gap-2">
                 <Zap className="w-3 h-3 text-gold" /> Proactive Openings
              </h4>
              <div className="space-y-3 sm:space-y-4">
                 {suggestedSlots.map((slot, i) => (
                    <div key={i} className="p-3 sm:p-4 bg-[#050505] rounded-xl border border-[#1A1A1A] group hover:border-gold/30 transition-all cursor-pointer">
                       <div className="flex justify-between items-start mb-2">
                          <p className="text-[10px] sm:text-xs font-bold text-white uppercase">{slot.day}</p>
                          <span className={`text-[7px] sm:text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                             slot.rating === 'Optimal' ? 'bg-gold/10 text-gold' : 'bg-[#111] text-[#666]'
                          }`}>
                            {slot.rating}
                          </span>
                       </div>
                       <p className="text-base sm:text-lg font-sans text-[#F5F5F5] mb-1 sm:mb-2">{slot.time}</p>
                       <p className="text-[8px] sm:text-[9px] text-[#444] font-bold uppercase tracking-tight">{slot.reason}</p>
                    </div>
                 ))}
                 <button className="w-full py-3 sm:py-4 mt-2 bg-gold/5 border border-gold/10 text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black rounded-xl hover:bg-gold/10 transition-all">
                    Release to Concierge
                 </button>
              </div>
           </div>

           <div className="bg-[#0A0A0A] p-5 sm:p-8 rounded-2xl border border-[#1A1A1A] shadow-xl">
              <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-4 sm:mb-6">Security Policy</h4>
              <div className="flex items-start gap-3 sm:gap-4">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                 </div>
                 <div>
                    <p className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-widest mb-1">Collision Shield</p>
                    <p className="text-[9px] sm:text-[10px] text-[#A0A0A0] leading-relaxed italic opacity-80">
                      PropAI cross-references all inbounds against your primary calendar to ensure double-booking prevention.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
