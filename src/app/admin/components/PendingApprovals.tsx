"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PendingApprovals() {
  const [delegates, setDelegates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        const pending = data.delegates.filter(
          (d: any) => d.payment && (d.payment.status === 'PROCESSING' || d.payment.status === 'PENDING_APPROVAL')
        );
        setDelegates(pending);
      }
    } catch (err) {
      console.error("Failed to load approvals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (paymentId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/delegate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, newStatus })
      });
      if (res.ok) {
        await fetchData(); 
        setSelectedItem(null); 
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDelegates = delegates.filter(d => 
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.payment?.utrNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] w-full bg-surface p-6 md:p-8 flex flex-col overflow-hidden">
      
      {/* ==========================================
          MASTER LIST CONTAINER
          ========================================== */}
      <motion.div 
        layout 
        className="w-full h-full bg-white rounded-2xl py-3 border border-surface-dim/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden min-h-0"
      >
        {/* Toolbar */}
        <div className="px-6 py-5 md:px-8 border-b border-surface-dim/30 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-surface-bright/30 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-primary text-white text-[11px] font-bold px-4 py-2 rounded-full tracking-wider shadow-sm">
              {filteredDelegates.length} PENDING
            </span>
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest hidden lg:block ml-2">
              Latest Update: Just Now
            </span>
          </div>
          
          <div className="relative flex gap-3 items-center border-l-2 px-2 w-full md:w-96 shrink-0">
            <svg className="w-6 h-6 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder=" Search by UTR or Name..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className=" bg-white border border-surface-dim/50 rounded-xl px-6 pr-4 py-3 text-sm font-inter focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all text-primary shadow-sm" 
            />
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 overflow-auto py-4 min-h-0 relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-bright/90 sticky top-0 z-10 backdrop-blur-sm border-b border-surface-dim/30">
              <tr>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Applicant Name</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">UTR Number</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-surface-dim/20">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-24 text-center text-on-surface-variant">Syncing queue...</td></tr>
              ) : filteredDelegates.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-24 text-center text-on-surface-variant font-medium text-base">No pending approvals found in the queue.</td></tr>
              ) : (
                filteredDelegates.map((del) => (
                  <tr 
                    key={del.id} 
                    className="hover:bg-surface-bright/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <p className="font-bold text-primary text-base mb-1">{del.fullName}</p>
                      <p className="text-xs text-on-surface-variant truncate w-48">{del.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="text-[10px] font-bold bg-surface-dim/20 text-primary px-2.5 py-1 rounded shadow-sm">{del.participationType.replace('_', ' ')}</span>
                        <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2.5 py-1 rounded shadow-sm uppercase">{del.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm font-bold text-primary tracking-wider">{del.payment?.utrNumber}</td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => setSelectedItem(del)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-surface-dim/50 hover:border-secondary/50 text-primary hover:text-secondary font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 group-hover:shadow-md"
                      >
                        Review
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ==========================================
          CENTERED MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Blurred Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedItem(null)} 
              className="absolute inset-0 bg-primary/30 backdrop-blur-sm cursor-pointer" 
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-full bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-surface-dim/30"
            >
              {/* Header */}
              <div className="p-6 md:p-8 pb-5 flex items-center justify-between shrink-0 border-b border-surface-dim/20 bg-surface-bright/30">
                <h3 className="font-playfair text-2xl font-bold text-primary">Verification Details</h3>
                <button onClick={() => setSelectedItem(null)} className="p-2.5 bg-white border border-surface-dim/30 hover:bg-surface-bright rounded-xl text-on-surface-variant transition-all shadow-sm cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 bg-white min-h-0">
                
                {/* Image Viewer */}
                <div className="w-full h-53 sm:h-80 bg-surface rounded-2xl overflow-y-auto p-4 relative border border-surface-dim/30 shadow-inner">
                  <img 
                    src={selectedItem.payment?.screenshotUrl || "/api/placeholder/800/600"} 
                    alt="Receipt" 
                    // w-full makes it fit the box width, h-auto lets it grow as tall as it needs to be
                    className="w-full aspect-square rounded drop-shadow-md" 
                  />
                </div>

                {/* UTR Comparison Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-surface border border-surface-dim/30 rounded-2xl p-4 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Transaction ID</p>
                        <p className="font-mono text-base font-bold text-primary truncate" title={selectedItem.payment?.utrNumber}>{selectedItem.payment?.utrNumber}</p>
                    </div>
                    {/* <div className="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-2">OCR Detected</p>
                        <p className="font-mono text-base font-bold text-green-700 truncate">{selectedItem.payment?.utrNumber}</p>
                    </div> */}
                </div>

                {/* Details List */}
                <div className="bg-surface rounded-2xl p-6 space-y-4 border border-surface-dim/20 shadow-sm">
                  <div className="flex justify-between items-center border-b border-surface-dim/30 pb-4">
                    <p className="text-sm font-medium text-on-surface-variant">Applicant Name</p>
                    <p className="text-sm font-bold text-primary">{selectedItem.fullName}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-surface-dim/30 pb-4">
                    <p className="text-sm font-medium text-on-surface-variant">Amount Paid</p>
                    <p className="text-sm font-bold text-primary">{selectedItem.amount || "Refer to Category"}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-on-surface-variant">Date Submitted</p>
                    <p className="text-sm font-bold text-primary">
                      {new Date(selectedItem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 md:p-8 shrink-0 bg-surface-bright/50 border-t border-surface-dim/30">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                    onClick={() => handleAction(selectedItem.payment.id, "FAILED")} 
                    disabled={actionLoading} 
                    className="flex-1 border border-[#ba1a1a]/30 bg-[#ba1a1a] font-bold py-4 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer hover:bg-[#ffdad6] hover:border-[#ba1a1a]/50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    Reject
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                    onClick={() => handleAction(selectedItem.payment.id, "COMPLETED")} 
                    disabled={actionLoading} 
                    className="flex-1 bg-secondary text-white font-bold py-4 px-3 rounded-xl transition-all shadow-md shadow-secondary/20 disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer hover:bg-secondary/90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Approve Request
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}