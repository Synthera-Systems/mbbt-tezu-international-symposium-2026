"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AbstractReviews() {
  const [submissions, setSubmissions] = useState<any[]>([]);
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
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (submissionId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/submission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, newStatus })
      });
      if (res.ok) {
        await fetchData(); 
        setSelectedItem(null); 
      } else {
        alert("Failed to update abstract status.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Rock-solid outer wrapper preventing vertical squish and adding margin
    <div className="h-[calc(100vh-6rem)] w-full bg-surface p-6 md:p-8 flex items-start gap-8 overflow-hidden">
      
      {/* ==========================================
          LEFT: MASTER LIST
          ========================================== */}
      <motion.div 
        layout 
        className="flex-1 w-full h-full bg-white rounded-[2rem] border border-surface-dim/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden min-w-0"
      >
        {/* Bulletproof Toolbar */}
        <div className="px-6 py-5 md:px-8 border-b border-surface-dim/30 bg-surface-bright/30 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-primary text-white text-[11px] font-bold px-4 py-2 rounded-full tracking-wider shadow-sm">
              {filteredSubmissions.length} TOTAL
            </span>
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest hidden lg:block ml-2">
              Scientific Review Queue
            </span>
          </div>
          
          <div className="relative flex gap-3 items-center border-l-2 px-2 py-3 w-full md:w-96 shrink-0">
            <svg className="w-6 h-6 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search ID, Title, or Author..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className=" bg-white border border-surface-dim/50 rounded-xl px-3 pr-4 py-3 text-sm font-inter focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all text-primary shadow-sm" 
            />
          </div>
        </div>

        {/* Table Wrapper with min-h-0 */}
        <div className="flex-1 overflow-auto py-4 min-h-0 relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-bright/90 sticky top-0 z-10 backdrop-blur-sm border-b border-surface-dim/30">
              <tr>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Abstract ID</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Study Details</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-surface-dim/20">
              {loading ? (
                <tr><td colSpan={3} className="px-8 py-24 text-center text-on-surface-variant">Syncing database...</td></tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr><td colSpan={3} className="px-8 py-24 text-center text-on-surface-variant font-medium text-base">No abstract submissions found.</td></tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedItem(sub)}
                    className={`cursor-pointer transition-colors border-l-4 group ${selectedItem?.id === sub.id ? 'bg-secondary/5 border-secondary' : 'hover:bg-surface-bright/50 border-transparent'}`}
                  >
                    <td className="px-8 py-6 align-top">
                      <p className="font-mono text-sm font-bold text-secondary pt-1">{sub.referenceId}</p>
                    </td>
                    <td className="px-8 py-6 align-top whitespace-normal max-w-lg">
                      <p className={`text-base font-bold leading-relaxed mb-3 transition-colors ${selectedItem?.id === sub.id ? 'text-primary' : 'text-primary'}`}>
                        {sub.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold bg-surface border border-surface-dim/50 px-2.5 py-1 rounded text-on-surface-variant uppercase tracking-widest shadow-sm">
                          {sub.type}
                        </span>
                        <span className="text-xs text-on-surface-variant italic truncate max-w-[300px]">
                          by {sub.authors}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 align-top pt-7">
                      <span className={`flex w-max items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full border tracking-wider uppercase ${
                        sub.status.includes('ACCEPTED') ? 'bg-green-50 text-green-700 border-green-200' :
                        sub.status === 'REJECTED' ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {sub.status.includes('ACCEPTED') && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        {sub.status === 'REJECTED' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ==========================================
          RIGHT: DETAIL PANEL
          ========================================== */}
      <AnimatePresence mode="wait">
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="xl:hidden fixed inset-0 bg-primary/20 z-40 backdrop-blur-sm" />
            
            <motion.div 
              layout
              key="detail-panel"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }} exit={{ opacity: 0, x: 50 }}
              className="fixed inset-y-4 right-4 left-4 z-50 bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-surface-dim/30 xl:relative xl:inset-auto xl:w-[500px] 2xl:w-[600px] xl:h-full xl:z-auto shrink-0"
            >
              {/* Header */}
              <div className="p-8 pb-5 border-b border-surface-dim/20 bg-surface-bright/30 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-primary">Abstract Review</h3>
                  <p className="text-sm font-mono font-bold text-secondary mt-1">{selectedItem.referenceId}</p>
                </div>
                <div className="flex gap-3">
                  <a href={selectedItem.fileUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-surface-dim/30 hover:bg-surface-bright rounded-xl text-on-surface-variant transition-all shadow-sm" title="Open PDF in new tab">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                  <button onClick={() => setSelectedItem(null)} className="p-2.5 bg-white border border-surface-dim/30 hover:bg-surface-bright rounded-xl text-on-surface-variant transition-all shadow-sm cursor-pointer active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 bg-white min-h-0">
                
                {/* PDF Viewer */}
                <div className="w-full h-96 bg-surface rounded-2xl border border-surface-dim/30 overflow-hidden relative shadow-inner">
                  {selectedItem.fileUrl.endsWith('.pdf') ? (
                    <iframe 
                      src={`${selectedItem.fileUrl}#toolbar=0&navpanes=0`} 
                      className="w-full h-full" 
                      title="Abstract Document"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center">
                      <svg className="w-16 h-16 text-surface-dim mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="text-base font-medium text-primary mb-2">Word Document Detected</p>
                      <p className="text-sm text-on-surface-variant mb-6">Browsers cannot preview Word docs directly.</p>
                      <a href={selectedItem.fileUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors">Download to Read</a>
                    </div>
                  )}
                </div>

                {/* Metadata Blocks */}
                <div className="bg-surface border border-surface-dim/20 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Study Title</p>
                    <p className="text-base font-bold text-primary leading-relaxed">{selectedItem.title}</p>
                  </div>
                  <hr className="border-surface-dim/30" />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Primary Authors</p>
                      <p className="text-sm font-medium text-primary">{selectedItem.authors}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Requested Format</p>
                      <span className="inline-block bg-secondary/10 text-secondary text-[11px] font-bold px-3 py-1.5 rounded-md border border-secondary/20 shadow-sm uppercase tracking-wider">
                        {selectedItem.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-8 border-t border-surface-dim/30 bg-surface-bright/50 shrink-0">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                      onClick={() => handleAction(selectedItem.id, "ACCEPTED_ORAL")} 
                      disabled={actionLoading} 
                      className="w-full bg-primary text-white text-sm font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
                    >
                      Approve Oral
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                      onClick={() => handleAction(selectedItem.id, "ACCEPTED_POSTER")} 
                      disabled={actionLoading} 
                      className="w-full bg-secondary text-white text-sm font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all shadow-md shadow-secondary/20 disabled:opacity-50 cursor-pointer"
                    >
                      Approve Poster
                    </motion.button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} 
                    onClick={() => handleAction(selectedItem.id, "REJECTED")} 
                    disabled={actionLoading} 
                    className="w-full bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] text-sm font-bold py-3.5 rounded-xl hover:bg-[#ffdad6] hover:border-[#ba1a1a]/50 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    Reject Submission
                  </motion.button>
                </div>
                <p className="font-inter text-[10px] text-on-surface-variant text-center mt-6 italic">
                  Decision email will be automatically sent to <span className="font-bold text-primary">{selectedItem.presenterEmail || 'the primary author'}</span>.
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}