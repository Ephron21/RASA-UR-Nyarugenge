
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Megaphone, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Info, Clock, Search, Power, ShieldAlert } from 'lucide-react';
import { Announcement } from '../../types';

interface BulletinTabProps {
  announcements: Announcement[];
  onNew: () => void;
  onEdit: (a: Announcement) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
}

const BulletinTab: React.FC<BulletinTabProps> = ({ announcements, onNew, onEdit, onDelete, canManage }) => {
  const [filter, setFilter] = useState<'All' | 'Notice' | 'Urgent' | 'Info'>('All');
  const filtered = announcements.filter(a => filter === 'All' || a.status === filter);

  const IconMap: any = { 'Notice': CheckCircle, 'Urgent': AlertTriangle, 'Info': Info };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Megaphone className="text-cyan-500" size={32} /> Bulletin Broadcast
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campus mandates & information</p>
        </div>
        
        {canManage ? (
          <button onClick={onNew} className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 flex items-center gap-3 active:scale-95 transition-all">
            <Plus size={18} /> New Broadcast
          </button>
        ) : (
          <div className="px-6 py-3 bg-gray-100 rounded-2xl flex items-center gap-3 text-gray-400">
            <ShieldAlert size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest">IT Authority Required to Publish</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-1.5 bg-white border border-gray-100 rounded-2xl w-fit shadow-sm">
        {['All', 'Urgent', 'Notice', 'Info'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-cyan-600'}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map(a => {
          const Icon = IconMap[a.status] || Info;
          return (
            <motion.div key={a.id} layout className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all flex items-center gap-8 group">
              <div className={`w-20 h-20 ${a.color} rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={32} />
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 bg-gray-50 border ${a.color.replace('bg-', 'border-')} ${a.color.replace('bg-', 'text-')} rounded-lg text-[9px] font-black uppercase tracking-widest`}>{a.status}</span>
                  <span className="text-[10px] font-black text-gray-300 flex items-center gap-2"><Clock size={12}/> {a.date}</span>
                  {!a.isActive && <span className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-[9px] font-black uppercase flex items-center gap-2"><Power size={10}/> Inactive</span>}
                </div>
                <h4 className="text-xl font-black text-gray-900 leading-tight">{a.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-1 font-medium">{a.content}</p>
              </div>
              
              {canManage && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(a)} className="p-3.5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"><Edit size={18}/></button>
                  <button onClick={() => onDelete(a.id)} className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                </div>
              )}
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="py-32 text-center text-gray-300 italic font-serif text-xl border-2 border-dashed border-gray-100 rounded-[3rem]">No bulletins in this priority layer.</div>}
      </div>
    </motion.div>
  );
};

export default BulletinTab;
