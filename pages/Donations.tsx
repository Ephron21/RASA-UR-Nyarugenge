
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Handshake, ShieldCheck, Sparkles, Send, Loader2, 
  CheckCircle2, DollarSign, ArrowRight, User, Mail, Phone, 
  Info, CreditCard, Smartphone, Copy, Check, TrendingUp,
  Coins, Gift, Target
} from 'lucide-react';
import { API } from '../services/api';
import { DonationProject, Donation } from '../types';

const Donations: React.FC = () => {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'bank'>('momo');
  const [copied, setCopied] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
  });

  useEffect(() => {
    API.donations.projects.getAll().then(data => {
      setProjects(data.filter(p => p.isActive));
      setLoading(false);
    });
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const donation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: formData.donorName,
      email: formData.email,
      phone: formData.phone,
      amount: Number(formData.amount),
      currency: 'RWF',
      category: selectedProject ? 'Project-based' : 'One-time',
      project: selectedProject?.title,
      date: new Date().toISOString(),
      status: 'Pending',
      transactionId: `${paymentMethod.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    try {
      await API.donations.create(donation);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ donorName: '', email: '', phone: '', amount: '' });
        setSelectedProject(null);
      }, 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-white relative overflow-x-hidden">
      {/* Moving Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0], 
            y: [0, -100, 50, 0],
            rotate: [0, 45, -45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -right-20 w-[40rem] h-[40rem] bg-cyan-100/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 40, 0], 
            y: [0, 60, -120, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -left-20 w-[35rem] h-[35rem] bg-blue-100/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-cyan-50/10 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-container px-4 relative z-10">
        
        {/* Header with enhanced animation */}
        <header className="mb-24 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-cyan-50 border border-cyan-100 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em] shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" /> Support The Vision
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-bold font-serif italic text-gray-900 leading-[0.95] tracking-tight"
          >
            Invest In <span className="text-cyan-500">Grace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl font-light leading-relaxed max-w-3xl mx-auto"
          >
            "God loves a cheerful giver." Your stewardship directly funds outreaches, 
            sanctuary equipment, and member welfare at RASA UR-Nyarugenge.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Targeted Projects */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black font-serif italic text-gray-900">Current Mandates</h3>
                  <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Strategic Ministry Investments</p>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                  <Target size={24} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, idx) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedProject(project)}
                    className={`cursor-pointer group relative bg-white p-7 rounded-[3.5rem] border-2 transition-all duration-500 ${
                      selectedProject?.id === project.id 
                        ? 'border-cyan-500 shadow-3xl shadow-cyan-100/50 scale-[1.02]' 
                        : 'border-gray-50 hover:border-cyan-100 hover:shadow-xl'
                    }`}
                  >
                    {selectedProject?.id === project.id && (
                      <motion.div 
                        layoutId="active-shimmer"
                        className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-[3.5rem]" 
                      />
                    )}
                    
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute top-4 right-4">
                        <div className={`p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-colors ${selectedProject?.id === project.id ? 'bg-cyan-500 text-white' : 'bg-black/20 text-white'}`}>
                          <Gift size={18} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-2xl font-black text-gray-900 leading-tight">{project.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
                      
                      <div className="pt-6 space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                             <TrendingUp size={12} className="text-cyan-500" />
                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Acquisition Level</span>
                          </div>
                          <span className="text-xs font-black text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">{((project.raised / project.goal) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${(project.raised / project.goal) * 100}%` }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-400">
                          <span>{project.raised.toLocaleString()} RWF</span>
                          <span>Goal: {project.goal.toLocaleString()} RWF</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Redesigned Payment Access Hub */}
            <div className="bg-gray-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Coins size={300} strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black font-serif italic">Access Credentials</h3>
                  <p className="text-cyan-400/70 text-sm font-black uppercase tracking-widest">Official Fellowship Channels</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20"><Smartphone size={24}/></div>
                      <div>
                         <p className="text-[10px] font-black text-amber-500 uppercase">Mobile Gateway</p>
                         <p className="font-black text-xl">MoMo Pay</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors">
                      <span className="text-4xl font-black font-mono tracking-tighter text-amber-500">411695</span>
                      <button onClick={() => copyToClipboard('411695', 'momo')} className="p-3 bg-white/5 rounded-xl hover:bg-amber-500 transition-all group">
                        {copied === 'momo' ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-white/40 group-hover:text-white"/>}
                      </button>
                    </div>
                    <p className="text-[10px] font-medium text-gray-400 text-center italic">Verify: Lambert (Financial Steward)</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20"><CreditCard size={24}/></div>
                      <div>
                         <p className="text-[10px] font-black text-cyan-400 uppercase">Institutional Account</p>
                         <p className="font-black text-xl">BPR Transfer</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black tracking-widest text-cyan-400">408421629010134</span>
                        <button onClick={() => copyToClipboard('408421629010134', 'bank')} className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500 transition-all">
                          {copied === 'bank' ? <Check size={14}/> : <Copy size={14}/>}
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400">Bank of Populaire (BPR)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Submission Form (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 pb-12">
            <motion.div 
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 md:p-16 rounded-[4.5rem] shadow-3xl border border-gray-100 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center space-y-10">
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                      <div className="relative w-full h-full bg-green-50 text-green-500 rounded-[3rem] flex items-center justify-center shadow-inner border border-green-100">
                        <CheckCircle2 size={64} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black font-serif italic text-gray-900 leading-tight">Contribution Logged</h3>
                      <p className="text-gray-500 font-medium text-lg px-6">We have received your pledge sequence. A steward will verify the transaction and update the mission ledger shortly.</p>
                    </div>
                    <button 
                      onClick={() => setIsSuccess(false)} 
                      className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Return to Portal
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" exit={{ opacity: 0 }} className="space-y-10" onSubmit={handleDonate}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black font-serif italic text-gray-900">Initiate Offering</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identify your divine deposit</p>
                      </div>
                      <div className="flex gap-2 p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
                        <button type="button" onClick={() => setPaymentMethod('momo')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'momo' ? 'bg-amber-500 text-white shadow-xl' : 'text-gray-400 hover:text-amber-500'}`}>Momo Pay</button>
                        <button type="button" onClick={() => setPaymentMethod('bank')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'bank' ? 'bg-cyan-500 text-white shadow-xl' : 'text-gray-400 hover:text-cyan-600'}`}>Bank Transfer</button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { id: 'donorName', label: 'Full Legal Identity', placeholder: 'Enter Name', icon: User, type: 'text' },
                        { id: 'email', label: 'Communication Hub (Email)', placeholder: 'donor@example.com', icon: Mail, type: 'email' },
                        { id: 'phone', label: 'Pulse Line (Phone)', placeholder: '+250...', icon: Phone, type: 'tel' },
                      ].map((field, i) => (
                        <motion.div 
                          key={field.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                          className="space-y-2.5"
                        >
                          <label className="text-[10px] font-black text-gray-400 ml-5 uppercase tracking-widest">{field.label}</label>
                          <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors">
                              <field.icon size={18} />
                            </div>
                            <input 
                              required 
                              type={field.type}
                              value={(formData as any)[field.id]} 
                              onChange={e => setFormData({...formData, [field.id]: e.target.value})} 
                              placeholder={field.placeholder} 
                              className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all border-2 border-transparent focus:border-cyan-100" 
                            />
                          </div>
                        </motion.div>
                      ))}

                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2.5"
                      >
                        <label className="text-[10px] font-black text-gray-400 ml-5 uppercase tracking-widest">Sowing Magnitude (RWF)</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors">
                            <DollarSign size={20} />
                          </div>
                          <input 
                            required 
                            type="number" 
                            value={formData.amount} 
                            onChange={e => setFormData({...formData, amount: e.target.value})} 
                            placeholder="Min. 500 RWF" 
                            min="500" 
                            className="w-full pl-16 pr-8 py-6 bg-gray-50 rounded-[2.2rem] outline-none font-black text-2xl focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all border-2 border-transparent focus:border-cyan-100 text-cyan-600 placeholder:text-gray-300" 
                          />
                        </div>
                      </motion.div>
                    </div>

                    <div className="p-8 bg-cyan-50/50 border-2 border-cyan-100/50 rounded-[2.5rem] space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Info size={80}/></div>
                      <p className="text-[11px] font-black text-cyan-700 uppercase tracking-widest flex items-center gap-2 relative z-10"><Info size={16}/> Verification Protocol</p>
                      <ul className="text-xs text-cyan-800/80 leading-relaxed font-bold space-y-2 relative z-10">
                        <li className="flex gap-3 items-start"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0"></div> Select a targeted mission or general offering.</li>
                        <li className="flex gap-3 items-start"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0"></div> Transmit funds to the identified gateway.</li>
                        <li className="flex gap-3 items-start"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0"></div> Complete this log to finalize synchronization.</li>
                      </ul>
                    </div>

                    <button 
                      disabled={isSubmitting} 
                      className="w-full py-6 bg-gray-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:bg-cyan-500 transition-all flex items-center justify-center gap-4 active:scale-95 group"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                          <Handshake size={24} className="group-hover:rotate-12 transition-transform" /> 
                          Commit Offering
                        </>
                      )}
                    </button>
                    
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[9px] font-black uppercase text-gray-300 tracking-[0.3em] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-cyan-400" /> Secure Ecclesiological Network
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Donations;
