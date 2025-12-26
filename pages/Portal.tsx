
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, Camera, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DIOCESES, LEVELS, DEPARTMENTS } from '../constants';
import { User } from '../types';
import { db } from '../services/db';

interface PortalProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register';

const Portal: React.FC<PortalProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string).toLowerCase();
    const password = formData.get('password') as string;

    try {
      if (mode === 'login') {
        // Authenticate via DB (includes strict password check)
        const user = await db.verifyMember(email, password);
        
        if (user) {
          onLogin(user);
          // Strategic Redirection: Administration roles go to /admin, others to /dashboard
          const adminRoles = ['it', 'admin', 'executive', 'accountant', 'secretary'];
          if (adminRoles.includes(user.role)) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError('Invalid email or password. Access denied.');
        }
      } else {
        // Registration logic
        const newUser: any = {
          id: `u-${Math.random().toString(36).substr(2, 9)}`,
          fullName: formData.get('fullName') as string,
          email: email,
          password: password, // In real app, hash this
          phone: formData.get('phone') as string,
          role: 'member',
          program: formData.get('program') as string,
          level: formData.get('level') as string,
          diocese: formData.get('diocese') as string,
          department: formData.get('department') as string,
          profileImage: imagePreview || '',
          createdAt: new Date().toISOString()
        };
        await db.insert('members', newUser);
        const { password: p, ...u } = newUser;
        onLogin(u as User);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl"></div>
      </div>

      <motion.div layout className="w-full max-w-xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl z-10 border border-gray-100 my-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 font-bold mb-4 hover:underline">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h2 className="text-4xl font-bold font-serif italic mb-2">
            {mode === 'login' ? 'Divine Access' : 'Register Member'}
          </h2>
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? 'Portal authentication required' : 'Join the RASA family'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 uppercase tracking-widest text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-6 transition-all cursor-pointer group bg-gray-50 hover:bg-white border-gray-200 hover:border-cyan-400">
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  {imagePreview ? (
                    <div className="relative w-24 h-24">
                      <img src={imagePreview} className="w-full h-full object-cover rounded-full shadow-lg border-2 border-white" alt=""/>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md"><X size={12} /></button>
                    </div>
                  ) : <div className="text-center"><Camera className="mx-auto text-cyan-500 mb-2"/><p className="text-[10px] font-black uppercase text-gray-400">Profile Pic</p></div>}
                </div>
                <input name="fullName" required placeholder="Full Name" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="phone" required placeholder="Phone" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm" />
                  <select name="level" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select name="diocese" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm">{DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <select name="department" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm">{DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select>
                </div>
                <input name="program" required placeholder="Academic Program" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm" />
              </motion.div>
            )}

            <motion.div key="core" className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                <input name="email" type="email" required placeholder="Email Address" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:border-cyan-100 transition-all" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                <input name="password" type="password" required placeholder="Password" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:border-cyan-100 transition-all" />
              </div>
            </motion.div>
          </AnimatePresence>

          <button type="submit" disabled={loading} className="w-full py-5 bg-cyan-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-100 flex items-center justify-center gap-2 active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Enter Portal' : 'Register Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-cyan-600 font-bold hover:underline">
            {mode === 'login' ? "Don't have an account? Register" : "Already registered? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Portal;
