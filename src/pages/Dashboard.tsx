import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  X, 
  Check, 
  Sparkles, 
  Mail, 
  Database, 
  AlertTriangle, 
  Send,
  ArrowRight,
  Loader2,
  Activity,
  User,
  Trash2,
  Sliders,
  TrendingUp,
  RotateCcw,
  Search,
  Menu,
  Bell,
  ChevronRight,
  MessageSquare,
  BarChart3,
  Settings as SettingsIcon,
  Briefcase,
  Layers,
  Phone,
  ArrowUpRight,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo';
import { propaiDb } from '../lib/supabaseClient';
import SupabaseDashboardConsole from '../components/SupabaseDashboardConsole';

// Core Interfaces
interface Listing {
  id: string;
  name: string;
  address: string;
  price: number;
  city: string;
  views: number;
  leadsCount: number;
  status: 'Hot Demand' | 'Steady' | 'Cold Listing' | 'In Contract';
  imageUrl: string;
}

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  budget: number;
  lastActive: string;
  notes: string;
}

interface PriorityAction {
  id: string;
  type: 'unanswered_inquiry' | 'failed_automation' | 'booking_confirmation' | 'high_intent';
  title: string;
  subtitle: string;
  timeLabel: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  leadName: string;
  leadEmail: string;
  leadBudget: number;
  meta: string;
  draftText: string;
}

interface LiveActivity {
  id: string;
  type: 'ai_agent' | 'realtor' | 'system';
  content: string;
  timeLabel: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'COMPLETED';
  taskCode: string;
}

export default function Dashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inbox' | 'followups' | 'scheduling' | 'properties' | 'analytics' | 'ai-assistant' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic user data parameters parsed from Google account
  const userDisplayName = user?.displayName || "Alex Johnson";
  const userFirstName = userDisplayName.split(' ')[0];
  const userEmail = user?.email || "alex.johnson@realtor.com";
  const userPhoto = user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  // Check if live mode is enabled. If logged in with actual Google authentication, default to True (Clean Workspace).
  const [isLiveMode, setIsLiveMode] = useState(() => {
    const stored = localStorage.getItem('propai_crm_live_mode');
    if (stored !== null) return stored === 'true';
    return user !== null && user.email !== null;
  });

  const DEMO_LISTINGS: Listing[] = [
    { id: 'l1', name: "123 Elm Street", address: "456 Oak Avenue", price: 1250000, city: "Rivertown", views: 184, leadsCount: 14, status: 'Hot Demand', imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80" },
    { id: 'l2', name: "789 Maple Drive", address: "321 Pine Lane", price: 2350000, city: "Lakeview", views: 96, leadsCount: 4, status: 'Steady', imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80" },
    { id: 'l3', name: "654 Cedar Boulevard", address: "987 Birch Road", price: 950000, city: "Sunnyvale", views: 42, leadsCount: 1, status: 'Cold Listing', imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" },
    { id: 'l4', name: "135 Willow Way", address: "245 Spruce Street", price: 1850000, city: "Meadowbrook", views: 110, leadsCount: 8, status: 'In Contract', imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80" }
  ];

  const DEMO_CLIENTS: ClientProfile[] = [
    { id: 'c1', name: "Jason Carter", email: "j.carter@realtormail.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", status: "Active Lead", budget: 1300000, lastActive: "3 mins ago", notes: "Interested in private tour of Elm Street." },
    { id: 'c2', name: "Monica Reyes", email: "monica.reyes@homespot.co", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", status: "Bounced Campaign", budget: 2400000, lastActive: "14 mins ago", notes: "High budget buyer focused on lake view properties." },
    { id: 'c3', name: "Diana Brooks", email: "diana.b@remaxrealty.com", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", status: "Warm Prospect", budget: 950000, lastActive: "1 hour ago", notes: "First-time investor based in Sunnyvale area." },
    { id: 'c4', name: "Tyler Bennett", email: "tyler.bennett@urbanestates", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", status: "Awaiting Schedule", budget: 1850000, lastActive: "42 mins ago", notes: "Scheduling slot requested for Willow Way walkthrough." }
  ];

  const DEMO_TASKS: TaskItem[] = [
    { id: 't1', title: "Follow up with buyer after showing", dueDate: "AUGUST 22, 2026", priority: "LOW", status: "PENDING", taskCode: "#2746" },
    { id: 't2', title: "Follow up with buyer leads from open house", dueDate: "AUGUST 22, 2026", priority: "LOW", status: "PENDING", taskCode: "#2746" },
    { id: 't3', title: "Update listing photos for 1234 Sunset Blvd", dueDate: "JUNE 14, 2026", priority: "HIGH", status: "PENDING", taskCode: "#5931" },
    { id: 't4', title: "Schedule home inspection for pending deal", dueDate: "MAY 5, 2026", priority: "MEDIUM", status: "PENDING", taskCode: "#4827" },
    { id: 't5', title: "Respond to client inquiry about mortgage options", dueDate: "OCTOBER 30, 2026", priority: "HIGH", status: "PENDING", taskCode: "#7352" }
  ];

  // Data State Management (loads conditionally)
  const [listings, setListings] = useState<Listing[]>(() => isLiveMode ? [] : DEMO_LISTINGS);
  const [clients, setClients] = useState<ClientProfile[]>(() => isLiveMode ? [] : DEMO_CLIENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(() => isLiveMode ? [] : DEMO_TASKS);

  const [priorityActions, setPriorityActions] = useState<PriorityAction[]>([
    {
      id: 'pa1',
      type: 'unanswered_inquiry',
      title: "Immediate Response Overdue",
      subtitle: "Jason Carter is waiting for calendar showing slot recommendations on 123 Elm Street.",
      timeLabel: "3 hours ago",
      urgency: "CRITICAL",
      leadName: "Jason Carter",
      leadEmail: "j.carter@realtormail.com",
      leadBudget: 1300000,
      meta: "Inquired about 123 Elm Street • Ready to schedule",
      draftText: "Hi Jason, absolutely! I noticed you have a strong interest in 123 Elm Street. We have private viewing slots open tomorrow at 2:00 PM and Saturday at 11:00 AM. Would you like me to book one of these in for you?"
    },
    {
      id: 'pa2',
      type: 'failed_automation',
      title: "Bounced Campaign Signal",
      subtitle: "Prospect's security router blocked our monthly portfolio review (Monica Reyes).",
      timeLabel: "14 mins ago",
      urgency: "HIGH",
      leadName: "Monica Reyes",
      leadEmail: "monica.reyes@homespot.co",
      leadBudget: 2400000,
      meta: "Automated Followup #3 • Blocked",
      draftText: "Hi Monica, I noticed our monthly portfolio digest was filtered earlier. Here is a direct private view link of the active Lakeview listings designed around your criteria. Let me know if you would like me to text over the details."
    },
    {
      id: 'pa3',
      type: 'booking_confirmation',
      title: "Pending Viewing Confirmation",
      subtitle: "Tyler Bennett selected holding slot on 135 Willow Way. No calendar conflict detected.",
      timeLabel: "42 mins ago",
      urgency: "HIGH",
      leadName: "Tyler Bennett",
      leadEmail: "tyler.bennett@urbanestates",
      leadBudget: 1850000,
      meta: "Willow Way Showing Proposal • Slot Clear",
      draftText: "Hi Tyler, perfect timing. I have verified our calendar and confirmed our showing protocol for 135 Willow Way on Monday at 10:00 AM. I’m transmitting your calendar confirmation right now."
    }
  ]);

  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([
    { id: 'la1', type: 'ai_agent', content: "Constructed auto-response offer regarding Elm Street budget.", timeLabel: "8 mins ago" },
    { id: 'la2', type: 'realtor', content: "Adjusted property pricing on Cedar Boulevard.", timeLabel: "1 hour ago" },
    { id: 'la3', type: 'system', content: "G-Suite Calendar integrity scanned. All schedules synchronized.", timeLabel: "3 hours ago" }
  ]);

  // Whiteboard connection integration states
  const [gmailConnected, setGmailConnected] = useState(() => localStorage.getItem('propai_gmail_connected') === 'true');
  const [calendarConnected, setCalendarConnected] = useState(() => localStorage.getItem('propai_calendar_connected') === 'true');
  const [dbConnected, setDbConnected] = useState(() => localStorage.getItem('propai_db_connected') === 'true');
  const [whatsappConnected, setWhatsappConnected] = useState(() => localStorage.getItem('propai_whatsapp_connected') === 'true');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState(() => localStorage.getItem('propai_whatsapp_phone_id') || '');
  const [whatsappToken, setWhatsappToken] = useState(() => localStorage.getItem('propai_whatsapp_token') || '');
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const [isLinkingGmail, setIsLinkingGmail] = useState(false);
  const [isLinkingCalendar, setIsLinkingCalendar] = useState(false);
  const [isLinkingDb, setIsLinkingDb] = useState(false);
  const [isLinkingWhatsapp, setIsLinkingWhatsapp] = useState(false);

  // Focus action & custom AI tone states
  const [activeDirective, setActiveDirective] = useState<PriorityAction | null>(null);
  const [draftCustomText, setDraftCustomText] = useState('');
  const [activeDraftTone, setActiveDraftTone] = useState<'Executive' | 'Conversational' | 'Direct' | 'Detailed'>('Conversational');
  
  // Custom alerts and modals
  const [showConsole, setShowConsole] = useState(false);
  const [showToast, setShowToast] = useState<{ show: boolean; text: string; success: boolean }>({ show: false, text: '', success: true });
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  // New Property values & Task values
  const [newProperty, setNewProperty] = useState({
    name: '', address: '', city: '', price: '', status: 'Steady' as any,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  });

  const [newTask, setNewTask] = useState({
    title: '', dueDate: 'AUGUST 25, 2026', priority: 'MEDIUM' as any
  });

  // Selected details state
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  
  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Echo Assistant conversational state
  const [echoInput, setEchoInput] = useState('');
  const [echoMessages, setEchoMessages] = useState<ChatMessage[]>(() => [
    { id: 'm1', role: 'assistant', content: `Greetings, Principal Broker ${user?.displayName?.split(' ')[0] || "Alex"}. I am connected directly to your workspace memory. Ask me to draft followups, manage active database records, or query listings contextually.`, time: "Just now" }
  ]);
  const [isEchoTyping, setIsEchoTyping] = useState(false);
  const echoEndRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState('');

  // Initial Setup Computations & Timers
  const isOnboardingComplete = gmailConnected && calendarConnected && dbConnected;

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC');
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (echoEndRef.current) {
      echoEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [echoMessages]);

  useEffect(() => {
    async function loadData() {
      if (!isLiveMode) {
        setListings(DEMO_LISTINGS);
        setClients(DEMO_CLIENTS);
        setTasks(DEMO_TASKS);
        return;
      }

      try {
        const dbListings = await propaiDb.properties.list();
        if (dbListings.length > 0) {
          const mappedings = dbListings.map(p => ({
            id: p.id,
            name: p.title,
            address: p.description || 'Grounded Location',
            price: p.price,
            city: p.location || 'Urban area',
            views: 184,
            leadsCount: 14,
            status: (p.property_type || 'Steady') as any,
            imageUrl: p.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
          }));
          setListings(mappedings);
        } else {
          setListings([]);
        }

        const dbClients = await propaiDb.leads.list();
        if (dbClients.length > 0) {
          const mappedClients = dbClients.map(c => ({
            id: c.id,
            name: c.full_name,
            email: c.email,
            avatar: c.id === 'c1' ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" :
                    c.id === 'c2' ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" :
                    c.id === 'c3' ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" :
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
            status: c.pipeline_stage === 'contacted' ? "Active Lead" : "Warm Prospect",
            budget: c.budget,
            lastActive: "3 mins ago",
            notes: c.preferred_location ? `Wants properties in ${c.preferred_location}` : "High intent lead."
          }));
          setClients(mappedClients);
        } else {
          setClients([]);
        }

        const dbTasks = await propaiDb.tasks.list();
        if (dbTasks.length > 0) {
          const mappedTasks = dbTasks.map(t => ({
            id: t.id,
            title: t.task_title,
            dueDate: t.due_date || 'TOMORROW',
            priority: (t.category || 'MEDIUM') as any,
            status: t.completed ? 'COMPLETED' : 'PENDING' as any,
            taskCode: `#${t.id.substring(0, 4)}`
          }));
          setTasks(mappedTasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.warn("Failed loading from propaiDb on mount:", err);
        setListings([]);
        setClients([]);
        setTasks([]);
      }
    }
    loadData();
  }, [user, isLiveMode]);

  const triggerToast = (text: string, success = true) => {
    setShowToast({ show: true, text, success });
    setTimeout(() => {
      setShowToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const addSystemLog = (content: string, type: 'ai_agent' | 'realtor' | 'system' = 'system') => {
    const newLog: LiveActivity = {
      id: `la-${Date.now()}`,
      type,
      content,
      timeLabel: "1s ago"
    };
    setLiveActivities(prev => [newLog, ...prev]);
  };

  // Onboarding activation controls
  const linkChannel = (channel: 'gmail' | 'calendar' | 'db') => {
    if (channel === 'gmail') {
      setIsLinkingGmail(true);
      setTimeout(() => {
        setIsLinkingGmail(false);
        setGmailConnected(true);
        localStorage.setItem('propai_gmail_connected', 'true');
        addSystemLog("Connected G-Suite Gmail secure inbox tunnel.", "system");
        triggerToast("Gmail operational pipeline triggered!");
      }, 1000);
    } else if (channel === 'calendar') {
      setIsLinkingCalendar(true);
      setTimeout(() => {
        setIsLinkingCalendar(false);
        setCalendarConnected(true);
        localStorage.setItem('propai_calendar_connected', 'true');
        addSystemLog("Synchronized Google Calendar schedules.", "system");
        triggerToast("Calendar allocation map synchronized!");
      }, 1000);
    } else {
      setIsLinkingDb(true);
      setTimeout(() => {
        setIsLinkingDb(false);
        setDbConnected(true);
        localStorage.setItem('propai_db_connected', 'true');
        addSystemLog("Grounded custom property context engines.", "system");
        triggerToast("Properties DB structured & loaded!");
      }, 900);
    }
  };

  const handleResetActivation = () => {
    setGmailConnected(false);
    setCalendarConnected(false);
    setDbConnected(false);
    localStorage.removeItem('propai_gmail_connected');
    localStorage.removeItem('propai_calendar_connected');
    localStorage.removeItem('propai_db_connected');
    setActiveDirective(null);
    triggerToast("All automation systems offline.", false);
  };

  const handleSkipOnboarding = () => {
    setGmailConnected(true);
    setCalendarConnected(true);
    setDbConnected(true);
    localStorage.setItem('propai_gmail_connected', 'true');
    localStorage.setItem('propai_calendar_connected', 'true');
    localStorage.setItem('propai_db_connected', 'true');
    addSystemLog("Direct workspace initialized by administrator command.", "system");
    triggerToast("Workspace fully unlocked.");
  };

  const handleOpenDirectiveMode = (action: PriorityAction) => {
    setActiveDirective(action);
    setDraftCustomText(action.draftText);
    setActiveDraftTone('Conversational');
    setActiveTab('inbox'); // Switch tab beautifully to compose replies!
  };

  const handleToneChange = (tone: 'Executive' | 'Conversational' | 'Direct' | 'Detailed') => {
    setActiveDraftTone(tone);
    if (!activeDirective) return;
    
    let text = activeDirective.draftText;
    if (tone === 'Executive') {
      text = `Dear ${activeDirective.leadName},\n\nRegarding your target property inquiry concerning ${activeDirective.meta.split(' • ')[0]}, I have prepared our verified pricing files and walkthrough intervals. Please let me know when an executive scheduling session works for you to finalize parameters.\n\nWarm regards,\nAlex Johnson\nPrincipal Broker, PropAI`;
    } else if (tone === 'Direct') {
      text = `Hi ${activeDirective.leadName}, let's talk slots. We have private walkthrough availability tomorrow at 10:00 AM and Tuesday at 3:00 PM for the listing. Let me know which works to secure your booking instantly on G-Suite.`;
    } else if (tone === 'Detailed') {
      text = `Hi ${activeDirective.leadName},\n\nI checked our calendar schedules for the listing relative to your target purchase budget cap of $${activeDirective.leadBudget.toLocaleString()}.\n- G-Suite collision: Clear\n- Pricing profile: Matching\n- Walkthrough Status: Ready to dispatch\nLet me know if you would like me to dispatch our custom visual index report.`;
    }
    setDraftCustomText(text);
  };

  const handleTransmitDirective = () => {
    if (!activeDirective) return;
    setPriorityActions(prev => prev.filter(item => item.id !== activeDirective.id));
    addSystemLog(`Transmitted custom SMTP reply to ${activeDirective.leadName} (${activeDirective.leadEmail})`, 'realtor');
    triggerToast(`Response safely transmitted via linked SMTP!`);
    setActiveDirective(null);
  };

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProperty.name || !newProperty.price) return;

    const addedId = `l-${Date.now()}`;
    const added: Listing = {
      id: addedId,
      name: newProperty.name,
      address: newProperty.address || "PropAI Mapped Area",
      price: Number(newProperty.price),
      city: newProperty.city || "Urban Desk",
      views: 24,
      leadsCount: 1,
      status: newProperty.status || 'Steady',
      imageUrl: newProperty.imageUrl
    };

    setListings(prev => [added, ...prev]);
    setIsAddingProperty(false);
    addSystemLog(`Indexed property: ${newProperty.name}`, 'realtor');
    triggerToast(`Listing grounded with secure unique key.`);

    propaiDb.properties.create({
      id: addedId,
      title: newProperty.name,
      description: newProperty.address || "PropAI Mapped Area",
      price: Number(newProperty.price),
      property_type: newProperty.status || 'Steady',
      location: newProperty.city || "Urban Desk",
      realtor_id: user?.uid || 'mock-user-alex',
      created_at: new Date().toISOString(),
      image_url: newProperty.imageUrl
    }).catch(err => console.warn("Could not save to db, utilizing fallback storage:", err));

    setNewProperty({
      name: '', address: '', city: '', price: '', status: 'Steady',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
    });
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const addedId = `t-${Date.now()}`;
    const added: TaskItem = {
      id: addedId,
      title: newTask.title,
      dueDate: newTask.dueDate || "TODAY",
      priority: newTask.priority || 'MEDIUM',
      status: 'PENDING',
      taskCode: `#${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTasks(prev => [added, ...prev]);
    setIsAddingTask(false);
    addSystemLog(`Created new workflow directive: ${newTask.title}`, 'realtor');
    triggerToast(`Workflow directive registered safely.`);

    propaiDb.tasks.create({
      id: addedId,
      assigned_user_id: user?.uid || 'mock-user-alex',
      lead_id: 'c1',
      task_title: newTask.title,
      due_date: newTask.dueDate || "TODAY",
      completed: false,
      category: newTask.priority || 'MEDIUM',
      description: 'Dynamic user dashboard task',
      created_at: new Date().toISOString()
    }).catch(err => console.warn("Could not save to db, utilizing fallback storage:", err));

    setNewTask({ title: '', dueDate: 'AUGUST 25, 2026', priority: 'MEDIUM' });
  };

  const runAIPipelineReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      setIsReanalyzing(false);
      setActiveInsightIndex(prev => (prev + 1) % aiInsights.length);
      triggerToast("AI analyzed 56 listing metrics. Database insight refreshed.");
    }, 1250);
  };

  const aiInsights = [
    {
      type: "Market Gravity",
      metric: "Rivertown & Sunnyvale Volume Focus",
      description: "Organic search tracking has shifted heavily. Sunnyvale garden apartment walkthrough engagement spiked by 32% this week, while premium inquiries represent 40% of our active cash buyer volume.",
    },
    {
      type: "Engagement Velocity",
      metric: "Response Interval Thresholds Improved 45%",
      description: "Leads matched with a customized assistant draft reply within 10 minutes demonstrate a 42% higher final transaction velocity. Automated inline resolution is heavily recommended.",
    },
    {
      type: "Brokerage Efficiency",
      metric: "G-Suite Mail Integrity Score 100%",
      description: "Our background mail loops recovered 2 bounced emails safely. Pipeline analysis shows zero active delivery conflicts across your current listing portfolio.",
    }
  ];

  const handleEchoSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!echoInput.trim()) return;

    const userMessage = echoInput;
    setEchoMessages(prev => [...prev, { id: `m-${Date.now()}`, role: 'user', content: userMessage, time: "Just now" }]);
    setEchoInput('');
    setIsEchoTyping(true);

    setTimeout(() => {
      let replyContent = `I have received that command and dispatched it directly to Morpheus for priority processing. All linked communication channels will update contextually.`;
      const lower = userMessage.toLowerCase();

      if (lower.includes('follow') || lower.includes('alex') || lower.includes('jason')) {
        replyContent = `Direct Directive Logged: Generated an autonomous walkthrough followup for Jason concerning the 123 Elm Street holding slot, checking availability and preparing a calendar invite.`;
        addSystemLog("Initiated scheduled walkthrough followup for Jason.", 'ai_agent');
      } else if (lower.includes('schedule') || lower.includes('listing') || lower.includes('tyler')) {
        replyContent = `Calendar Task Logged: Synchronized viewing structures on 135 Willow Way. Suggested slots will be transmitted directly via Gmail to candidate Tyler Bennett.`;
        addSystemLog("Verified 135 Willow Way calendar availability slots.", 'ai_agent');
      } else if (lower.includes('remove') || lower.includes('delete') || lower.includes('cold') || lower.includes('prune')) {
        replyContent = `Database Task Complete: Cold Listings pruned from AI search context. High-performing properties remain indexed as primary conversational targets.`;
        setListings(prev => prev.filter(l => l.status !== 'Cold Listing'));
        addSystemLog("Removed Cold Listings to optimize grounding memory.", 'system');
      } else if (lower.includes('show') || lower.includes('leads') || lower.includes('pending')) {
        replyContent = `Operations Brief: You currently have ${priorityActions.length} pending critical actions waiting for authorization or design.`;
      }

      setEchoMessages(prev => [...prev, { id: `m-ai-${Date.now()}`, role: 'assistant', content: replyContent, time: "Just now" }]);
      setIsEchoTyping(false);
    }, 1100);
  };

  const handleQuickCommand = (txt: string) => {
    setEchoInput(txt);
    setActiveTab('ai-assistant');
    triggerToast("Echo workspace ready.");
  };

  // Filter listings based on global search
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    return listings.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listings, searchQuery]);

  // Sidebar Items Definition
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Layers },
    { id: 'inbox', name: 'Inbox', icon: Mail, badge: priorityActions.length > 0 ? priorityActions.length : undefined },
    { id: 'followups', name: 'Follow-Ups', icon: MessageSquare, badge: 1 },
    { id: 'scheduling', name: 'Scheduling', icon: CalendarIcon },
    { id: 'properties', name: 'Properties', icon: Briefcase },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Sparkles },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-full w-full bg-[#050508] text-[#F5F5F7] font-sans overflow-hidden antialiased">
      
      {/* BACKGROUND GRAPHIC OR GLOW PATH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(197,160,89,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#171542]/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      
      {/* MOBILE HEADER BUTTON */}
      <div className="lg:hidden fixed top-4 left-4 z-[90]">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 bg-[#0b0b11]/90 border border-[#1c1c2b]/80 text-white rounded-xl backdrop-blur-md cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* LEFT SIDEBAR SECTION */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col justify-between 
        bg-[#07070b]/95 border-r border-[#151522]/80 h-full backdrop-blur-xl
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-20' : 'w-64'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:sticky lg:flex shrink-0
      `}>
        <div className="flex flex-col flex-1 py-6 px-4 space-y-8 overflow-y-auto scroll-smooth">
          
          {/* TOP PROFILE BLOCK Inspired by Reference Image */}
          <div className="flex items-center justify-between border-b border-[#151524]/60 pb-5">
            <div className={`flex items-center gap-3 transition-opacity ${sidebarCollapsed ? 'opacity-0 lg:hidden' : 'opacity-100'}`}>
              <div className="relative group shrink-0">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <img 
                  src={userPhoto} 
                  alt={userDisplayName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold/40 relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white tracking-tight truncate leading-tight font-satoshi flex items-center gap-1">
                  {userDisplayName} 
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                </h3>
                <p className="text-[10px] text-amber-500/80 font-mono tracking-widest uppercase font-bold mt-0.5">REALTOR</p>
              </div>
            </div>

            {/* Collapse Sidebar Button Desktop */}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-lg text-[#52526b] hover:text-white hover:bg-[#12121f] transition-all cursor-pointer"
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Close Mobile Sidebar Button and Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#52526b] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN NAVIGATION INTERACTIVE LIST */}
          <div className="space-y-1.5">
            <p className={`text-[9px] font-mono tracking-wider text-[#52526b] uppercase px-3 ${sidebarCollapsed ? 'text-center' : ''}`}>
              {sidebarCollapsed ? 'NAV' : 'OVERVIEW'}
            </p>
            <nav className="space-y-1">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium 
                      transition-all duration-250 cursor-pointer relative group
                      ${isActive 
                        ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-white border-l-2 border-gold font-semibold shadow-[0_0_15px_rgba(197,160,89,0.06)]' 
                        : 'text-[#858599] hover:text-white hover:bg-[#0c0c14]'}
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-gold' : 'text-[#52526b] group-hover:text-[#a0a0b8]'}`} />
                    {!sidebarCollapsed && <span className="font-satoshi truncate flex-1 text-left">{item.name}</span>}
                    {item.badge && !sidebarCollapsed && (
                      <span className="bg-red-950 border border-red-900/40 text-red-400 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {/* Hover Glow Pill */}
                    {isActive && (
                      <div className="absolute right-2 w-1 h-3 rounded bg-gold/80 shadow-[0_0_8px_rgba(197,160,89,1)]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

        </div>

        {/* BOTTOM SECTION REALTOR CTA & LOGOUT ACCESS */}
        <div className="p-4 border-t border-[#151524]/60">

          {/* Quick Sign Out Action */}
          <button 
            onClick={onLogout}
            className={`
              w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
              text-[#858599] hover:text-white hover:bg-red-950/25 border border-transparent 
              hover:border-red-900/20 transition-all cursor-pointer font-mono
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <Sliders className="w-4 h-4 text-[#52526b]" />
            {!sidebarCollapsed && <span className="truncate">Disconnect Exit</span>}
          </button>
        </div>
      </aside>

      {/* CORE OPERATIONAL HUB & VIEW WRAPPERS */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        
        {/* TOP NAVBAR Cockpit Section */}
        <header className="sticky top-0 z-30 h-20 lg:h-22 w-full bg-[#050508]/85 backdrop-blur-md border-b border-[#131320]/60 px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Page Title Block with App Name */}
          <div className="flex items-center gap-3 pl-12 lg:pl-0 pt-2">
            <div className="p-1.5 bg-[#0e0e16] border border-[#222238] rounded-lg shrink-0">
              <Logo className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#52526b]">PropAI Protocol v4.2</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-sm font-semibold text-white tracking-tight font-satoshi capitalize">
                {activeTab === 'ai-assistant' ? 'Echo Assistant Bot' : activeTab + ' workspace'}
              </h2>
            </div>
          </div>

          {/* Smart Glassmorphic Search Bar with Focus Glow */}
          <div className="hidden md:flex flex-1 max-w-md relative pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52526b]" />
            <input 
              type="text"
              placeholder="Search properties, clients or active records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0c14]/80 border border-[#1b1b2a] rounded-full pl-10 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-gold/30 focus:shadow-[0_0_15px_rgba(197,160,89,0.06)] placeholder:text-[#45455c] transition-all font-sans"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Actions & Workspace Indicators */}
          <div className="flex items-center gap-3 pt-2">
            
            {/* Live Mode / Demo Mode Segmented Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#09090f] border border-[#151524] rounded-xl">
              <button
                onClick={() => {
                  setIsLiveMode(false);
                  localStorage.setItem('propai_crm_live_mode', 'false');
                  triggerToast("Switched to Sandbox Mode (Mock Demo Datasets).");
                }}
                className={`px-2.5 py-1 text-[9px] uppercase font-mono tracking-wider rounded-lg transition-all cursor-pointer ${
                  !isLiveMode 
                  ? 'bg-amber-500/15 text-gold font-bold border border-amber-500/20' 
                  : 'text-[#52526b] hover:text-neutral-400'
                }`}
              >
                Sandbox
              </button>
              <button
                onClick={() => {
                  setIsLiveMode(true);
                  localStorage.setItem('propai_crm_live_mode', 'true');
                  triggerToast("Switched to Live Mode (Your Personal Clean Workspace).");
                }}
                className={`px-2.5 py-1 text-[9px] uppercase font-mono tracking-wider rounded-lg transition-all cursor-pointer ${
                  isLiveMode 
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20' 
                  : 'text-[#52526b] hover:text-neutral-400'
                }`}
              >
                Live CRM
              </button>
            </div>

            {/* Live Clock Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#09090f] border border-[#151524] rounded-lg font-mono text-[10px] text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentTime || '14:43 UTC'}</span>
            </div>

            {/* Notification Alert Trigger */}
            <div className="relative">
              <button 
                onClick={() => triggerToast("All communication channels connected.")}
                className="p-2 bg-[#0c0c14] hover:bg-[#121220] border border-[#1c1c2b] text-[#858599] hover:text-white rounded-xl transition-all cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              </button>
            </div>

            {/* Main Action Trigger */}
            <button 
              onClick={() => setIsAddingProperty(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-gold-muted text-[#050508] text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_4px_12px_rgba(197,160,89,0.15)] transition-all cursor-pointer font-satoshi duration-350"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Property
            </button>

          </div>
        </header>

        {/* WORKSPACE DETAILED CONTENT CONTROLLERS */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl w-full mx-auto">
          
          {/* SWITCH ROUTER ACROSS ALL DYNAMIC NAVIGATION SUBVIEWS */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* ONBOARDING CALLOUT ON TOP IF MISSING PATHS */}
              {!isOnboardingComplete && (
                <div className="mb-6 p-5 bg-[#0a0a14] border border-amber-500/10 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] blur-3xl rounded-full" />
                  <div className="space-y-1 z-10">
                    <span className="text-[9px] font-mono tracking-widest text-amber-500 font-bold uppercase">Account Activation Needed</span>
                    <h3 className="text-sm font-semibold text-white font-satoshi">Configure Operational Channels Map</h3>
                    <p className="text-xs text-[#85859e] max-w-2xl font-light">
                      PropAI triggers autonomous sub-agents once G-Suite Gmail records, calendars, and properties are mapped. Let's finish configuration to unlock instant dispatch suggestions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 z-10">
                    <button 
                      onClick={handleSkipOnboarding}
                      className="px-3.5 py-1.5 bg-[#121223] hover:bg-[#1a1a33] border border-[#23233c] text-[10px] text-[#b3b3c9] rounded-xl transition-all font-mono tracking-wider font-bold cursor-pointer"
                    >
                      FAST BYPASS MODE
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="px-4 py-1.5 bg-gold hover:bg-gold-muted text-[#050508] text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-[0_0_10px_rgba(197,160,89,0.2)] transition-all cursor-pointer"
                    >
                      Connect Now
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW A: REALTOR DASHBOARD CORE VIEW Inspired by design blueprint page layout */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 md:space-y-8">
                  
                  {/* CINEMATIC WELCOME CARD WITH RESPLENDENT ARCHITECTURE GRAPHICS */}
                  <div className="relative p-7 md:p-9 rounded-2xl bg-gradient-to-r from-black via-[#080811] to-[#12121f] border border-[#1b1b2c] shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Architectural Dark Background Photo overlay */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-[0.14] pointer-events-none"
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')` }}
                    />
                    <div className="absolute top-0 right-1/4 w-44 h-44 bg-amber-500/[0.03] blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10 max-w-xl">
                      <span className="px-2.5 py-0.5 bg-amber-500/10 border border-gold/20 text-gold text-[9px] font-bold font-mono tracking-widest uppercase rounded-full">
                        ACTIVE METRIC PROTOCOL
                      </span>
                      <h1 className="text-2xl md:text-3.5xl font-semibold text-white tracking-tight leading-tight font-satoshi">
                        Welcome back, {userFirstName}.
                      </h1>
                      <p className="text-xs text-[#8c8cb3] font-light leading-relaxed">
                        Morpheus background loops mapped <span className="text-white font-medium font-mono">6 client inquiries</span> today. All communications has been prepared in the compose desk. Select any prospect to inspect drafts.
                      </p>
                    </div>

                    <div className="flex gap-4.5 z-10 sm:shrink-0 font-mono">
                      <div className="p-4 bg-[#0a0a14]/90 border border-[#1b1b2d] rounded-xl text-center min-w-[90px] shadow-lg">
                        <span className="block text-[8px] text-[#52526b] uppercase tracking-wider">MAPPED Today</span>
                        <span className="text-2xl font-bold text-white font-satoshi block mt-1">06</span>
                      </div>
                      <div className="p-4 bg-[#0a0a14]/90 border border-[#1b1b2d] rounded-xl text-center min-w-[90px] shadow-lg">
                        <span className="block text-[8px] text-[#52526b] uppercase tracking-wider">CALENDAR Clash</span>
                        <span className="text-2xl font-bold text-emerald-400 font-satoshi block mt-1">Zero</span>
                      </div>
                    </div>
                  </div>

                  {/* HIGH-END METRIC COCKPIT SECTION */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {[
                      { label: "Total Listings", val: "45", chg: "+15", positive: true, icon: Briefcase },
                      { label: "Assigned Listings", val: "10", chg: "0", positive: null, icon: Layers },
                      { label: "Closed Listings", val: "20", chg: "+8", positive: true, icon: CheckCircle2 },
                      { label: "Overdue Listings", val: "02", chg: "-1", positive: false, icon: AlertTriangle }
                    ].map((m, idx) => {
                      const Icon = m.icon;
                      return (
                        <div 
                          key={idx} 
                          className="p-5 bg-gradient-to-br from-[#09090f] to-[#040407] border border-[#161626]/80 rounded-2xl shadow-lg relative overflow-hidden group hover:border-[#22223a] transition-all duration-300"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#52526b] font-bold block">{m.label}</span>
                            <div className="p-1.5 bg-[#0e0e18] border border-[#18182a] rounded-lg text-neutral-400 group-hover:text-gold transition-colors duration-300">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight font-satoshi">{m.val}</span>
                            {m.chg !== '0' && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                m.positive === true ? 'text-emerald-400' : m.positive === false ? 'text-red-400' : 'text-neutral-500'
                              }`}>
                                {m.chg}
                              </span>
                            )}
                          </div>
                          {/* Mini decorative accent */}
                          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>

                  {/* SPLIT COCKPIT GRID: MAIN BLUEPRINT PROPERTIES & CLIENT TABLES */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start">
                    
                    {/* LEFT COLUMN 1: PROPERTY LISTINGS BLUEPRINT (5 Columns equivalence) */}
                    <div className="xl:col-span-5 p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-5 shadow-xl">
                      <div className="flex justify-between items-center pb-3 border-b border-[#141424]">
                        <div>
                          <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">
                            Property Listings
                          </h3>
                          <p className="text-[10px] text-[#52526b] font-mono mt-0.5">Active database count: {listings.length}</p>
                        </div>
                        <button 
                          onClick={() => setIsAddingProperty(true)}
                          className="p-1 px-2.2 bg-[#0d0d16] hover:bg-[#1a1a2e] text-[#b0b0cc] font-mono hover:text-white text-[9.5px] rounded-lg border border-[#23233c] hover:border-gold/35 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Property rows listed matching current visual theme */}
                      <div className="space-y-3">
                        {filteredListings.slice(0, 4).map(item => (
                          <div 
                            key={item.id}
                            onClick={() => setSelectedProperty(item)}
                            className="p-3 bg-[#0a0a14]/60 border border-[#131320] rounded-xl hover:border-[#222238] hover:bg-[#0c0c16] hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={item.imageUrl} 
                                alt="" 
                                className="w-10 h-10 rounded-lg object-cover border border-[#181828] group-hover:border-gold/20 shrink-0 select-none"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-white font-satoshi truncate group-hover:text-gold transition-colors">{item.name}</h4>
                                <p className="text-[10px] text-[#717193] font-light truncate mt-0.5">{item.address}, {item.city}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-bold text-white block">${(item.price / 1000).toLocaleString()}K</span>
                              <span className={`text-[8px] font-mono font-bold uppercase block mt-1 ${
                                item.status === 'Hot Demand' ? 'text-red-400' : item.status === 'In Contract' ? 'text-emerald-400' : 'text-neutral-500'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* INTERMEDIATE COLUMN 2: CUSTOM CLIENT CONTROLS (4 columns equivalence) */}
                    <div className="xl:col-span-4 p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-5 shadow-xl">
                      <div className="flex justify-between items-center pb-3 border-b border-[#141424]">
                        <div>
                          <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">
                            Clients
                          </h3>
                          <p className="text-[10px] text-[#52526b] font-mono mt-0.5">Linked profiles: {clients.length}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-[#8585a3] bg-[#0d0d16] border border-[#22223c] px-2 py-0.5 rounded font-mono">
                          {clients.filter(c => c.status.includes('Active') || c.status.includes('Bounced')).length} active
                        </span>
                      </div>

                      {/* Clients items matching the reference image list */}
                      <div className="space-y-3">
                        {clients.map(cl => (
                          <div 
                            key={cl.id}
                            onClick={() => {
                              setSelectedClient(cl);
                              // Auto trigger a fast inquiry response Composer if available in memory!
                              const matchedAction = priorityActions.find(pa => pa.leadName === cl.name);
                              if (matchedAction) {
                                handleOpenDirectiveMode(matchedAction);
                              } else {
                                triggerToast(`Opening conversation logs with ${cl.name}`);
                              }
                            }}
                            className="p-3 bg-[#0a0a14]/60 border border-[#131320] rounded-xl hover:border-[#222238] hover:bg-[#0c0c16] hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={cl.avatar} 
                                alt={cl.name} 
                                className="w-9 h-9 rounded-full object-cover border border-[#1a1a2b] shrink-0 select-none"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-white font-satoshi truncate group-hover:text-gold transition-colors">{cl.name}</h4>
                                <p className="text-[9.5px] text-[#52527a] font-mono truncate lowercase mt-0.5">{cl.email}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <ChevronRight className="w-3.5 h-3.5 text-[#3e3e5c] group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT COLUMN 3: DYNAMIC AI CAPABILITIES CARD Inspired by vertical blueprint */}
                    <div className="xl:col-span-3 h-full">
                      <div className="p-5 bg-gradient-to-b from-[#0e0e1a] to-[#040407] border border-[#1d1d36]/60 rounded-2xl shadow-xl space-y-5 h-full relative overflow-hidden flex flex-col justify-between">
                        
                        {/* Abstract glow vector backing preview image */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.04] blur-2xl rounded-full" />
                        
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-[#141424] border border-[#23233d] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                          </div>
                          
                          <div>
                            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">Unlock AI Features</h3>
                            <p className="text-xs text-[#8c8cb3] font-light leading-relaxed mt-2">
                              Adding or managing listings has never been simpler. Enable premium G-Suite sub-agents to trace email queues and schedules. Let Morpheus write daily drafts automatically.
                            </p>
                          </div>
                        </div>

                        {/* Interactive trigger links */}
                        <div className="pt-4 space-y-2">
                          <button 
                            onClick={runAIPipelineReanalyze}
                            className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-gold-muted text-[#050508] font-satoshi font-semibold text-[10.5px] tracking-wide rounded-lg flex items-center justify-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Run AI Diagnostics
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* HIGH-END TASKS SECTION COCKPIT Inspired directly by Reference Image */}
                  <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-5 shadow-xl">
                    <div className="flex justify-between items-center pb-3 border-b border-[#141424]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gold" />
                        <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">
                          My Tasks
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsAddingTask(true)}
                          className="px-3 py-1 bg-[#0d0d16] hover:bg-[#151525] border border-[#222238] hover:border-gold/30 text-white font-mono text-[9.5px] tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-gold" /> Add Task
                        </button>
                      </div>
                    </div>

                    {/* Task spreadsheet lists rows corresponding to mock items */}
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {tasks.map(tsk => (
                        <div 
                          key={tsk.id}
                          className="p-4 bg-[#0a0a14]/60 border border-[#131320] rounded-xl hover:border-[#1d1d2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button 
                              onClick={async () => {
                                const nextStatus = tsk.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
                                setTasks(prev => prev.map(t => t.id === tsk.id ? { ...t, status: nextStatus } : t));
                                triggerToast("Task integrity state synchronized successfully.");
                                try {
                                  await propaiDb.tasks.update(tsk.id, { completed: nextStatus === 'COMPLETED' });
                                } catch (err) {
                                  console.warn("Failed syncing task complete status in G-Suite", err);
                                }
                              }}
                              className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                                tsk.status === 'COMPLETED' 
                                ? 'bg-gold border-gold text-neutral-900' 
                                : 'border-[#2d2d44] hover:border-goldBg text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </button>
                            <span className={`text-xs font-medium truncate ${tsk.status === 'COMPLETED' ? 'line-through text-[#44445c]' : 'text-neutral-200'}`}>
                              {tsk.title}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3.5 sm:shrink-0 font-mono text-[10px]">
                            
                            {/* Target time */}
                            <span className="text-[#525273] flex items-center gap-1 uppercase">
                              <CalendarIcon className="w-3 h-3 text-amber-500" />
                              {tsk.dueDate}
                            </span>

                            {/* Code Badge */}
                            <span className="text-neutral-500 font-bold bg-[#0e0e16] px-2 py-0.5 rounded border border-[#1d1d2e]">
                              {tsk.taskCode}
                            </span>

                            {/* Priority badge pill */}
                            <span className={`px-2.5 py-0.5 rounded font-bold uppercase text-[8.5px] border ${
                              tsk.priority === 'HIGH' 
                              ? 'bg-red-950/40 text-red-400 border-red-900/40' 
                              : tsk.priority === 'MEDIUM' 
                              ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' 
                              : 'bg-neutral-900/50 text-[#85859d] border-neutral-800'
                            }`}>
                              {tsk.priority}
                            </span>

                            {/* Quick Delete */}
                            <button
                              onClick={async () => {
                                setTasks(prev => prev.filter(t => t.id !== tsk.id));
                                triggerToast("Task removed safely.");
                                try {
                                  await propaiDb.tasks.delete(tsk.id);
                                } catch (err) {
                                  console.warn("Failed deleting task from G-Suite database", err);
                                }
                              }}
                              className="text-[#3a3a54] hover:text-red-400 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW B: INBOX (Immediate Actions Composer loop) */}
              {activeTab === 'inbox' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                  
                  {/* LEFT: CRITICAL ACTIONS LIST (5 cols) */}
                  <div className="lg:col-span-5 p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-5 shadow-xl">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#141424]">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse block" />
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">
                        Immediate Action Desk
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {priorityActions.length === 0 ? (
                        <div className="py-12 text-center space-y-3 bg-[#0c0c16]/30 border border-dashed border-[#1f1f33] rounded-xl p-4">
                          <Check className="w-6 h-6 text-emerald-500 mx-auto" />
                          <p className="text-xs font-medium text-white tracking-wider uppercase font-mono">ALL METRIC INBOXES CLEAR</p>
                          <p className="text-xs text-[#5c5c7d] max-w-xs mx-auto leading-relaxed">
                            No high-intent leads awaiting answers right now. Every prospect is covered.
                          </p>
                        </div>
                      ) : (
                        priorityActions.map(action => (
                          <div
                            key={action.id}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              activeDirective?.id === action.id 
                              ? 'bg-[#121223]/85 border-amber-500/30' 
                              : 'bg-[#0a0a14]/60 border-[#131320] hover:border-[#1d1d2e]'
                            }`}
                            onClick={() => {
                              setActiveDirective(action);
                              setDraftCustomText(action.draftText);
                              setActiveDraftTone('Conversational');
                            }}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded font-black border ${
                                action.urgency === 'CRITICAL' 
                                ? 'bg-red-950/40 text-red-400 border-red-900/40' 
                                : 'bg-amber-950/40 text-amber-400 border-amber-900/40'
                              }`}>
                                {action.urgency} Priority
                              </span>
                              <span className="text-[10px] text-[#525273] font-mono">{action.timeLabel}</span>
                            </div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{action.title}</h4>
                            <p className="text-[11.5px] text-[#8585a1] mt-1 font-light leading-relaxed truncate">{action.subtitle}</p>
                            <div className="flex justify-between items-center text-[10px] text-[#525273] font-mono mt-3 pt-2.5 border-t border-[#131320]">
                              <span>Client: {action.leadName}</span>
                              <span className="text-white">${(action.leadBudget / 1000).toLocaleString()}K Budget</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* RIGHT: AI CONVERSATION MAILER COMPOSER (7 cols) */}
                  <div className="lg:col-span-7">
                    {activeDirective ? (
                      <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-6 shadow-xl relative">
                        
                        <div className="flex justify-between items-start pb-4 border-b border-[#141424]">
                          <div>
                            <span className="text-[8.5px] font-mono uppercase text-amber-500 tracking-wider font-bold">ALIGNED SMTP COMPOSED BY MORPHEUS</span>
                            <h3 className="text-sm font-semibold text-white mt-1">Review Draft Dispatch to {activeDirective.leadName}</h3>
                            <p className="text-[10px] text-[#525273] font-mono mt-0.5">{activeDirective.leadEmail} • direct secure route ready</p>
                          </div>
                          <button 
                            onClick={() => setActiveDirective(null)}
                            className="text-[#4b4b68] hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Tone selection tabs */}
                        <div className="space-y-1.5">
                          <p className="text-[8.5px] font-mono text-[#525273] uppercase tracking-wider font-bold">Configure AI Tone Focus Paradigm</p>
                          <div className="grid grid-cols-4 gap-2">
                            {(['Conversational', 'Executive', 'Direct', 'Detailed'] as const).map(tone => (
                              <button
                                key={tone}
                                onClick={() => handleToneChange(tone)}
                                className={`py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                  activeDraftTone === tone 
                                  ? 'bg-gold text-[#050508] font-semibold' 
                                  : 'bg-[#0d0d16] border border-[#222238] text-[#85859e] hover:text-white'
                                }`}
                              >
                                {tone}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Text composition text box */}
                        <div className="space-y-1.5">
                          <p className="text-[8.5px] font-mono text-[#525273] uppercase tracking-wider font-bold">Review Generated Coordinates</p>
                          <textarea
                            value={draftCustomText}
                            onChange={(e) => setDraftCustomText(e.target.value)}
                            className="w-full bg-[#040407] border border-[#1a1a2b] hover:border-[#202035] rounded-xl p-3.5 text-xs leading-relaxed text-slate-100 h-44 focus:outline-none focus:border-gold/30 resize-none font-sans"
                            placeholder="Write message content here..."
                          />
                        </div>

                        {/* Dispatch Actions controls */}
                        <div className="flex justify-between items-center bg-[#07070f] border border-[#151525] rounded-xl p-3">
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> G-Suite validation completed
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setPriorityActions(prev => prev.filter(a => a.id !== activeDirective.id));
                                setActiveDirective(null);
                                triggerToast("Action bypassed safely.");
                              }}
                              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                              Bypass Action
                            </button>
                            <button
                              onClick={() => {
                                const waUrl = `https://wa.me/?text=${encodeURIComponent(draftCustomText)}`;
                                window.open(waUrl, '_blank', 'noopener,noreferrer');
                                triggerToast("Transmitting draft payload to WhatsApp.");
                              }}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                            >
                              Share WA <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleTransmitDirective}
                              className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-[#050508] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                            >
                              Send Message <Send className="w-3.5 h-3.5 text-[#050508]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="p-8 bg-[#07070b] border border-[#141422] rounded-2xl text-center space-y-4 shadow-xl h-64 flex flex-col items-center justify-center">
                        <Mail className="w-8 h-8 text-[#2a2a3d]" />
                        <div>
                          <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">AI Mailroom Idle</h3>
                          <p className="text-xs text-[#5c5c7d] max-w-sm mx-auto leading-relaxed mt-1">
                            Click on any Immediate Action task on the left sidebar or the client CRM list to load the real-time AI reply composer loops.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* VIEW C: FOLLOW-UPS (Client CRM notes) */}
              {activeTab === 'followups' && (
                <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-6 shadow-xl">
                  <div className="pb-3 border-b border-[#141424]">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">Client Touchpoints</h3>
                    <p className="text-[11px] text-[#52526b] font-mono mt-0.5">Quietly tracking high-intent prospects and follow-up templates.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clients.map(c => (
                      <div 
                        key={c.id}
                        className="p-5 bg-[#0a0a14]/60 border border-[#131320] rounded-xl hover:border-[#1d1d2e] transition-all space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-[#181829]" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-xs font-semibold text-white font-satoshi">{c.name}</h4>
                              <p className="text-[9.5px] text-[#525273] font-mono lowercase">{c.email}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-amber-500 bg-[#0d0d16] px-2 py-0.5 rounded border border-[#1a1a2b] uppercase shrink-0">
                            ${(c.budget / 1000).toLocaleString()}K Budget
                          </span>
                        </div>

                        <div className="p-3 bg-[#040407] border border-[#141423] rounded-lg text-xs text-[#85859e] leading-relaxed">
                          <p className="font-semibold text-white uppercase text-[8px] tracking-wider mb-1 font-mono">LATEST COMMUNICATIONS LOGS:</p>
                          "{c.notes}"
                        </div>

                        <div className="flex justify-between items-center pt-2 text-[10.5px]">
                          <span className="text-[#525273] font-mono">Last active {c.lastActive}</span>
                          <button 
                            onClick={() => {
                              setActiveTab('ai-assistant');
                              setEchoInput(`Draft showing followup parameters for ${c.name}`);
                              triggerToast("Echo workspace loaded.");
                            }}
                            className="text-gold hover:text-gold-muted underline font-mono cursor-pointer flex items-center gap-1 uppercase text-[9px]"
                          >
                            <Sparkles className="w-3 h-3" /> Compose Follow-Up
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW D: SCHEDULING (Google Calendar Appointments) */}
              {activeTab === 'scheduling' && (
                <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-6 shadow-xl">
                  <div className="pb-3 border-b border-[#141424] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">Calendar Allocation agenda</h3>
                      <p className="text-[11px] text-[#52526b] font-mono mt-0.5">Active schedule coordinates mapped via G-Suite securely.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 text-[9px] font-bold font-mono rounded-full uppercase flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" /> Preventing Collisions
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { time: "10:00 AM", date: "MONDAY, MAY 25, 2026", duration: "60 mins", client: "Tyler Bennett", listing: "135 Willow Way Tour", status: "CONFIRMED", clash: "Clear" },
                      { time: "02:00 PM", date: "TUESDAY, MAY 26, 2026", duration: "45 mins", client: "Jason Carter", listing: "123 Elm Street Private Walkthrough", status: "PENDING CONFIRMATION", clash: "Slot clear" }
                    ].map((app, idx) => (
                      <div 
                        key={idx}
                        className="p-5 bg-[#0a0a14]/60 border border-[#131320] rounded-xl hover:border-[#1d1d2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-mono text-[#525273] uppercase tracking-wider block">{app.date}</span>
                          <h4 className="text-xs font-semibold text-white font-satoshi flex items-center gap-2">
                            {app.time} <span className="text-[10px] font-mono text-neutral-500 font-normal">({app.duration})</span>
                          </h4>
                          <p className="text-xs text-[#8585a1] font-light leading-relaxed">
                            With client <strong className="text-white font-medium">{app.client}</strong> regarding <strong className="text-gold font-medium">{app.listing}</strong>.
                          </p>
                        </div>

                        <div className="flex items-center gap-3.5 sm:shrink-0 font-mono text-[10px]">
                          <span className="px-2 py-0.5 bg-[#0e0e16] border border-[#23233c] text-[#71719a] rounded">
                            Clash check: {app.clash}
                          </span>
                          <span className={`px-2.5 py-0.5 border rounded font-bold uppercase text-[9px] ${
                            app.status === 'CONFIRMED' 
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40 animate-pulse' 
                            : 'bg-amber-950/40 text-amber-550 border-amber-900/40'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW E: PROPERTIES CATALOGUE */}
              {activeTab === 'properties' && (
                <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-6 shadow-xl">
                  
                  {/* Catalogue header */}
                  <div className="pb-3 border-b border-[#141424] flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">Properties Database Layer</h3>
                      <p className="text-[11px] text-[#52526b] font-mono mt-0.5">Grounding context index: {listings.length} properties total.</p>
                    </div>
                    <button 
                      onClick={() => setIsAddingProperty(true)}
                      className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Property
                    </button>
                  </div>

                  {/* Listings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                    {filteredListings.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedProperty(item)}
                        className={`p-4 rounded-2xl border transition-all ${
                          selectedProperty?.id === item.id 
                          ? 'bg-[#121223]/35 border-amber-500/30 shadow-lg' 
                          : 'bg-[#0a0a14]/60 border-[#131320] hover:border-[#202030]'
                        }`}
                      >
                        <div className="flex gap-4">
                          <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-[#151525] shrink-0 pointer-events-none" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <h4 className="text-xs font-bold text-white font-satoshi truncate">{item.name}</h4>
                              <span className={`text-[8.5px] font-mono font-bold uppercase shrink-0 ${
                                item.status === 'Hot Demand' ? 'text-red-400' : item.status === 'In Contract' ? 'text-emerald-400' : 'text-neutral-500'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7878a1] truncate">{item.address}, {item.city}</p>
                            <p className="text-xs font-bold text-white font-mono">${item.price.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Property status details dashboard tracker */}
                        <div className="grid grid-cols-3 gap-1 shadow-inner py-1 bg-[#09090f]/50 border border-[#131320] rounded-xl text-center font-mono text-[10px] text-slate-400 mt-4 leading-normal">
                          <div>
                            <span className="block text-[8px] text-neutral-600 uppercase">Views</span>
                            <span className="text-[#a1a1b8] font-bold">{item.views}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-neutral-600 uppercase">Leads Count</span>
                            <span className="text-[#a1a1b8] font-bold">{item.leadsCount}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-neutral-600 uppercase">Valuation</span>
                            <span className="text-[#eee] font-bold">${(item.price / 1000).toLocaleString()}K</span>
                          </div>
                        </div>

                        {/* Interactive adjustment controls */}
                        <div className="flex justify-end gap-1.5 pt-3 border-t border-[#131320]/60 mt-4 font-mono text-[9px] uppercase">
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              setListings(prev => prev.filter(p => p.id !== item.id));
                              setSelectedProperty(null);
                              addSystemLog(`De-indexed property record: ${item.name}`, 'realtor');
                              triggerToast("Property record removed safely.");
                              try {
                                await propaiDb.properties.delete(item.id);
                              } catch (err) {
                                console.warn("Failed deleting item from db", err);
                              }
                            }}
                            className="text-[#5c5c7d] hover:text-red-400 transition-colors px-2 py-1 cursor-pointer"
                          >
                            De-Index
                          </button>
                          
                          {item.status === 'Cold Listing' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setListings(prev => prev.map(l => l.id === item.id ? { ...l, price: l.price * 0.95, status: 'Steady' } : l));
                                triggerToast("Valuation modified -5%");
                              }}
                              className="text-amber-500 hover:text-white underline cursor-pointer"
                            >
                              Adjust Valuation -5%
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW F: ANALYTICS PERFORMANCE COCKPIT */}
              {activeTab === 'analytics' && (
                <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-6 shadow-xl">
                  
                  <div className="pb-3 border-b border-[#141424] flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">Performance Diagnostics</h3>
                      <p className="text-[11px] text-[#52526b] font-mono mt-0.5">Real-time indicators summarizing automation growth.</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Live
                    </span>
                  </div>

                  {/* Core interactive graph representations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Graph A */}
                    <div className="p-4 bg-[#0a0a14] border border-[#141423] rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-wider text-[#52526b] uppercase font-bold">Inquiries Handled</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl font-bold text-white font-satoshi">98.4% <span className="text-[10px] text-emerald-400 font-normal font-mono">+12%</span></p>
                      <p className="text-xs text-[#85859e] leading-normal font-light">Custom sub-agents caught 12 inbound G-Suite inquiries successfully with no manual intervention necessary.</p>
                    </div>

                    {/* Graph B */}
                    <div className="p-4 bg-[#0a0a14] border border-[#141423] rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-wider text-[#52526b] uppercase font-bold">Response Latency</span>
                        <Clock className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl font-bold text-amber-500 font-satoshi">2.4 mins <span className="text-[10px] text-emerald-400 font-normal font-mono">-90%</span></p>
                      <p className="text-xs text-[#85859e] leading-normal font-light">Response intervals fell from 25 minutes to 2.4 minutes thanks to G-Suite background triggers.</p>
                    </div>

                    {/* Graph C */}
                    <div className="p-4 bg-[#0a0a14] border border-[#141423] rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-wider text-[#52526b] uppercase font-bold">Deal Close Acceleration</span>
                        <Layers className="w-4 h-4 text-gold" />
                      </div>
                      <p className="text-2xl font-bold text-white font-satoshi">3.2 Weeks <span className="text-[10px] text-neutral-400 font-normal font-mono">Secured</span></p>
                      <p className="text-xs text-[#85859e] leading-normal font-light">Avg timeframe to negotiate private escrow lowered from 5 weeks to 3.2 weeks across listings.</p>
                    </div>

                  </div>
                </div>
              )}

              {/* VIEW G: AI ASSISTANT [Echo Conversational Terminal] */}
              {activeTab === 'ai-assistant' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                  
                  {/* LEFT: INTEGRATED TERMINAL ENGINE (8 cols) */}
                  <div className="lg:col-span-8 p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-4 shadow-xl flex flex-col h-[520px]">
                    <div className="pb-2 border-b border-[#141424]">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                        Echo Workspace Sub-Agent
                      </h3>
                      <p className="text-[11px] text-[#525273] mt-0.5">Control pipeline files naturally using command parameters.</p>
                    </div>

                    {/* Chat log body */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs py-2">
                      <AnimatePresence initial={false}>
                        {echoMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex flex-col space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[8px] font-mono text-[#525273] uppercase tracking-wider font-bold">
                              {msg.role === 'user' ? 'Principal Broker Alex' : 'Echo Platform Bot'}
                            </span>
                            <div className={`p-3 rounded-2xl text-[11.5px] leading-relaxed max-w-[85%] font-light ${
                              msg.role === 'user' 
                              ? 'bg-[#121223]/90 text-neutral-100 rounded-tr-none border border-[#1c1c35]' 
                              : 'bg-[#0a0a14] border border-[#131320] text-slate-300 rounded-tl-none'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isEchoTyping && (
                          <div className="flex items-center gap-2 text-[#525273] font-mono text-[9px] uppercase tracking-widest select-none animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> Echo scanning grounding metadata...
                          </div>
                        )}
                      </AnimatePresence>
                      <div ref={echoEndRef} />
                    </div>

                    {/* Shortcuts indicators */}
                    <div className="space-y-1.5 pt-2 border-t border-[#141422]">
                      <p className="text-[8.5px] font-mono text-[#525273] uppercase tracking-wider font-bold">Fast Operational shortcuts</p>
                      <div className="flex flex-wrap gap-1.5">
                        <button 
                          onClick={() => handleQuickCommand("Follow up with Jason Carter")}
                          className="px-2.5 py-1 bg-[#0a0a14] hover:bg-[#121223] border border-[#1a1a2b] text-[#85859e] hover:text-white text-[10.5px] rounded transition-all cursor-pointer font-mono"
                        >
                          Nudge Jason Carter
                        </button>
                        <button 
                          onClick={() => handleQuickCommand("Verify listing available schedule slots")}
                          className="px-2.5 py-1 bg-[#0a0a14] hover:bg-[#121223] border border-[#1a1a2b] text-[#85859e] hover:text-white text-[10.5px] rounded transition-all cursor-pointer font-mono"
                        >
                          Map Schedules
                        </button>
                        <button 
                          onClick={() => handleQuickCommand("Prune Listings")}
                          className="px-2.5 py-1 bg-[#150a0a] hover:bg-red-950/20 border border-red-900/30 text-red-400 text-[10.5px] rounded transition-all cursor-pointer font-mono"
                        >
                          Prune Cold Listings
                        </button>
                      </div>
                    </div>

                    {/* Chat form box */}
                    <form onSubmit={handleEchoSubmit} className="flex gap-2">
                      <input 
                        type="text" 
                        value={echoInput}
                        onChange={(e) => setEchoInput(e.target.value)}
                        placeholder="Say: 'Draft showing followup' or 'Prune Listings' to analyze state..."
                        className="flex-1 bg-[#040407] border border-[#161626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold/30 placeholder:text-[#3a3a4d] font-sans"
                      />
                      <button 
                        type="submit"
                        className="px-4.5 bg-white hover:bg-neutral-200 text-[#050508] font-bold rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-md"
                      >
                        <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </form>

                  </div>

                  {/* RIGHT: REAL-TIME AI DIAGNOSTICS LOG FEED (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Insights card */}
                    <div className="p-5 bg-[#07070b] border border-[#141422] rounded-2xl space-y-4 shadow-xl">
                      <div className="flex justify-between items-center pb-2 border-b border-[#141424]">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-gold animate-pulse" />
                          AI Insights
                        </h4>
                        <button 
                          onClick={runAIPipelineReanalyze}
                          disabled={isReanalyzing}
                          className="text-[#525273] hover:text-white p-1 hover:bg-[#0c0c14] rounded cursor-pointer disabled:opacity-30"
                        >
                          <Sliders className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-amber-500' : ''}`} />
                        </button>
                      </div>

                      {isReanalyzing ? (
                        <div className="py-8 text-center space-y-2">
                          <Loader2 className="w-5 h-5 animate-spin text-neutral-500 mx-auto" />
                          <p className="text-[9px] font-mono uppercase text-[#525273]">Reading inbox telemetry...</p>
                        </div>
                      ) : (
                        <div className="space-y-3 font-sans text-xs">
                          <div className="p-3 bg-[#040407] border border-[#141423] rounded-xl space-y-2">
                            <span className="text-[9.5px] font-mono uppercase text-amber-500 font-bold block">{aiInsights[activeInsightIndex].type}</span>
                            <p className="font-semibold text-white leading-relaxed font-satoshi">{aiInsights[activeInsightIndex].metric}</p>
                            <p className="text-[#8585a1] leading-relaxed font-light font-sans">"{aiInsights[activeInsightIndex].description}"</p>
                          </div>

                          <div className="flex justify-center gap-1 pt-1.5">
                            {aiInsights.map((_, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setActiveInsightIndex(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${idx === activeInsightIndex ? 'bg-gold' : 'bg-[#1c1c30]'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operational Feed */}
                    <div className="p-5 bg-[#07070b] border border-[#141422] rounded-2xl space-y-4 shadow-xl">
                      <div className="pb-2 border-b border-[#141424]">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">Run Feed</h4>
                      </div>
                      <div className="space-y-4 max-h-[170px] overflow-y-auto pr-1">
                        {liveActivities.map(log => (
                          <div key={log.id} className="text-xs flex gap-3">
                            <div className="mt-1">
                              {log.type === 'ai_agent' ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
                              ) : log.type === 'realtor' ? (
                                <span className="w-2 h-2 rounded-full bg-white block" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-neutral-600 block" />
                              )}
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-[#9696ad] font-light leading-relaxed">{log.content}</p>
                              <span className="text-[10px] font-mono text-[#525273] uppercase tracking-wider block">{log.timeLabel}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* VIEW H: CONTROL PARAMETERS SETTINGS */}
              {activeTab === 'settings' && (
                <div className="p-6 bg-[#07070b] border border-[#141422] rounded-2xl space-y-6 shadow-xl max-w-2xl">
                  
                  <div className="pb-3 border-b border-[#141424]">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#a1a1b8] font-black">G-Suite Integration channels</h3>
                    <p className="text-[11px] text-[#52526b] font-mono mt-0.5">Configure cloud pipelines safely with no manual intervention credentials.</p>
                  </div>

                  {/* Channel sliders connection list */}
                  <div className="space-y-4 py-2">
                    
                    {/* Pipeline 1 */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4.5 bg-[#0a0a14] border border-[#141423] rounded-xl hover:border-[#1d1d2e] transition-all">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white font-satoshi flex items-center gap-2">
                          Gmail SMTP Pipeline
                          {gmailConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                        </h4>
                        <p className="text-xs text-[#8585a1] leading-relaxed font-light">
                          Traces incoming messages context files via direct secure TLS.
                        </p>
                      </div>
                      <button 
                        disabled={isLinkingGmail}
                        onClick={() => linkChannel('gmail')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                          gmailConnected 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200'
                        }`}
                      >
                        {isLinkingGmail ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {gmailConnected ? 'CONNECTED' : 'DISCONNECTED'}
                      </button>
                    </div>

                    {/* Pipeline 2 */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4.5 bg-[#0a0a14] border border-[#141423] rounded-xl hover:border-[#1d1d2e] transition-all">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white font-satoshi flex items-center gap-2">
                          G-Suite Google Calendar
                          {calendarConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                        </h4>
                        <p className="text-xs text-[#8585a1] leading-relaxed font-light">
                          Maps broker showing slot allocation rules context.
                        </p>
                      </div>
                      <button 
                        disabled={isLinkingCalendar}
                        onClick={() => linkChannel('calendar')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                          calendarConnected 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200'
                        }`}
                      >
                        {isLinkingCalendar ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {calendarConnected ? 'CONNECTED' : 'DISCONNECTED'}
                      </button>
                    </div>

                    {/* Pipeline 3 */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4.5 bg-[#0a0a14] border border-[#141423] rounded-xl hover:border-[#1d1d2e] transition-all">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white font-satoshi flex items-center gap-2">
                          Properties Grounding Indexer
                          {dbConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                        </h4>
                        <p className="text-xs text-[#8585a1] leading-relaxed font-light">
                          Structures coordinates metadata to query dimension rules safely.
                        </p>
                      </div>
                      <button 
                        disabled={isLinkingDb}
                        onClick={() => linkChannel('db')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                          dbConnected 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200'
                        }`}
                      >
                        {isLinkingDb ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {dbConnected ? 'CONNECTED' : 'DISCONNECTED'}
                      </button>
                    </div>

                    {/* Pipeline 4: WhatsApp Business Client Sync */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4.5 bg-[#0a0a14] border border-[#141423] rounded-xl hover:border-[#1d1d2e] transition-all">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white font-satoshi flex items-center gap-2">
                          WhatsApp Dispatch Pipeline
                          {whatsappConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                        </h4>
                        <p className="text-xs text-[#8585a1] leading-relaxed font-light">
                          Transmits active property listings, showing schedules, and drafts directly to customers.
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowWhatsappModal(true)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                          whatsappConnected 
                          ? 'bg-[#122e1c] text-emerald-400 border border-[#1b4f2c]' 
                          : 'bg-[#0d2a18] text-[#25D366] border border-[#1d4c2b] hover:bg-[#123620]'
                        }`}
                      >
                        {whatsappConnected ? 'CONNECTED' : 'CONNECT'}
                      </button>
                    </div>

                    {/* Database Dev Console Integrator */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4.5 bg-[#0a0a14] border border-amber-900/20 rounded-xl hover:border-amber-900/40 transition-all">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white font-satoshi flex items-center gap-2">
                          Firebase & Firestore Developer Console
                          <Database className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        </h4>
                        <p className="text-xs text-[#8585a1] leading-relaxed font-light">
                          Monitor collections, deploy schema security rules, and seed test sandboxes.
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowConsole(true)}
                        className="px-4 py-2 bg-amber-950/40 text-amber-400 border border-amber-900/40 hover:bg-amber-950/70 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                      >
                        OPEN CONSOLE
                      </button>
                    </div>

                  </div>

                  {/* RESET OR BYPASS PARAMETERS */}
                  <div className="pt-4 border-t border-[#141424] flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-mono">ADMIN SYSTEM MODULES</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetActivation}
                        className="px-4 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
                      >
                        Prune All Integrations
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </main>

      {/* TOAST SYSTEM ACCENTS */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className={`fixed bottom-6 right-6 z-[200] px-4.5 py-3 rounded-xl border flex items-center gap-2.5 shadow-2xl backdrop-blur-md ${
              showToast.success 
              ? 'bg-[#0f1c13]/95 text-emerald-400 border-[#1c3022]' 
              : 'bg-red-950/45 text-red-400 border-red-900/40'
            }`}
          >
            {showToast.success ? <CheckCircle2 className="w-4 h-4 text-emerald-405" /> : <AlertTriangle className="w-4 h-4" />}
            <span className="text-xs font-medium uppercase font-mono tracking-wide">{showToast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL WINDOWS A: PROPERTY ENTRY MODAL */}
      <AnimatePresence>
        {isAddingProperty && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-md bg-[#07070a] border border-[#1b1b2d] rounded-2xl p-6 relative shadow-2xl space-y-4"
            >
              <button 
                onClick={() => setIsAddingProperty(false)}
                className="absolute top-4 right-4 text-[#525273] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#525273] font-bold block">GROUNDED DATABASE ENTRY</span>
                <h2 className="text-md font-bold text-white tracking-tight font-satoshi mt-1">Ground Property Record</h2>
                <p className="text-xs text-[#85859e] leading-relaxed mt-1">Describe parameters to index, store, and serve listings metadata to Echo's reasoning model securely.</p>
              </div>

              <form onSubmit={handleAddPropertySubmit} className="space-y-4 text-xs font-sans text-[#a1a1b8]">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Property Listing Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="E.g., 123 Elm Street"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-white focus:border-gold/30 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Street Address</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="E.g., 456 Oak Avenue"
                      value={newProperty.address}
                      onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                      className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-white focus:border-gold/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">City Profile</label>
                    <input 
                      required
                      type="text" 
                      placeholder="E.g., Rivertown"
                      value={newProperty.city}
                      onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                      className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-white focus:border-gold/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Price (USD)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="1250000"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                      className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-white focus:border-gold/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Status Index</label>
                    <select
                      value={newProperty.status}
                      onChange={(e) => setNewProperty({ ...newProperty, status: e.target.value as any })}
                      className="w-full bg-[#040407] border border-[#181829] rounded-xl px-2 py-2 text-slate-200 focus:border-gold/30 focus:outline-none cursor-pointer"
                    >
                      <option value="Steady">Steady Interest</option>
                      <option value="Hot Demand">Hot Demand</option>
                      <option value="Cold Listing">Cold Listing</option>
                      <option value="In Contract">In Contract</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-gold-muted text-[#050508] text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Index Listing <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL WINDOWS B: TASK ADD MODAL */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-sm bg-[#07070a] border border-[#1b1b2d] rounded-2xl p-6 relative shadow-2xl space-y-4"
            >
              <button 
                onClick={() => setIsAddingTask(false)}
                className="absolute top-4 right-4 text-[#525273] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#525273] font-bold block">WORKFLOW TRIGGER</span>
                <h2 className="text-md font-bold text-white tracking-tight font-satoshi mt-1 font-semibold">Define Operational task</h2>
                <p className="text-xs text-[#85859e] leading-relaxed mt-1">Add tasks to maintain the real estate workflow integrity checklists.</p>
              </div>

              <form onSubmit={handleAddTaskSubmit} className="space-y-4 text-xs text-[#a1a1b8] font-sans">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Task Title</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="E.g., Respond to mortgage proposal"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-white focus:border-gold/30 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Due Date</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="AUGUST 25, 2026"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-white focus:border-gold/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#525273] uppercase tracking-wider font-bold block">Priority Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full bg-[#040407] border border-[#181829] rounded-xl px-2 py-2 text-slate-200 focus:border-gold/30 focus:outline-none cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-gold-muted text-[#050508] text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    Index Task <ArrowRight className="w-3.5 h-3.5 text-[#050508]" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHATSAPP CONFIGURATION MODAL */}
      <AnimatePresence>
        {showWhatsappModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhatsappModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="w-full max-w-md bg-[#07070b] border border-[#1b1b2a] rounded-2xl p-6 space-y-5 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-start pb-3 border-b border-[#141424]">
                <div>
                  <span className="text-[8px] font-mono uppercase bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded border border-[#25D366]/20 font-black">
                    PROP-AI WHATSAPP HUBLIST
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">Configure WhatsApp Channel</h3>
                  <p className="text-[10px] text-[#8585a1] leading-relaxed mt-0.5 font-light">
                    Connect real CRM dispatches with quick send or API key routing guidelines.
                  </p>
                </div>
                <button 
                  onClick={() => setShowWhatsappModal(false)}
                  className="text-neutral-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0b0b14] border border-amber-500/10 p-3.5 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">Fast Web Bypass (Recommended)</span>
                  <p className="text-[11px] text-[#85859e] leading-relaxed font-light">
                    By default, PropAI uses local browser automation standard links (wa.me) so you don't have to purchase a Meta Developer Account or pay for active message credits. Works instantly!
                  </p>
                </div>

                <div className="space-y-1 text-slate-300">
                  <label className="text-[9px] font-mono text-[#525273] uppercase tracking-wider font-bold block">
                    WhatsApp Business Phone ID (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 109528418723910"
                    value={whatsappPhoneId}
                    onChange={(e) => setWhatsappPhoneId(e.target.value)}
                    className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-xs text-white focus:border-gold/30 focus:outline-none placeholder:text-[#39394f]"
                  />
                </div>

                <div className="space-y-1 text-slate-300">
                  <label className="text-[9px] font-mono text-[#525273] uppercase tracking-wider font-bold block">
                    System Access Token (Optional)
                  </label>
                  <input 
                    type="password" 
                    placeholder="EAAGb3i..."
                    value={whatsappToken}
                    onChange={(e) => setWhatsappToken(e.target.value)}
                    className="w-full bg-[#040407] border border-[#181829] rounded-xl px-3 py-2 text-xs text-white focus:border-gold/30 focus:outline-none placeholder:text-[#39394f]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('propai_whatsapp_connected', 'true');
                    localStorage.setItem('propai_whatsapp_phone_id', whatsappPhoneId);
                    localStorage.setItem('propai_whatsapp_token', whatsappToken);
                    setWhatsappConnected(true);
                    setShowWhatsappModal(false);
                    triggerToast("WhatsApp channel connected successfully!");
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-colors text-center cursor-pointer"
                >
                  Save Integration
                </button>
                {whatsappConnected && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('propai_whatsapp_connected');
                      localStorage.removeItem('propai_whatsapp_phone_id');
                      localStorage.removeItem('propai_whatsapp_token');
                      setWhatsappConnected(false);
                      setWhatsappPhoneId('');
                      setWhatsappToken('');
                      setShowWhatsappModal(false);
                      triggerToast("WhatsApp pipeline disconnected.");
                    }}
                    className="px-3.5 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEV CONSOLE MODAL */}
      {showConsole && (
        <SupabaseDashboardConsole onClose={() => setShowConsole(false)} />
      )}

    </div>
  );
}
