import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MessageSquare, Loader2, Send, Sparkles, Circle, Tag, Calendar, DollarSign, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'closed';
  realtorId: string;
  detectedIntent?: 'pricing' | 'availability' | 'scheduling' | 'inquiry';
  lastActivity?: string;
}

export default function Leads({ user }: { user: any }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Mock leads data
    const mockLeads: Lead[] = [
      {
        id: 'lead-1',
        name: 'Julian Sterling',
        email: 'j.sterling@example.com',
        phone: '+1 555-0102',
        message: 'Looking for a private viewing of the Platinum estate. Is Saturday available?',
        propertyId: '1',
        status: 'new',
        realtorId: user?.uid || 'mock-id',
        detectedIntent: 'scheduling'
      },
      {
        id: 'lead-2',
        name: 'Elena Vance',
        email: 'elena@vanceholdings.com',
        phone: '+1 555-0199',
        message: 'What is the current asking price for the Aspen retreat? Interested in cash offer.',
        propertyId: '2',
        status: 'contacted',
        realtorId: user?.uid || 'mock-id',
        detectedIntent: 'pricing'
      }
    ];

    setTimeout(() => {
      setLeads(mockLeads);
      setLoading(false);
    }, 1000);
  }, [user]);

  const fetchLeads = async () => {
    // Removed Firestore call, using local state
  };

  const generateAIReply = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    // Mocking the behavior for now to ensure reliability
    setTimeout(() => {
      let reply = "";
      switch(selectedLead.detectedIntent) {
        case 'pricing': reply = `Hello ${selectedLead.name}, I've checked the current records for the property (ID: ${selectedLead.propertyId}). It is currently listed at the requested luxury valuation. Exclusive financing options are also available for this asset.`; break;
        case 'availability': reply = `Hello ${selectedLead.name}, I can confirm this property is still in our active portfolio. We have received high interest today, so I recommend acting quickly if you remain interested.`; break;
        case 'scheduling': reply = `Hello ${selectedLead.name}, I've synchronized with the realtor's concierge schedule. We have an opening this Saturday at 2:00 PM or Monday at 10:00 AM. Which works better for your viewing?`; break;
        default: reply = `Hello ${selectedLead.name}, thank you for your inquiry regarding property ID ${selectedLead.propertyId}. I'm the PropAI assistant and I've flagged this for priority review. How else can I assist you today?`;
      }
      setReplyText(reply);
      setIsGenerating(false);
    }, 1000);
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'pricing': return <DollarSign className="w-3 h-3 text-gold" />;
      case 'availability': return <Tag className="w-3 h-3 text-gold" />;
      case 'scheduling': return <Calendar className="w-3 h-3 text-gold" />;
      default: return <HelpCircle className="w-3 h-3 text-gold" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
      {/* Lead List */}
      <div className="lg:col-span-4 border-r border-[#1A1A1A] pr-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="flex items-center justify-between">
           <h3 className="text-[9px] uppercase tracking-[0.2em] text-[#444] font-black flex items-center gap-2">
             <Circle className="w-1.5 h-1.5 fill-gold text-gold" /> Pipeline
           </h3>
           <span className="text-[9px] text-gold font-black uppercase tracking-widest">{leads.length} Records</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-[#222]" /></div>
        ) : (
          <div className="space-y-2">
            {leads.slice(0, 10).map(lead => (
              <button
                key={lead.id}
                onClick={() => {
                  setSelectedLead(lead);
                  setReplyText('');
                }}
                className={`w-full p-4 text-left rounded-xl transition-all border ${
                  selectedLead?.id === lead.id 
                  ? 'bg-gold/5 border-gold/30 shadow-lg' 
                  : 'bg-[#0A0A0A] border-[#1A1A1A] hover:bg-[#111]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-white truncate max-w-[120px] uppercase tracking-tight">{lead.name}</span>
                  <div className="flex items-center gap-1.5">
                    {getIntentIcon(lead.detectedIntent)}
                  </div>
                </div>
                <p className="text-[9px] text-[#666] line-clamp-1 mb-2 font-medium">"{lead.message}"</p>
                <div className="flex items-center justify-between">
                   <span className="text-[7px] text-[#333] font-black uppercase tracking-tighter">ID: {lead.propertyId}</span>
                   <span className={`text-[7px] font-black uppercase tracking-widest ${
                     lead.status === 'new' ? 'text-gold' : 'text-[#333]'
                   }`}>
                     {lead.status}
                   </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details & Actions */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        <AnimatePresence mode="wait">
          {selectedLead ? (
            <motion.div 
              key={selectedLead.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0A0A] p-6 rounded-xl shadow-2xl border border-[#1A1A1A] h-full flex flex-col"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-sans text-white font-medium tracking-tight uppercase">{selectedLead.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#666]"><Mail className="w-3 h-3 opacity-30" /> {selectedLead.email}</span>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#666]"><Phone className="w-3 h-3 opacity-30" /> {selectedLead.phone || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                   <div className="p-3 bg-[#050505] rounded-xl border border-[#1A1A1A] text-right min-w-[120px]">
                      <p className="text-[8px] text-[#444] font-black uppercase tracking-[0.2em] mb-1">Intent</p>
                      <p className="text-[11px] font-black text-gold uppercase flex items-center justify-end gap-1.5 tracking-widest">
                        {selectedLead.detectedIntent}
                      </p>
                   </div>
                </div>
              </div>

              <div className="bg-[#111]/50 p-5 rounded-xl border border-[#1A1A1A] mb-8 border-l-gold border-l-2 relative overflow-hidden backdrop-blur-sm">
                <p className="text-[8px] text-[#333] font-black uppercase tracking-[0.3em] mb-2">Original Inquiry</p>
                <p className="text-[#A0A0A0] text-sm leading-relaxed font-sans font-medium italic">"{selectedLead.message}"</p>
              </div>

              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <p className="text-[8px] uppercase tracking-widest text-[#444] font-black">AI Response Synthesis</p>
                   </div>
                   <button 
                    onClick={generateAIReply}
                    disabled={isGenerating}
                    className="text-[9px] uppercase font-black tracking-[0.2em] text-gold hover:opacity-80 flex items-center gap-2 transition-all disabled:opacity-30"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Generate
                  </button>
                </div>
                
                <div className="relative flex-1">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Optimization ready..."
                    className="w-full h-full p-6 bg-[#050505] border border-[#1A1A1A] rounded-xl focus:border-gold outline-none text-[#F5F5F5] font-sans text-xs resize-none transition-all shadow-inner"
                  />
                  {!replyText && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-[#222] text-[9px] uppercase tracking-[0.3em] font-black">
                       Protocol Idle
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                   <div className="flex gap-4">
                      <button className="text-[9px] font-black uppercase tracking-widest text-[#444] hover:text-gold transition-colors flex items-center gap-1.5">
                         <Calendar className="w-3 h-3" /> Calendar
                      </button>
                      <button className="text-[9px] font-black uppercase tracking-widest text-[#444] hover:text-gold transition-colors flex items-center gap-1.5">
                         <Tag className="w-3 h-3" /> Details
                      </button>
                   </div>
                   <button className="luxury-button w-full sm:w-auto px-8 py-3 text-[10px] shadow-lg group">
                      Sync via WhatsApp <Send className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#1A1A1A] bg-[#0A0A0A] rounded-2xl border border-dashed border-[#1A1A1A]">
               <Users className="w-8 h-8 mb-4 opacity-20" />
               <p className="text-[8px] uppercase tracking-[0.4em] font-black">Select Inbound Record</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
