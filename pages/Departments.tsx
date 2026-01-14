import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Heart, Music, Shield, MessageSquare, 
  Users, Handshake, Globe, Info, Mail, 
  Activity, Star, Flame, Zap, Mic, Cross, CheckCircle, ArrowRight, Sparkles,
  X, Send, Phone, User as UserIcon, GraduationCap, MapPin, CheckCircle2, Loader2,
  ChevronRight, ChevronLeft, Award, BookOpen
} from 'lucide-react';
import { Department, User, DepartmentInterest } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { DIOCESES, LEVELS } from '../constants';
import { API } from '../services/api';

interface DepartmentsProps {
  departments: Department[];
}

const IconMap: Record<string, any> = { Flame, Music, Globe, Activity, Shield, Heart, Star, Zap, Mic, Handshake };

const Departments: React.FC<DepartmentsProps> = ({ departments }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const activeDept = departments.find(d => d.id === id) || null;

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '',
    diocese: user?.diocese || DIOCESES[0], level: user?.level || LEVELS[0],
    program: user?.program || '', motivation: '', experience: ''
  });

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDept) return;
    setIsSubmitting(true);
    try {
      await API.departments.submitInterest({ ...formData, id: Math.random().toString(36).substr(2, 9), departmentId: activeDept.id, departmentName: activeDept.name, status: 'Pending', date: new Date().toISOString() } as any);
      setIsSuccess(true);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-container px-4">
        <div className="flex flex-wrap gap-2 mb-16 justify-center">
          <Link to="/departments" className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest ${!id ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-400'}`}>All</Link>
          {departments.map(dept => <Link key={dept.id} to={`/departments/${dept.id}`} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest ${id === dept.id ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{dept.name}</Link>)}
        </div>
        <AnimatePresence mode="wait">
          {!activeDept ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {departments.map(dept => (
                <div key={dept.id} className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center hover:shadow-2xl transition-all">
                  <div className="w-20 h-20 bg-cyan-50 text-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6">{React.createElement(IconMap[dept.icon] || Info, { size: 32 })}</div>
                  <h3 className="text-2xl font-black mb-2">{dept.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{dept.description}</p>
                  <Link to={`/departments/${dept.id}`} className="text-cyan-600 font-black text-[10px] uppercase">Details <ArrowRight className="inline ml-1" size={14} /></Link>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7 space-y-12">
                <h2 className="text-6xl font-black font-serif italic">{activeDept.name}</h2>
                <p className="text-xl text-gray-500 italic border-l-4 border-cyan-500 pl-8">{activeDept.details}</p>
                <button onClick={() => setShowInterestModal(true)} className="px-12 py-5 bg-cyan-500 text-white rounded-full font-black text-xs uppercase tracking-widest">Join Ministry</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Departments;