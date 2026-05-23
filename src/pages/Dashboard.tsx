import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Home, 
  MoreVertical, 
  Loader2, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  X, 
  ChevronRight, 
  Users, 
  Check, 
  Trash2, 
  MessageSquare, 
  Paperclip, 
  ArrowRight,
  Sparkles,
  Award,
  DollarSign
} from 'lucide-react';

interface Listing {
  id: string;
  name: string;
  address: string;
  price: number;
  imageUrl?: string;
  city?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Task {
  id: string;
  title: string;
  date: string;
  code: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  property: string;
  category: 'In Progress' | 'Pending' | 'Completed';
  description: string;
  completed: boolean;
  subtasks: { id: string; text: string; completed: boolean }[];
  comments: { id: string; author: string; text: string; time: string }[];
  attachments: { id: string; name: string; size: string }[];
}

export default function Dashboard({ user }: { user: any }) {
  // 1. Initial State Data (Mirrors the exact numbers and items from the video)
  const [listings, setListings] = useState<Listing[]>([
    { id: '1', name: "123 Elm Street", address: "456 Oak Avenue", price: 1250000, city: "Rivertown", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80" },
    { id: '2', name: "789 Maple Drive", address: "321 Pine Lane", price: 2350000, city: "Lakeview", imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80" },
    { id: '3', name: "654 Cedar Boulevard", address: "987 Birch Road", price: 950000, city: "Sunnyvale", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80" },
    { id: '4', name: "135 Willow Way", address: "245 Spruce Street", price: 1850000, city: "Meadowbrook", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80" }
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: "Jason Carter", email: "j.carter@realtormail.com", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
    { id: 'c2', name: "Monica Reyes", email: "monica.reyes@homespot.co", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { id: 'c3', name: "Diana Brooks", email: "diana.b@remaxrealty.com", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
    { id: 'c4', name: "Tyler Bennett", email: "tyler.bennett@urbanestates", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      title: "Confirm showing appointment for 2 PM tomorrow",
      date: "SEPTEMBER 12, 2025",
      code: "2745",
      priority: "HIGH",
      property: "123 Elm Street",
      category: "In Progress",
      description: "Confirm booking slot with Julian Vercetti and sync with Realtor calendar.",
      completed: false,
      subtasks: [
        { id: 's1', text: "Call client to confirm window", completed: true },
        { id: 's2', text: "Set reminder on Google Calendar", completed: false }
      ],
      comments: [
        { id: 'cmd1', author: "System", text: "Task created from automated concierge.", time: "Sep 12, 10:11 AM" }
      ],
      attachments: [{ id: 'att1', name: "slot_confirm_log.txt", size: "12 KB" }]
    },
    {
      id: 't2',
      title: "Follow up with buyer after showing",
      date: "AUGUST 22, 2025",
      code: "2746",
      priority: "LOW",
      property: "789 Maple Drive",
      category: "Pending",
      description: "Gather feedback from Sarah's visit to our Platinum estate and address immediate budget questions.",
      completed: false,
      subtasks: [
        { id: 's1', text: "Prepare property feedback document", completed: false }
      ],
      comments: [],
      attachments: []
    },
    {
      id: 't3',
      title: "Follow up with buyer leads from open house",
      date: "AUGUST 22, 2025",
      code: "2747",
      priority: "LOW",
      property: "654 Cedar Boulevard",
      category: "Pending",
      description: "Review all signatures on the guest register and execute corresponding automated intro flows.",
      completed: false,
      subtasks: [],
      comments: [],
      attachments: []
    },
    {
      id: 't4',
      title: "Update listing photos for 1234 Sunset Blvd",
      date: "JUNE 15, 2025",
      code: "5611",
      priority: "HIGH",
      property: "135 Willow Way",
      category: "In Progress",
      description: "Replace standard photos with professional twilight architectural shoots on database listings.",
      completed: false,
      subtasks: [],
      comments: [],
      attachments: []
    },
    {
      id: 't5',
      title: "Schedule home inspection for pending deal",
      date: "MAY 5, 2025",
      code: "4127",
      priority: "MEDIUM",
      property: "123 Elm Street",
      category: "In Progress",
      description: "Secure a certified structural inspector for 123 Elm Street.",
      completed: true,
      subtasks: [],
      comments: [],
      attachments: []
    },
    {
      id: 't6',
      title: "Respond to client inquiry about mortgage options",
      date: "OCTOBER 15, 2025",
      code: "1122",
      priority: "LOW",
      property: "789 Maple Drive",
      category: "Completed",
      description: "Provide comprehensive breakdown of domestic and USD variable-rate premium plans.",
      completed: true,
      subtasks: [],
      comments: [],
      attachments: []
    }
  ]);

  // Search & Filters
  const [propertySearchInput, setPropertySearchInput] = useState('');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('All Properties');

  // Popup Modals/Drawers
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  
  // Drawer Tab
  const [drawerActiveTab, setDrawerActiveTab] = useState<'details' | 'subtasks' | 'comments' | 'attachments'>('details');

  // Input states for Add/Edit Property Modal
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    city: '',
    price: '',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80'
  });

  // Input states for Task Sub-elements (Adding subtask, Comment, file drop simulation)
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // 2. Metrics (Derived dynamically where possible to align with original values)
  const statsMetrics = useMemo(() => {
    return {
      total: listings.length + 41, // Starts at video value 45
      assigned: tasks.filter(t => !t.completed).length + 6, // Starts at video value 10
      closed: 20, // Static matched video metric
      overdue: 2 // Static matched video metric
    };
  }, [listings, tasks]);

  // Derived filtered listings & properties selection
  const filteredListings = useMemo(() => {
    if (!propertySearchInput.trim()) return listings;
    return listings.filter(l => 
      l.name.toLowerCase().includes(propertySearchInput.toLowerCase()) || 
      l.address.toLowerCase().includes(propertySearchInput.toLowerCase()) || 
      (l.city && l.city.toLowerCase().includes(propertySearchInput.toLowerCase()))
    );
  }, [listings, propertySearchInput]);

  const filteredTasks = useMemo(() => {
    if (selectedPropertyFilter === 'All Properties') return tasks;
    return tasks.filter(t => t.property === selectedPropertyFilter);
  }, [tasks, selectedPropertyFilter]);

  // Handle Adding a Property Listing
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProperty.name || !newProperty.address) return;

    const added: Listing = {
      id: `property-${Date.now()}`,
      name: newProperty.name,
      address: newProperty.address,
      price: Number(newProperty.price) || 1200000,
      city: newProperty.city || 'Downtown',
      imageUrl: newProperty.imageUrl
    };

    setListings(prev => [added, ...prev]);
    setIsAddingProperty(false);
    setNewProperty({ name: '', address: '', city: '', price: '', imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' });
  };

  // Handle Editing/Saving a task
  const handleUpdateTaskField = (taskId: string, field: keyof Task, value: any) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t, [field]: value };
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      }
      return t;
    }));
  };

  // Create a brand new task
  const handleCreateNewTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "New Follow-up Command",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
      code: Math.floor(1000 + Math.random() * 9000).toString(),
      priority: "MEDIUM",
      property: listings[0]?.name || "123 Elm Street",
      category: "In Progress",
      description: "Drafted via executive planner command dashboard.",
      completed: false,
      subtasks: [],
      comments: [],
      attachments: []
    };

    setTasks(prev => [newTask, ...prev]);
    setSelectedTask(newTask);
    setDrawerActiveTab('details');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Add customized subtask
  const handleAddSubtask = () => {
    if (!newSubtaskText.trim() || !selectedTask) return;
    const sub = {
      id: `sub-${Date.now()}`,
      text: newSubtaskText,
      completed: false
    };

    handleUpdateTaskField(selectedTask.id, 'subtasks', [...selectedTask.subtasks, sub]);
    setNewSubtaskText('');
  };

  // Add comment
  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedTask) return;
    const comment = {
      id: `com-${Date.now()}`,
      author: user?.displayName || 'Alex Johnson',
      text: newCommentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    handleUpdateTaskField(selectedTask.id, 'comments', [...selectedTask.comments, comment]);
    setNewCommentText('');
  };

  return (
    <div className="space-y-6 relative selection:bg-gold/30">
      
      {/* Search and Property Quick Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0A] p-4 rounded-2xl border border-[#1A1A1A] shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444] group-focus-within:text-gold" />
          <input 
            type="text" 
            placeholder="Search active properties..."
            value={propertySearchInput}
            onChange={(e) => setPropertySearchInput(e.target.value)}
            className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-[#444] focus:outline-none focus:border-gold/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddingProperty(true)}
            className="luxury-button flex items-center gap-2 py-3 px-6 text-[10px] uppercase font-black tracking-widest"
          >
            <Plus className="w-4 h-4 text-gold" />
            Add Property
          </button>
        </div>
      </div>

      {/* Main Grid Layout - Adapts if Task Slider is active or not */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Elements Wrapper (Takes 8 columns when drawer layout is open, full 12 otherwise) */}
        <div className={`space-y-6 xl:col-span-8 ${selectedTask ? 'xl:col-span-8' : 'xl:col-span-12'} transition-all duration-300`}>
          
          {/* Top Widgets Grid: Property Listings, Clients, and Welcome/AI Promo Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Widget 1: Property Listings Section */}
            <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#1A1A1A] flex flex-col h-[340px] shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1A1A1A]/50">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white">Property Listings</h4>
                </div>
                <span className="text-[9px] bg-gold/5 border border-gold/15 text-gold font-bold px-2 py-0.5 rounded-full">
                  {listings.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                {filteredListings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#333]">
                    <Home className="w-8 h-8 opacity-20 mb-2" />
                    <p className="text-[9px] uppercase tracking-widest font-black">No listings found</p>
                  </div>
                ) : (
                  filteredListings.map(lst => (
                    <div 
                      key={lst.id}
                      className="flex items-center gap-3 p-3 bg-[#050505]/50 border border-[#1A1A1A] rounded-xl hover:border-gold/20 transition-all group cursor-pointer"
                    >
                      <img 
                        src={lst.imageUrl} 
                        alt="" 
                        className="w-10 h-10 rounded-lg object-cover border border-[#1A1A1A] group-hover:border-gold/30 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[11px] font-bold text-white uppercase tracking-wider truncate">{lst.name}</h5>
                        <p className="text-[9px] text-[#555] font-semibold tracking-wide truncate">{lst.address}, {lst.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gold font-black">${(lst.price / 1000).toLocaleString()}K</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Widget 2: Clients CRM Section */}
            <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#1A1A1A] flex flex-col h-[340px] shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1A1A1A]/50">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white">Clients CRM</h4>
                </div>
                <span className="text-[9px] bg-gold/5 border border-gold/15 text-gold font-bold px-2 py-0.5 rounded-full">
                  25
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                {clients.map(cli => (
                  <div 
                    key={cli.id}
                    className="flex items-center gap-3 p-3 bg-[#050505]/50 border border-[#1A1A1A] rounded-xl hover:bg-[#111] transition-all cursor-pointer group"
                  >
                    <img 
                      src={cli.avatarUrl} 
                      alt="" 
                      className="w-9 h-9 rounded-full border border-[#1A1A1A] group-hover:border-gold/30 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[11px] font-bold text-white tracking-wide truncate">{cli.name}</h5>
                      <p className="text-[9px] text-[#555] font-semibold truncate">{cli.email}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#333] group-hover:text-gold transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Welcome and AI Promo Section */}
            <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#2A2A2A] relative overflow-hidden flex flex-col h-[340px] justify-between shadow-2xl col-span-1 md:col-span-2 lg:col-span-1">
              <div className="space-y-2 relative z-10">
                <p className="text-[7px] text-[#444] uppercase tracking-[0.4em] font-black">Realtor Hub</p>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  <h4 className="text-[13px] font-sans font-medium text-white tracking-tight">
                    Hello, {user?.displayName ? user.displayName.split(' ')[0] : 'Alex Johnson'}!
                  </h4>
                </div>
              </div>

              {/* Generated Luxury Villa Block */}
              <div className="my-3 relative w-full h-[140px] rounded-xl overflow-hidden border border-[#222]">
                <img 
                  src="/src/assets/images/luxury_villa_1779395996664.png animate-pulse" 
                  alt="Luxury Villa Map"
                  onError={(e) => {
                    // Fallback to beautiful unsplash architecture if build container delays write
                    (e.target as any).src = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex justify-between items-end">
                  <div className="text-[7px] text-white/50 uppercase font-black tracking-widest bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5">
                    Rendered Spec #305
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-bounce" />
                </div>
              </div>

              <div className="space-y-3 relative z-10 border-t border-[#111] pt-3">
                <p className="text-[10px] text-gold font-bold uppercase tracking-widest">
                  Unlock AI Features
                </p>
                <p className="text-[9px] text-[#777] leading-relaxed font-semibold uppercase tracking-wide">
                  Generating high-fidelity listings, summaries and nudge logs compiled in real time.
                </p>
              </div>
            </div>

          </div>

          {/* Metric Rows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0A0A0A] p-5 rounded-2xl border border-[#1A1A1A] shadow-md">
            <div className="p-4 bg-[#050505] rounded-xl border border-[#1A1A1A] text-center relative group overflow-hidden">
              <p className="text-[8px] text-[#444] uppercase tracking-[0.3em] font-black mb-1.5">Total Listings</p>
              <h3 className="text-2xl font-sans text-white font-black">{statsMetrics.total}</h3>
            </div>
            <div className="p-4 bg-[#050505] rounded-xl border border-[#1A1A1A] text-center relative group overflow-hidden">
              <p className="text-[8px] text-[#444] uppercase tracking-[0.3em] font-black mb-1.5">Assigned Listings</p>
              <h3 className="text-2xl font-sans text-gold font-black">{statsMetrics.assigned}</h3>
            </div>
            <div className="p-4 bg-[#050505] rounded-xl border border-[#1A1A1A] text-center relative group overflow-hidden">
              <p className="text-[8px] text-[#444] uppercase tracking-[0.3em] font-black mb-1.5">Closed Listings</p>
              <h3 className="text-2xl font-sans text-white font-black">{statsMetrics.closed}</h3>
            </div>
            <div className="p-4 bg-[#050505] rounded-xl border border-[#1A1A1A] text-center relative group overflow-hidden">
              <p className="text-[8px] text-[#444] uppercase tracking-[0.3em] font-black mb-1.5">Overdue Tasks</p>
              <h3 className="text-2xl font-sans text-[#E06A53] font-black">02</h3>
            </div>
          </div>

          {/* Interactive My Tasks Section */}
          <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#1A1A1A] shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-[#1A1A1A]/70">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold shadow-[0_0_8px_gold] rounded-full" />
                <h4 className="text-xs font-sans text-white font-black uppercase tracking-[0.2em]">My Tasks ({filteredTasks.length})</h4>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button 
                  onClick={handleCreateNewTask}
                  className="px-4 py-2 bg-gold/10 border border-gold/25 hover:bg-gold text-gold hover:text-black rounded-lg text-[8px] uppercase font-black tracking-widest transition-all"
                >
                  + Add Task
                </button>
                <select 
                  value={selectedPropertyFilter}
                  onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                  className="bg-[#050505] text-[9px] uppercase font-black text-[#A0A0A0] px-4 py-2 rounded-lg border border-[#1A1A1A] focus:outline-none focus:border-gold/30 tracking-widest cursor-pointer"
                >
                  <option value="All Properties">All Properties</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-[#444]">
                  <CheckCircle2 className="w-10 h-10 mx-auto opacity-10 mb-2" />
                  <p className="text-[9px] uppercase tracking-widest font-black">Zero active protocol tasks found</p>
                </div>
              ) : (
                filteredTasks.map(tsk => (
                  <div 
                    key={tsk.id}
                    onClick={() => {
                      setSelectedTask(tsk);
                      setDrawerActiveTab('details');
                    }}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                      tsk.completed 
                      ? 'bg-[#050505]/40 border-[#1A1A1A]/50 opacity-65' 
                      : selectedTask?.id === tsk.id 
                        ? 'bg-gold/5 border-gold/35 shadow-lg' 
                        : 'bg-[#050505] border-[#1A1A1A] hover:border-gold/20'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateTaskField(tsk.id, 'completed', !tsk.completed);
                        }}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                          tsk.completed 
                          ? 'bg-gold/20 border-gold/40 text-gold' 
                          : 'border-[#333] hover:border-gold text-transparent'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </button>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold leading-normal text-white tracking-wide transition-all ${
                          tsk.completed ? 'line-through text-white/45' : 'group-hover:text-gold'
                        }`}>
                          {tsk.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[8px] uppercase tracking-wider font-black text-white/50 bg-[#151515] px-2 py-0.5 rounded border border-[#222]">
                            {tsk.property}
                          </span>
                          <span className="text-[8px] uppercase tracking-wider font-bold text-[#444]">
                            Ref: #{tsk.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3 text-[#444]" />
                        <span className="text-[8px] font-black text-[#555] uppercase tracking-widest">{tsk.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded border tracking-widest ${
                          tsk.priority === 'HIGH' 
                          ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                          : tsk.priority === 'MEDIUM' 
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' 
                            : 'bg-green-500/10 border-green-500/20 text-green-400'
                        }`}>
                          {tsk.priority}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(tsk.id);
                          }}
                          className="p-1 px-2 hover:bg-[#1C0000] hover:text-red-500 rounded text-[#333] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Dynamic Edit Drawer Panel (Occupies remaining 4 columns or slides out inside layout) */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="xl:col-span-4 bg-[#0A0A0A] border border-gold/15 rounded-2xl overflow-hidden flex flex-col h-[700px] shadow-2xl relative sticky top-6"
            >
              {/* Drawer Top Header Area */}
              <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#070707]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    ID #{selectedTask.code}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="text-[#333] hover:text-gold hover:bg-[#111] p-1.5 rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Slider Internal Nav Tab Bar */}
              <div className="flex border-b border-[#1a1a1a] bg-[#050505] px-3">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'subtasks', label: 'Subtasks' },
                  { id: 'comments', label: 'Comments' },
                  { id: 'attachments', label: 'Assets' }
                ].map(tb => (
                  <button
                    key={tb.id}
                    onClick={() => setDrawerActiveTab(tb.id as any)}
                    className={`flex-1 py-3 text-[8px] uppercase font-black tracking-widest relative ${
                      drawerActiveTab === tb.id 
                      ? 'text-gold' 
                      : 'text-[#444] hover:text-[#777]'
                    }`}
                  >
                    {tb.label}
                    {drawerActiveTab === tb.id && (
                      <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gold shadow-[0_0_5px_gold]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Drawer Scrolled Body Section */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide text-xs">
                
                {/* 1. Details Tab */}
                {drawerActiveTab === 'details' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Task Title Description</label>
                      <input 
                        type="text" 
                        value={selectedTask.title}
                        onChange={(e) => handleUpdateTaskField(selectedTask.id, 'title', e.target.value)}
                        className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-2.5 text-xs text-white uppercase tracking-wide focus:outline-none focus:border-gold/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Connected Property</label>
                        <select 
                          value={selectedTask.property}
                          onChange={(e) => handleUpdateTaskField(selectedTask.id, 'property', e.target.value)}
                          className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-2.5 text-xs text-white uppercase tracking-wide focus:outline-none focus:border-gold/30"
                        >
                          {listings.map(l => (
                            <option key={l.id} value={l.name}>{l.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Status Class</label>
                        <select 
                          value={selectedTask.category}
                          onChange={(e) => handleUpdateTaskField(selectedTask.id, 'category', e.target.value)}
                          className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/30"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Priority Stage</label>
                        <select 
                          value={selectedTask.priority}
                          onChange={(e) => handleUpdateTaskField(selectedTask.id, 'priority', e.target.value as any)}
                          className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="HIGH">HIGH</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="LOW">LOW</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Due Date Protocol</label>
                        <input 
                          type="text" 
                          value={selectedTask.date}
                          onChange={(e) => handleUpdateTaskField(selectedTask.id, 'date', e.target.value.toUpperCase())}
                          placeholder="E.G., AUGUST 22, 2025"
                          className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-2.5 text-xs text-white uppercase tracking-wide focus:outline-none focus:border-gold/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Strategic Directives</label>
                      <textarea 
                        value={selectedTask.description}
                        onChange={(e) => handleUpdateTaskField(selectedTask.id, 'description', e.target.value)}
                        className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-3 text-xs text-white h-24 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Subtasks Tab Checklists */}
                {drawerActiveTab === 'subtasks' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Dynamic Sub-Checklists</label>
                      
                      {selectedTask.subtasks.length === 0 ? (
                        <p className="text-[9px] text-center text-[#444] py-6 uppercase tracking-widest font-black">
                          Empty checklist node
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTask.subtasks.map(sub => (
                            <div 
                              key={sub.id}
                              className="flex items-center justify-between p-2.5 bg-[#050505] border border-[#1a1a1a] rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    const updatedSub = selectedTask.subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s);
                                    handleUpdateTaskField(selectedTask.id, 'subtasks', updatedSub);
                                  }}
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                    sub.completed ? 'bg-gold/10 border-gold/30 text-gold' : 'border-[#333]'
                                  }`}
                                >
                                  {sub.completed && <Check className="w-2.5 h-2.5" />}
                                </button>
                                <span className={`text-[11px] font-semibold text-white truncate ${sub.completed ? 'line-through text-white/40' : ''}`}>
                                  {sub.text}
                                </span>
                              </div>
                              <button 
                                onClick={() => {
                                  const updatedSub = selectedTask.subtasks.filter(s => s.id !== sub.id);
                                  handleUpdateTaskField(selectedTask.id, 'subtasks', updatedSub);
                                }}
                                className="text-[#333] hover:text-red-400 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add checklist subtask..."
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddSubtask();
                        }}
                        className="flex-1 bg-[#050505] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/30"
                      />
                      <button 
                        onClick={handleAddSubtask}
                        className="px-3 bg-gold hover:bg-gold/90 text-black font-bold rounded-lg text-xs"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Comments Tab */}
                {drawerActiveTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      {selectedTask.comments.length === 0 ? (
                        <p className="text-[9px] text-center text-[#444] py-8 uppercase tracking-widest font-black">
                          No logging narrative recorded
                        </p>
                      ) : (
                        selectedTask.comments.map(com => (
                          <div key={com.id} className="p-3 bg-[#050505] border border-[#1A1A1A] rounded-lg space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gold">{com.author}</span>
                              <span className="text-[8px] text-[#444] uppercase">{com.time}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-[#A0A0A0]">{com.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="space-y-2">
                      <textarea 
                        placeholder="Write a status comment or report..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg p-3 text-xs text-white h-16 focus:outline-none focus:border-gold/30 resize-none"
                      />
                      <button 
                        onClick={handleAddComment}
                        className="w-full py-2 bg-gold/10 border border-gold/20 text-gold text-[9px] uppercase font-black tracking-widest rounded-lg hover:bg-gold hover:text-black transition-all"
                      >
                        Transmit Status
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Attachments/Assets Tab */}
                {drawerActiveTab === 'attachments' && (
                  <div className="space-y-4">
                    <div className="border border-dashed border-[#222] rounded-xl p-6 text-center hover:border-gold/30 transition-all cursor-pointer bg-[#050505]/40 flex flex-col items-center justify-center">
                      <Paperclip className="w-6 h-6 text-gold/40 mb-2" />
                      <p className="text-[8px] uppercase tracking-widest font-black text-white">Drag & Drop Assets</p>
                      <p className="text-[8px] text-[#333] tracking-widest font-black uppercase mt-1">Or click to select</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Active PDF / Text Assets</label>
                      {selectedTask.attachments.length === 0 ? (
                        <p className="text-[9px] text-[#333] uppercase text-center py-4 font-black">
                          Empty asset nodes
                        </p>
                      ) : (
                        selectedTask.attachments.map(att => (
                          <div 
                            key={att.id}
                            className="p-2.5 bg-[#050505] border border-[#1A1A1A]/80 flex items-center justify-between rounded-lg"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Paperclip className="w-3.5 h-3.5 text-gold/30 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-white truncate">{att.name}</p>
                                <p className="text-[8px] text-[#444]">{att.size}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const updatedAtt = selectedTask.attachments.filter(a => a.id !== att.id);
                                handleUpdateTaskField(selectedTask.id, 'attachments', updatedAtt);
                              }}
                              className="text-[#333] hover:text-red-400 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Bottom Actions Area */}
              <div className="p-4 bg-[#070707] border-t border-[#1a1a1a] flex gap-3">
                <button 
                  onClick={() => {
                    handleUpdateTaskField(selectedTask.id, 'completed', !selectedTask.completed);
                  }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    selectedTask.completed 
                    ? 'bg-gold/10 border border-gold/20 text-gold' 
                    : 'bg-gold text-black hover:brightness-115'
                  }`}
                >
                  {selectedTask.completed ? 'Re-open Task' : 'Resolve Task'}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Slide-out Overlay Modal for Adding a Property Listing */}
      <AnimatePresence>
        {isAddingProperty && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0A0A0A] border border-gold/20 rounded-3xl p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsAddingProperty(false)}
                className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 text-center">
                <Home className="w-8 h-8 text-gold mx-auto mb-3" />
                <h2 className="text-lg font-sans font-medium text-white mb-1.5 tracking-tight">Generate New Property</h2>
                <p className="text-[9px] text-gold uppercase tracking-widest font-black">Inbound luxury listings processor</p>
              </div>

              <form onSubmit={handleAddProperty} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Property Name/ID</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="E.G., 123 Elm Street"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3.5 text-xs text-white placeholder-[#2ea] focus:outline-none focus:border-gold/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Sub-street Address</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="E.G., 456 Oak Avenue"
                      value={newProperty.address}
                      onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">City Location</label>
                    <input 
                      type="text" 
                      placeholder="E.G., Rivertown"
                      value={newProperty.city}
                      onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Premium Valuation Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gold absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="number" 
                      placeholder="1250000"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl pl-10 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-[#444]">Visual Asset URL Link</label>
                  <input 
                    type="text" 
                    value={newProperty.imageUrl}
                    onChange={(e) => setNewProperty({ ...newProperty, imageUrl: e.target.value })}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 bg-gold text-black rounded-xl text-[10px] uppercase font-black tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Confirm Deployment <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
