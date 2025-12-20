
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Music, Shield, MessageSquare, 
  Users, Handshake, Globe, Info, Mail, 
  Activity, Star, Flame, Zap, Mic, Cross, CheckCircle, ArrowRight, Sparkles,
  X, Send, Phone, User as UserIcon, GraduationCap, MapPin, CheckCircle2, Loader2
} from 'lucide-react';
import { Department, User } from '../types';
import { DIOCESES, LEVELS } from '../constants';

interface DepartmentsProps {
  departments: Department[];
  user?: User | null;
}

const IconMap: Record<string, any> = {
  Flame: Flame,
  Music: Music,
  Globe: Globe,
  Activity: Activity,
  Shield: Shield,
  Heart: Heart,
  Star: Star,
  Zap: Zap,
  Mic: Mic,
  Handshake: Handshake
};

const Departments: React.FC<DepartmentsProps> = ({ departments, user }) => {
  const { id } = useParams<{ id: string }>();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Find the selected department or default to null
  const activeDept = departments.find(d => d.id === id) || null;

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowInterestModal(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-container px-4">
        
        {/* Navigation / Filter */}
        <div className="flex flex-wrap gap-2 mb-16 justify-center">
          <Link 
            to="/departments" 
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              !id ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-100' : 'bg-gray-50 text-gray-400 hover:bg-cyan-50 hover:text-cyan-600'
            }`}
          >
            All Departments
          </Link>
          {departments.map(dept => (
            <Link 
              key={dept.id}
              to={`/departments/${dept.id}`}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                id === dept.id ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-100' : 'bg-gray-50 text-gray-400 hover:bg-cyan-50 hover:text-cyan-600'
              }`}
            >
              {dept.name}
            </Link>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!activeDept ? (
            <motion.div 
              key="listing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-3 mb-8 text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold font-serif italic text-gray-900">RASA <span className="text-cyan-500">Ministries</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">Discover your place of service within our diverse range of campus departments.</p>
              </div>
              {departments.map((dept, i) => {
                const Icon = IconMap[dept.icon] || Info;
                return (
                  <motion.div 
                    key={dept.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-cyan-50 text-cyan-500 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                      <Icon size={32} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-gray-900">{dept.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{dept.description}</p>
                    </div>
                    <Link 
                      to={`/departments/${dept.id}`} 
                      className="inline-flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-widest pt-4 group-hover:gap-4 transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
            >
              {/* Content Area */}
              <div className="lg:col-span-7 space-y-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-50 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em]">
                    <Sparkles size={14} /> {activeDept.category || 'Official RASA Department'}
                  </div>
                  <h2 className="text-6xl font-bold font-serif italic text-gray-900 leading-tight">
                    {activeDept.name}
                  </h2>
                  <p className="text-xl text-gray-500 leading-relaxed font-light italic border-l-4 border-cyan-500 pl-8 py-2">
                    {activeDept.details || activeDept.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={18} className="text-cyan-500" /> Core Activities
                    </h4>
                    <ul className="space-y-4">
                      {activeDept.activities && activeDept.activities.length > 0 ? (
                        activeDept.activities.map((act, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="text-cyan-500 shrink-0 mt-1" size={16} />
                            <span className="font-bold text-gray-700 text-sm">{act}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">Activity list coming soon.</p>
                      )}
                    </ul>
                  </div>
                  <div className="p-8 bg-cyan-900 text-white rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
                    <Heart className="text-cyan-400" size={40} />
                    <h4 className="text-lg font-bold font-serif">A Place for You</h4>
                    <p className="text-xs opacity-70 leading-relaxed">God has gifted you with talents that our ministry needs. Step out in faith and join our family.</p>
                    <button 
                      onClick={() => setShowInterestModal(true)}
                      className="px-8 py-3 bg-cyan-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-cyan-900 transition-all active:scale-95"
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="relative aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group border-8 border-white bg-gray-100">
                  <img 
                    src={activeDept.image || `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064&auto=format&fit=crop`} 
                    alt={activeDept.name} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40 group-hover:opacity-10"></div>
                  <div className="absolute bottom-10 left-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
                      {React.createElement(IconMap[activeDept.icon] || Info, { size: 40, className: "text-white shadow-sm" })}
                    </div>
                  </div>
                </div>
                
                <div className="p-10 bg-white rounded-[3rem] border border-gray-100 space-y-6">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Leadership Note</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 font-bold">L</div>
                    <div>
                      <p className="font-bold text-gray-900">Head of Department</p>
                      <p className="text-xs text-gray-500">Appointed for 2024/2025</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium italic">"Our vision in this department is to ensure that every student discovers their divine purpose while excelling in their academics."</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Express Interest Modal */}
      <AnimatePresence>
        {showInterestModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-3xl overflow-hidden border border-white"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-cyan-600 tracking-[0.3em]">Join Ministry</p>
                  <h3 className="text-3xl font-black font-serif italic text-gray-900">Apply for {activeDept?.name}</h3>
                </div>
                <button 
                  onClick={() => setShowInterestModal(false)}
                  className="p-4 bg-white text-gray-400 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100"
                >
                  <X size={20}/>
                </button>
              </div>

              <div className="p-10">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 size={48} /></div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-gray-900 tracking-tight">Interest Received!</h4>
                      <p className="text-gray-500 font-medium">The department head will contact you shortly to complete your registration.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleInterestSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-1.5"><UserIcon size={12} className="text-cyan-500"/> Full Name</label>
                        <input name="name" defaultValue={user?.fullName || ''} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border border-gray-100 outline-none focus:bg-white" placeholder="Enter your name" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-1.5"><Mail size={12} className="text-cyan-500"/> Email</label>
                        <input name="email" type="email" defaultValue={user?.email || ''} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border border-gray-100 outline-none focus:bg-white" placeholder="student@ur.ac.rw" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12} className="text-cyan-500"/> Phone</label>
                        <input name="phone" defaultValue={user?.phone || ''} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border border-gray-100 outline-none focus:bg-white" placeholder="+250..." />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-cyan-500"/> Diocese</label>
                        <select name="diocese" defaultValue={user?.diocese || DIOCESES[0]} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border border-gray-100 outline-none focus:bg-white">
                          {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-1.5"><GraduationCap size={12} className="text-cyan-500"/> Academic Level</label>
                      <select name="level" defaultValue={user?.level || LEVELS[0]} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border border-gray-100 outline-none focus:bg-white">
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={12} className="text-cyan-500"/> Why do you want to join?</label>
                      <textarea rows={4} required className="w-full px-6 py-4 bg-gray-50 rounded-3xl font-medium text-sm border border-gray-100 outline-none focus:bg-white resize-none" placeholder="Share your divine burden or talents..." />
                    </div>
                    <button 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full py-5 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-cyan-500/20 hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18}/>} 
                      Register Interest
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Departments;
