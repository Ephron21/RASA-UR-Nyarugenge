
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Music, Shield, MessageSquare, 
  Users, Handshake, Globe, Info, Mail, 
  Activity, Star, Flame, Zap, Mic, Cross, CheckCircle, ArrowRight, Sparkles,
  X, Send, Phone, User as UserIcon, GraduationCap, MapPin, CheckCircle2, Loader2,
  ChevronRight, ChevronLeft, Award, BookOpen
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const activeDept = departments.find(d => d.id === id) || null;

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    diocese: user?.diocese || DIOCESES[0],
    level: user?.level || LEVELS[0],
    program: user?.program || '',
    motivation: '',
    experience: ''
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (!showInterestModal) {
      setTimeout(() => {
        setCurrentStep(1);
        setIsSuccess(false);
      }, 500);
    }
  }, [showInterestModal]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-container px-4">
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

      {/* REFACTORED Express Interest Modal - Scrollable Multi-step Interactive Journey */}
      <AnimatePresence>
        {showInterestModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} 
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden border border-white relative flex flex-col max-h-[90vh]"
            >
              {/* Header - Fixed at Top */}
              <div className="relative h-44 shrink-0 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500 rounded-full blur-[100px]"></div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400 rounded-full blur-[100px]"></div>
                </div>

                <button 
                  onClick={() => setShowInterestModal(false)}
                  className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/10 transition-all z-20 group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center mx-auto text-cyan-600 shadow-2xl">
                    {React.createElement(IconMap[activeDept?.icon || 'Flame'], { size: 28 })}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-cyan-400 tracking-[0.4em]">Section {currentStep} of 3</p>
                    <h3 className="text-3xl font-black font-serif italic text-white leading-tight">Join {activeDept?.name}</h3>
                  </div>
                </div>

                {/* Internal Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  />
                </div>
              </div>

              {/* Scrollable Body Container */}
              <div className="flex-grow overflow-y-auto scroll-hide p-8 md:p-14 bg-[#FDFDFD]">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="py-12 text-center space-y-8"
                    >
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative w-full h-full bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-green-100">
                          <CheckCircle2 size={64} strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="space-y-4 px-6">
                        <h4 className="text-4xl font-black text-gray-900 font-serif italic tracking-tight leading-tight">Divine Initiative Sent</h4>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">
                          Thank you, <span className="text-cyan-600 font-bold">{formData.fullName.split(' ')[0]}</span>. Your interest in <span className="font-bold">{activeDept?.name}</span> has been securely transmitted.
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowInterestModal(false)}
                        className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl hover:bg-cyan-600"
                      >
                        Return to Fellowship
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-10">
                      <div className="min-h-[320px]">
                        {currentStep === 1 && (
                          <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="space-y-2 border-l-4 border-cyan-500 pl-6">
                              <h4 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic font-serif">
                                Identity & Root
                              </h4>
                              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Confirm your fellowship credentials</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Legal Full Name</label>
                                <div className="relative">
                                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                  <input 
                                    value={formData.fullName} 
                                    onChange={e => updateFormData('fullName', e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all shadow-inner" 
                                    placeholder="e.g. John Doe"
                                  />
                                </div>
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Primary Email</label>
                                <div className="relative">
                                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                  <input 
                                    type="email"
                                    value={formData.email} 
                                    onChange={e => updateFormData('email', e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all shadow-inner" 
                                    placeholder="student@ur.ac.rw"
                                  />
                                </div>
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Contact Phone</label>
                                <div className="relative">
                                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                  <input 
                                    value={formData.phone} 
                                    onChange={e => updateFormData('phone', e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all shadow-inner" 
                                    placeholder="+250..."
                                  />
                                </div>
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Home Diocese</label>
                                <div className="relative">
                                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                  <select 
                                    value={formData.diocese} 
                                    onChange={e => updateFormData('diocese', e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                  >
                                    {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 2 && (
                          <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="space-y-2 border-l-4 border-cyan-500 pl-6">
                              <h4 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic font-serif">
                                Academic Synchronization
                              </h4>
                              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Excellence in both study and service</p>
                            </div>
                            <div className="space-y-8">
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest group-focus-within:text-cyan-500 transition-colors">Academic Program</label>
                                <div className="relative">
                                  <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                  <input 
                                    value={formData.program} 
                                    onChange={e => updateFormData('program', e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all shadow-inner" 
                                    placeholder="e.g. BEng. Software Engineering"
                                  />
                                </div>
                              </div>
                              <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Current Learning Level</label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                  {LEVELS.map(level => (
                                    <button 
                                      key={level}
                                      type="button"
                                      onClick={() => updateFormData('level', level)}
                                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        formData.level === level 
                                          ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-100 scale-105' 
                                          : 'bg-gray-50 text-gray-400 hover:bg-cyan-50 hover:text-cyan-600 border border-transparent hover:border-cyan-100'
                                      }`}
                                    >
                                      {level.split(' ')[1]}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 3 && (
                          <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="space-y-2 border-l-4 border-cyan-500 pl-6">
                              <h4 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic font-serif">
                                Spiritual Stewardship
                              </h4>
                              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Your divine contribution to RASA</p>
                            </div>
                            <div className="space-y-8">
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-2">
                                  <BookOpen size={14} className="text-cyan-500" /> Divine Motivation (Required)
                                </label>
                                <textarea 
                                  rows={5}
                                  value={formData.motivation} 
                                  onChange={e => updateFormData('motivation', e.target.value)}
                                  className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-[2rem] font-medium text-sm outline-none transition-all resize-none leading-relaxed shadow-inner" 
                                  placeholder="Describe how the Spirit has led you to this ministry..."
                                />
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest flex items-center gap-2">
                                  <Star size={14} className="text-cyan-500" /> Talents or Relevant History
                                </label>
                                <div className="relative">
                                  <Award className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                  <input 
                                    value={formData.experience} 
                                    onChange={e => updateFormData('experience', e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all shadow-inner" 
                                    placeholder="e.g. Instrumental proficiency, past ushering..."
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Fixed at Bottom */}
              {!isSuccess && (
                <div className="p-10 md:px-14 md:py-8 border-t border-gray-100 flex items-center justify-between gap-6 bg-white shrink-0">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all px-4 py-2 rounded-xl hover:bg-gray-50 ${
                      currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  
                  {currentStep < 3 ? (
                    <button 
                      onClick={nextStep}
                      className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 group active:scale-95 transition-all hover:bg-cyan-600"
                    >
                      Continue <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button 
                      disabled={isSubmitting || !formData.motivation.trim()}
                      onClick={handleInterestSubmit}
                      className="px-12 py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(6,182,212,0.3)] flex items-center gap-4 group active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none hover:bg-cyan-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Broadcasting...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Broadcast Interest
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Departments;
