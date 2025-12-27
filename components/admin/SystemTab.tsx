
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Terminal, HardDrive, RefreshCw, 
  CheckCircle2, RotateCcw, ShieldCheck, Zap, 
  Download, History, Trash2, AlertCircle, 
  Cpu, Activity, Server, FileBox, Save,
  ChevronRight, ArrowLeft, Loader2, Code2, ExternalLink, Signal
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
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'backups' | 'dev'>('monitor');
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<'Idle' | 'Checking' | 'Success' | 'Fail'>('Idle');

  const fetchBackups = async () => {
    const b = await (API.system as any).getBackups();
    setBackups(b || []);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handlePing = async () => {
    setPingStatus('Checking');
    try {
      const health = await API.system.getHealth();
      if (health.status === 'Online') setPingStatus('Success');
      else setPingStatus('Fail');
    } catch {
      setPingStatus('Fail');
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Cpu className="text-cyan-500" size={32} /> Kernel Infrastructure
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">System architecture & data persistence</p>
        </div>
        
        <div className="flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
           {['monitor', 'backups', 'dev'].map((t) => (
             <button 
              key={t}
              onClick={() => setActiveSubTab(t as any)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
             >
               {t === 'dev' ? 'Developer Portal' : t.charAt(0).toUpperCase() + t.slice(1)}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'monitor' && (
          <motion.div 
            key="monitor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
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
                   <button onClick={handleCreateBackup} disabled={isBackingUp} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl disabled:opacity-50">
                     {isBackingUp ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Generate System Snapshot
                   </button>
                </div>
              </div>
            </div>

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
                           <span className="text-[10px] text-cyan-900">REQ ID: {log.id} • COMMIT_SUCCESS</span>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] text-cyan-950 font-black uppercase tracking-widest">RASA Kernel System Logs</p>
                    <button onClick={onResetDB} className="text-[9px] font-black text-red-900 hover:text-red-500 transition-colors uppercase flex items-center gap-2">
                       <RotateCcw size={10}/> Restart Instance
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'backups' && (
           <motion.div 
            key="backups" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
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
            </div>
            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h4 className="text-xl font-black font-serif italic text-gray-900">Snapshot Registry</h4>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recovery Points</span>
               </div>
               <div className="divide-y divide-gray-50">
                  {backups.map(b => (
                    <div key={b.id} className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all"><Database size={24}/></div>
                          <div>
                             <h5 className="font-black text-gray-900 text-lg tracking-tight">{b.description}</h5>
                             <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">ID: {b.id} • {b.size}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleRestore(b.id)} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-600 transition-all">Restore</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'dev' && (
           <motion.div 
            key="dev" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
           >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Code2 size={120}/></div>
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-[9px] font-black uppercase tracking-widest">API Interface</div>
                    <h4 className="text-3xl font-black font-serif italic text-gray-900">Interactive Documentation</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Launch the Swagger UI to interact with the MongoDB backend endpoints. 
                      Test data sequences, payloads, and response headers in real-time.
                    </p>
                 </div>
                 <a 
                  href="http://localhost:5000/api-docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl"
                 >
                   Launch Swagger Docs <ExternalLink size={18}/>
                 </a>
               </div>

               <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">Connectivity</div>
                    <h4 className="text-3xl font-black font-serif italic text-gray-900">Kernel Ping Test</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Verify the handshake between this frontend client and the remote MongoDB kernel.
                    </p>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                    <div className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${
                      pingStatus === 'Success' ? 'bg-green-50 border-green-100 text-green-700' : 
                      pingStatus === 'Fail' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}>
                       <div className="flex items-center gap-4">
                          <Signal size={24} className={pingStatus === 'Checking' ? 'animate-pulse' : ''} />
                          <span className="font-black text-xs uppercase tracking-widest">Connection: {pingStatus}</span>
                       </div>
                       {pingStatus === 'Success' && <CheckCircle2 size={24}/>}
                       {pingStatus === 'Fail' && <AlertCircle size={24}/>}
                    </div>
                    <button 
                      onClick={handlePing}
                      disabled={pingStatus === 'Checking'}
                      className="w-full py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 shadow-lg"
                    >
                      {pingStatus === 'Checking' ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18}/>} Run Diagnostic Trace
                    </button>
                 </div>
               </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SystemTab;
