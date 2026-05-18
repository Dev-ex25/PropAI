import { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Send, Loader as Loader2, Sparkles, MessageSquare, CirclePlus as PlusCircle, Calendar, Zap, Building2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  actions?: string[];
}

export default function Assistant({ user }: { user: User }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Greetings, ${user.displayName?.split(' ')[0]}. I am the PropAI Operations Assistant. I can help you manage your property database, synthesize responses for inquiries, or coordinate your schedule. What is our objective today?`,
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "I've processed your request. How would you like me to proceed?";
      let actions: string[] = [];

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('listing') || lowerInput.includes('property')) {
        response = "I see your request regarding property management. I can initialize a new listing narrative or look up existing asset data. Which record should I access?";
        actions = ['Initialize New Listing', 'Search Database'];
      } else if (lowerInput.includes('schedule') || lowerInput.includes('meet') || lowerInput.includes('viewing')) {
        response = "Sourcing your current concierge schedule. I've detected 3 optimal windows for next week. Shall I draft the outreach for your priority leads?";
        actions = ['Review Suggested Slots', 'Draft Outreach'];
      } else if (lowerInput.includes('lead') || lowerInput.includes('inquiry') || lowerInput.includes('follow-up')) {
        response = "Found 8 priority leads awaiting follow-up. I've prepared a personalized nudge protocol for the 'Chelsea Penthouse' inquiries. Shall I transmit them via WhatsApp?";
        actions = ['Execute Nudge Protocol', 'Review Scripts'];
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
           <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold/5 rounded-xl flex items-center justify-center border border-gold/10">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
           </div>
           <div>
              <h3 className="text-base sm:text-xl font-sans font-medium text-white tracking-tight uppercase">Operations</h3>
              <p className="text-[7px] sm:text-[8px] text-[#444] uppercase tracking-[0.2em] font-black mt-0.5">Execution Interface</p>
           </div>
        </div>
        <div className="flex gap-2">
           <span className="px-2 sm:px-2.5 py-1 bg-gold/5 border border-gold/10 text-gold text-[6px] sm:text-[7px] uppercase tracking-[0.3em] font-black rounded flex items-center gap-1.5 sm:gap-2">
              <div className="w-1 h-1 bg-gold rounded-full animate-pulse" />
              <span className="hidden sm:inline">Sync</span> Online
           </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#0A0A0A] rounded-2xl sm:rounded-3xl border border-[#1A1A1A] shadow-2xl relative">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-8"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                msg.role === 'assistant'
                ? 'bg-gold/10 border-gold/20'
                : 'bg-[#1A1A1A] border-[#333]'
              }`}>
                {msg.role === 'assistant' ? <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" /> : <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A0A0A0]" />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[85%] space-y-1.5 sm:space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                 <div className={`p-3 sm:p-4 rounded-xl text-[11px] sm:text-xs font-sans leading-relaxed shadow-lg ${
                   msg.role === 'assistant'
                   ? 'bg-[#111] text-[#F5F5F5] border border-[#1A1A1A] border-l-gold/30 border-l-2'
                   : 'bg-gold/10 text-gold border border-gold/20'
                 }`}>
                   {msg.content}
                 </div>
                 {msg.actions && msg.actions.length > 0 && (
                   <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 justify-start">
                     {msg.actions.map(action => (
                       <button
                        key={action}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gold/5 border border-gold/10 text-gold text-[7px] sm:text-[8px] uppercase font-black tracking-widest rounded hover:bg-gold/15 transition-all flex items-center gap-1 sm:gap-1.5"
                       >
                         {action.includes('Listing') ? <PlusCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> : action.includes('Schedule') ? <Calendar className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> : <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5" />}
                         {action}
                       </button>
                     ))}
                   </div>
                 )}
                 <p className="text-[7px] sm:text-[8px] text-[#333] uppercase tracking-widest font-black">{msg.time}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold animate-pulse" />
              </div>
              <div className="flex gap-1.5">
                 <div className="w-1 h-1 bg-gold/30 rounded-full animate-bounce" />
                 <div className="w-1 h-1 bg-gold/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1 h-1 bg-gold/30 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-[#070707] border-t border-[#1A1A1A]">
           <div className="relative group">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Give instructions to PropAI..."
                className="w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-3 sm:py-4 bg-[#050505] border border-[#1A1A1A] group-hover:border-gold/20 focus:border-gold rounded-xl outline-none text-white text-[11px] sm:text-xs font-sans resize-none transition-all shadow-inner h-12 sm:h-14 flex items-center"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-gold rounded-lg flex items-center justify-center text-[#050505] shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
              >
                <Send className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </button>
           </div>
           <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 px-1">
              <button className="flex items-center gap-1 sm:gap-1.5 text-[7px] sm:text-[8px] text-[#333] uppercase tracking-widest font-black hover:text-gold transition-colors">
                <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Database
              </button>
              <button className="flex items-center gap-1 sm:gap-1.5 text-[7px] sm:text-[8px] text-[#333] uppercase tracking-widest font-black hover:text-gold transition-colors">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Schedule
              </button>
              <div className="flex-1" />
              <p className="text-[6px] sm:text-[8px] text-[#333] uppercase font-black tracking-tighter hidden sm:block">PropAI v2.0 Operational Assistant</p>
           </div>
        </div>
      </div>
    </div>
  );
}
