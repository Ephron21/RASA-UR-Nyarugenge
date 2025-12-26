
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Terminal, HardDrive, RefreshCw, 
  CheckCircle2, RotateCcw, ShieldCheck, Zap, 
  Download, History, Trash2, AlertCircle, 
  Cpu, Activity, Server, FileBox, Save,
  ChevronRight, ArrowLeft, Loader2
} from 'lucide-react';
import { API } from '../../services/api';

interface SystemTabProps {
  dbHealth: any;
  logs: any[];
  onResetDB: () => void;
}

const SystemTab: React.FC<SystemTabProps> = ({ dbHealth, logs, onResetDB }) => {
  const [backups, setBackups] = useState<any[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'backups'>('monitor');
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const fetchBackups = async () => {
    const b = await (API.system as any).getBackups();
    setBackups(b || []);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    await (API.system as any).createBackup('Manual System Snapshot');
    await fetchBackups();
    setIsBackingUp(false);
  };

  const handleRestore = async (id: string) => {
    if (!window.confirm("CRITICAL: Restoring will overwrite all current data with this snapshot. Continue?")) return;
    setIsRestoring(id);
    const success = await (API.system as any).restoreBackup(id);
    if (success) {
      window.location.reload();
    } else {
      setIsRestoring(null);
      alert("Restoration failed.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Cpu className="text-cyan-500" size={32} /> Kernel Infrastructure
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">System architecture & data persistence</p>
        </div>
        
        <div className="flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
           <button 
            onClick={() => setActiveSubTab('monitor')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'monitor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
           >
             Monitoring
           </button>
           <button 
            onClick={() => setActiveSubTab('backups')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'backups' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
           >
             Backups
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'monitor' ? (
          <motion.div 
            key="monitor"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Persistence Status */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-10 shadow-sm h-fit">
                <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                  <h4 className="text-xl font-black font-serif italic text-gray-900 flex items-center gap-3">
                    <Database className="text-cyan-500" size={24} /> Persistence
                  </h4>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                     <ShieldCheck size={12} /> Encrypted
                  </div>
                </div>
                
                <div className="space-y-5">
                  {[
                    { label: 'DB HEALTH', value: dbHealth.status, icon: CheckCircle2, color: 'text-green-500' },
                    { label: 'ENGINE VERSION', value: dbHealth.version || '2.4.0-Stable', icon: Server, color: 'text-blue-500' },
                    { label: 'STORAGE USED', value: dbHealth.size, icon: HardDrive, color: 'text-orange-500' },
                    { label: 'SYSTEM UPTIME', value: '100%', icon: Activity, color: 'text-cyan-500' },
                    { label: 'LAST RECOVERY POINT', value: backups[0]?.timestamp ? new Date(backups[0].timestamp).toLocaleTimeString() : 'N/A', icon: History, color: 'text-purple-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className={`${item.color} group-hover:scale-125 transition-transform`}/>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                      </div>
                      <span className="font-black text-gray-900 text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                   <button 
                    onClick={handleCreateBackup}
                    disabled={isBackingUp}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl disabled:opacity-50"
                   >
                     {/* Fix: use Loader2 component imported from lucide-react */}
                     {isBackingUp ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
                     Generate System Snapshot
                   </button>
                </div>
              </div>

              {/* Data Distribution Card */}
              <div className="bg-cyan-500 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <FileBox size={240} />
                 </div>
                 <div className="relative z-10">
                    <h5 className="text-xl font-black font-serif italic mb-2">Resource Allocation</h5>
                    <p className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest mb-6">Cluster Data Summary</p>
                    <div className="space-y-4">
                       {[
                         { label: 'Member Records', val: '84%' },
                         { label: 'Media Assets', val: '12%' },
                         { label: 'System Logs', val: '4%' }
                       ].map((stat, idx) => (
                         <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black">
                               <span>{stat.label}</span>
                               <span>{stat.val}</span>
                            </div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: stat.val }} className="h-full bg-white" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            {/* Console / Activity Logs */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="bg-gray-900 p-10 rounded-[3.5rem] text-cyan-400 font-mono text-sm flex flex-col h-full shadow-3xl border border-white/5 relative">
                 <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-cyan-800">Terminal Environment</span>
                   </div>
                   <div className="flex items-center gap-2 text-[9px] font-black text-cyan-900">
                      <Zap size={12} /> RUNNING 0.0.0.0:5000
                   </div>
                 </div>

                 <div className="flex-grow overflow-y-auto scroll-hide space-y-3 pr-2 font-medium">
                    {logs.map((log, i) => (
                      <div key={log.id} className="flex gap-4 group">
                        <span className="text-cyan-900 select-none">[{i+1}]</span>
                        <div className="flex flex-col">
                           <div className="flex items-center gap-3">
                              <span className="text-cyan-700 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                              <span className="text-white font-bold opacity-80">{log.action}</span>
                           </div>
                           <span className="text-[10px] text-cyan-900 group-hover:text-cyan-800 transition-colors">REQ ID: {log.id} • COMMIT_SUCCESS</span>
                        </div>
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
                         <Terminal size={64}/>
                         <p className="italic text-xs">No active sequences initiated.</p>
                      </div>
                    )}
                 </div>

                 <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] text-cyan-950 font-black uppercase tracking-widest">RASA Kernel System Logs • Nyarugenge Core</p>
                    <button onClick={onResetDB} className="text-[9px] font-black text-red-900 hover:text-red-500 transition-colors uppercase flex items-center gap-2">
                       <RotateCcw size={10}/> Restart Instance
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* BACKUP MANAGEMENT VIEW */
          <motion.div 
            key="backups"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                 <div className="p-4 bg-cyan-50 text-cyan-500 rounded-2xl"><Download size={24}/></div>
                 <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available Backups</p>
                    <p className="text-2xl font-black text-gray-900">{backups.length} Snapshots</p>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                 <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><History size={24}/></div>
                 <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Auto-Recovery</p>
                    <p className="text-2xl font-black text-gray-900">Active</p>
                 </div>
              </div>
              <button 
                onClick={handleCreateBackup}
                disabled={isBackingUp}
                className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all active:scale-95 group shadow-xl"
              >
                 {/* Fix: use Loader2 component imported from lucide-react */}
                 {isBackingUp ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>}
                 <span className="text-sm font-black uppercase tracking-widest">Create Recovery Point</span>
              </button>
            </div>

            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <h4 className="text-xl font-black font-serif italic text-gray-900">Snapshot Registry</h4>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Point-in-time Recovery List</span>
               </div>
               
               <div className="divide-y divide-gray-50">
                  {backups.map(b => (
                    <div key={b.id} className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
                             <Database size={24}/>
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h5 className="font-black text-gray-900 text-lg tracking-tight">{b.description}</h5>
                                <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[9px] font-black tracking-widest uppercase">STABLE</span>
                             </div>
                             <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                Snapshot ID: {b.id} • Captured {new Date(b.timestamp).toLocaleString()} • {b.size}
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleRestore(b.id)}
                            disabled={!!isRestoring}
                            className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-600 active:scale-95 transition-all shadow-lg shadow-gray-200"
                          >
                             {/* Fix: use Loader2 component imported from lucide-react */}
                             {isRestoring === b.id ? <Loader2 className="animate-spin" size={12}/> : <RotateCcw size={12}/>} Restore System
                          </button>
                          <button 
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Purge Snapshot"
                          >
                             <Trash2 size={16}/>
                          </button>
                       </div>
                    </div>
                  ))}
                  
                  {backups.length === 0 && (
                    <div className="py-32 text-center space-y-6">
                       <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                          <History size={40}/>
                       </div>
                       <p className="text-xl font-bold font-serif text-gray-300 italic">Snapshot registry is empty. Initializing recovery points recommended.</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-10 bg-orange-50 border-2 border-dashed border-orange-100 rounded-[3rem] flex items-start gap-6">
               <div className="p-4 bg-white rounded-2xl text-orange-500 shadow-sm"><AlertCircle size={28}/></div>
               <div className="space-y-2">
                  <h5 className="font-black text-orange-950 uppercase text-xs tracking-widest">Safety & Recovery Policy</h5>
                  <p className="text-sm text-orange-800/80 font-medium leading-relaxed max-w-2xl">
                     The RASA Kernel now strictly enforces data persistence. Permanent data wipes have been disabled in favor of System Snapshots. 
                     Any structural deletion automatically creates a recovery point, allowing the IT Super Master to revert sequences if anomalies occur.
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SystemTab;
