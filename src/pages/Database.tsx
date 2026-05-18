import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Search, Home, MoreVertical, Loader2, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Listing {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  realtorId: string;
}

export default function Database({ user }: { user: User }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newListing, setNewListing] = useState({
    address: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'listings'), where('realtorId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'listings'), {
        ...newListing,
        realtorId: user.uid,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setNewListing({ address: '', price: 0, bedrooms: 0, bathrooms: 0, description: '', imageUrl: '' });
      fetchListings();
    } catch (error) {
      console.error('Error adding listing:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444] w-3.5 h-3.5" />
          <input 
            type="text" 
            placeholder="Search operational data..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-xs focus:outline-none focus:border-gold transition-all shadow-lg"
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="luxury-button px-6 py-2.5 text-[10px]"
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Property Asset
        </button>
      </div>

      <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1A1A1A] mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/5 rounded-lg border border-gold/10">
               <Zap className="w-4 h-4 text-gold" />
            </div>
            <div>
               <p className="text-[11px] text-white font-medium uppercase tracking-tight">AI Context Enabled</p>
               <p className="text-[9px] text-[#666] uppercase tracking-widest mt-0.5 font-bold">Records synthesized for real-time inquiries.</p>
            </div>
         </div>
      </div>

      {isAdding && (
         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-[#0A0A0A] p-8 rounded-2xl border border-gold/20 shadow-2xl"
         >
           <form onSubmit={handleAddListing} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-2 font-bold">Property Address</label>
               <input 
                 required
                 type="text" 
                 value={newListing.address}
                 onChange={e => setNewListing({...newListing, address: e.target.value})}
                 className="w-full px-4 py-3 bg-[#050505] border border-[#1A1A1A] rounded-xl focus:border-gold outline-none text-white transition-all"
               />
             </div>
             <div>
               <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-2 font-bold">Offer Price ($)</label>
               <input 
                 required
                 type="number" 
                 value={newListing.price || ''}
                 onChange={e => setNewListing({...newListing, price: Number(e.target.value)})}
                 className="w-full px-4 py-3 bg-[#050505] border border-[#1A1A1A] rounded-xl focus:border-gold outline-none text-white transition-all"
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-2 font-bold">Bedrooms</label>
                 <input 
                   type="number" 
                   value={newListing.bedrooms || ''}
                   onChange={e => setNewListing({...newListing, bedrooms: Number(e.target.value)})}
                   className="w-full px-4 py-3 bg-[#050505] border border-[#1A1A1A] rounded-xl focus:border-gold outline-none text-white transition-all"
                 />
               </div>
               <div>
                 <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-2 font-bold">Bathrooms</label>
                 <input 
                   type="number" 
                   step="0.5"
                   value={newListing.bathrooms || ''}
                   onChange={e => setNewListing({...newListing, bathrooms: Number(e.target.value)})}
                   className="w-full px-4 py-3 bg-[#050505] border border-[#1A1A1A] rounded-xl focus:border-gold outline-none text-white transition-all"
                 />
               </div>
             </div>
             <div className="md:col-span-2">
               <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-2 font-bold">Curated Details</label>
               <textarea 
                 value={newListing.description}
                 onChange={e => setNewListing({...newListing, description: e.target.value})}
                 className="w-full px-4 py-3 bg-[#050505] border border-[#1A1A1A] rounded-xl focus:border-gold outline-none h-24 text-white transition-all resize-none"
                 placeholder="Feature highlights..."
               />
             </div>
             <div className="md:col-span-2 flex justify-end gap-4 mt-2">
               <button 
                 type="button"
                 onClick={() => setIsAdding(false)}
                 className="px-6 py-2 text-[#A0A0A0] hover:text-white transition-colors uppercase text-[10px] tracking-widest font-bold"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 className="luxury-button"
               >
                 Commit to Portfolio
               </button>
             </div>
           </form>
         </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#333]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <motion.div 
              key={listing.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] overflow-hidden hover:border-gold/30 transition-all group shadow-xl"
            >
              <div className="h-80 bg-[#111] relative overflow-hidden border-b border-[#1A1A1A]">
                {listing.imageUrl ? (
                  <img src={listing.imageUrl} alt={listing.address} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <Home className="w-16 h-16 text-[#222] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:text-gold/5 transition-all duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60" />
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-[#050505]/50 backdrop-blur-md rounded-full text-[#A0A0A0] hover:text-white border border-[#333] transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-xl font-sans text-white font-medium">${listing.price.toLocaleString()}</p>
                  <span className="text-[8px] text-gold uppercase tracking-[0.2em] font-black">Active Asset</span>
                </div>
                <p className="text-xs text-[#666] font-medium tracking-tight line-clamp-1">{listing.address}</p>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.15em] text-[#333] pt-3 border-t border-[#111] font-black">
                  <span className="flex items-center gap-1.5"><strong className="text-white text-xs">{listing.bedrooms}</strong> BEDS</span>
                  <span className="flex items-center gap-1.5"><strong className="text-white text-xs">{listing.bathrooms}</strong> BATHS</span>
                </div>
              </div>
            </motion.div>
          ))}
          {listings.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 bg-[#0A0A0A] rounded-2xl border border-dashed border-[#1A1A1A]">
               <Home className="w-12 h-12 text-[#222] mx-auto mb-4" />
               <h3 className="text-lg font-sans text-[#A0A0A0]">Portfolio Empty</h3>
               <p className="text-sm text-[#666] mt-2">Initialize your first luxury listing above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
