
import React, { useRef } from 'react';
import { Briefcase, Activity, Star, Info, X, Zap, Camera, Upload, Layers } from 'lucide-react';
import { Department } from '../../types';

interface DepartmentFormProps {
  editingItem: Department | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ 
  editingItem, 
  filePreview, 
  urlInput, 
  onFileChange, 
  onUrlChange, 
  onSubmit 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = filePreview || urlInput || editingItem?.image || '';

  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-8">
      {/* Dynamic Image Selection */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
          <Camera size={14} className="text-cyan-500" /> Ministry Visual Identity
        </label>
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="relative h-64 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-cyan-200 transition-all shadow-inner"
        >
          {currentImage ? (
            <img src={currentImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Dept Preview" />
          ) : (
            <div className="text-center space-y-2">
              <Upload className="text-cyan-500 mx-auto" size={32}/>
              <p className="text-xs font-bold text-gray-500">Upload ministry cover image</p>
            </div>
          )}
          <div className="absolute inset-0 bg-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
            <Camera className="text-cyan-600 mb-1" size={24} />
            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Update Banner</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
        <input 
          value={urlInput} 
          onChange={e => onUrlChange(e.target.value)} 
          placeholder="Paste high-res image URL (Alternative)" 
          className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-xs border border-gray-100 focus:bg-white outline-none transition-all" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name & Icon */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Briefcase size={14} className="text-cyan-500" /> Ministry Name
          </label>
          <input 
            name="name" 
            defaultValue={editingItem?.name} 
            required 
            placeholder="e.g. Call on Jesus"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 outline-none transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Star size={14} className="text-cyan-500" /> Symbolic Icon
          </label>
          <select 
            name="icon" 
            defaultValue={editingItem?.icon || 'Flame'}
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none cursor-pointer appearance-none transition-all"
          >
            <option value="Flame">Flame (Spiritual/Revival)</option>
            <option value="Music">Music (Worship/Choir)</option>
            <option value="Globe">Globe (Evangelism/Mission)</option>
            <option value="Heart">Heart (Social/Intercession)</option>
            <option value="Shield">Shield (Protocol/Security)</option>
            <option value="Activity">Activity (Media/Broadcasting)</option>
            <option value="Zap">Zap (Sports/Fitness)</option>
            <option value="Handshake">Handshake (Social Affairs)</option>
          </select>
        </div>

        {/* Short Description & Category */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Layers size={14} className="text-cyan-500" /> Category
          </label>
          <input 
            name="category" 
            defaultValue={editingItem?.category || 'Official RASA Department'} 
            placeholder="e.g. Spiritual Pillar"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Info size={14} className="text-cyan-500" /> Hook / Tagline
          </label>
          <input 
            name="description" 
            defaultValue={editingItem?.description} 
            required 
            placeholder="Brief mission hook..."
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>

        {/* Full Details */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Activity size={14} className="text-cyan-500" /> Full Ministerial Vision
          </label>
          <textarea 
            name="details" 
            defaultValue={editingItem?.details} 
            required 
            rows={5}
            placeholder="Deep dive into what this department does..."
            className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-medium text-sm focus:bg-white outline-none transition-all resize-none leading-relaxed" 
          />
        </div>

        {/* Activities */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Zap size={14} className="text-cyan-500" /> Bullet Activities (Comma-separated)
          </label>
          <div className="relative">
            <input 
              name="activities" 
              defaultValue={editingItem?.activities?.join(', ')} 
              required 
              placeholder="e.g. Worship, Rehearsals, Song Writing..."
              className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default DepartmentForm;
