
import React from 'react';
import { Shield, User, Landmark, MessageSquare, Briefcase, CheckCircle2, Info } from 'lucide-react';
import { User as MemberType, Role } from '../../types';

interface RoleEditorFormProps {
  member: MemberType;
  onConfirm: (role: Role) => void;
  isSyncing: boolean;
}

const ROLES: { id: Role; label: string; icon: any; color: string; desc: string; permissions: string[] }[] = [
  { 
    id: 'it', 
    label: 'IT Specialist', 
    icon: Shield, 
    color: 'bg-gray-900 text-cyan-400', 
    desc: 'Full Kernel Access & Security Protocols', 
    permissions: ['Full Access Control', 'Permission Assignment', 'Financial Purge', 'System Hard Reset']
  },
  { 
    id: 'executive', 
    label: 'EXCOM Member', 
    icon: Briefcase, 
    color: 'bg-cyan-500 text-white', 
    desc: 'General Management & Oversight', 
    permissions: ['CMS Management', 'Spiritual Hub Oversight', 'View Finance Ledger', 'Restriction: No Financial Edits']
  },
  { 
    id: 'accountant', 
    label: 'Accountant', 
    icon: Landmark, 
    color: 'bg-emerald-500 text-white', 
    desc: 'Financial Stewardship & Treasury', 
    permissions: ['Verify/Accept Offerings', 'Financial Reporting', 'Restriction: No Data Deletion']
  },
  { 
    id: 'secretary', 
    label: 'Dept Leader / Sec', 
    icon: MessageSquare, 
    color: 'bg-blue-600 text-white', 
    desc: 'Content Publishing & Communication', 
    permissions: ['Publish News', 'Manage Bulletin Board', 'Handle Inquiries', 'Restriction: No Admin/Finance']
  },
  { 
    id: 'member', 
    label: 'Standard Member', 
    icon: User, 
    color: 'bg-gray-100 text-gray-600', 
    desc: 'Authenticated Fellowship Access', 
    permissions: ['Personal Profile Edit', 'Daily Verse Access', 'Bible Quizzes', 'View Announcements']
  }
];

const RoleEditorForm: React.FC<RoleEditorFormProps> = ({ member, onConfirm, isSyncing }) => {
  const [selectedRole, setSelectedRole] = React.useState<Role>(member.role);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 p-6 bg-cyan-50 rounded-[2rem] border border-cyan-100">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-cyan-600 font-black text-2xl shadow-sm">
          {member.profileImage ? <img src={member.profileImage} className="w-full h-full object-cover rounded-2xl" alt="" /> : member.fullName.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Target Identity</p>
          <h4 className="text-xl font-black text-gray-900 leading-tight">{member.fullName}</h4>
          <p className="text-xs font-bold text-gray-400">{member.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-[0.3em]">Select Functional Clearance</label>
        <div className="grid grid-cols-1 gap-3">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`flex items-start gap-5 p-5 rounded-[2rem] border-2 transition-all text-left group ${
                selectedRole === role.id 
                  ? 'border-cyan-500 bg-cyan-50/30 shadow-lg' 
                  : 'border-gray-50 bg-white hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${selectedRole === role.id ? role.color : 'bg-gray-50 text-gray-400'}`}>
                <role.icon size={22} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-black uppercase tracking-tight ${selectedRole === role.id ? 'text-gray-900' : 'text-gray-400'}`}>{role.label}</span>
                  {selectedRole === role.id && <CheckCircle2 className="text-cyan-500" size={18} />}
                </div>
                <p className="text-[11px] font-bold text-gray-400 mb-3">{role.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((p, i) => (
                    <span key={i} className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${p.includes('Restriction') ? 'bg-red-50 text-red-400' : 'bg-gray-100 text-gray-500'}`}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gray-900 rounded-[2rem] text-white flex items-start gap-4">
        <Info className="text-cyan-400 shrink-0 mt-1" size={20} />
        <p className="text-[11px] font-medium leading-relaxed text-gray-400">
          <span className="text-white font-black uppercase">IT Protocol:</span> Assigning a new clearance will immediately synchronize across the Divine Kernel. The user must refresh their portal to initialize their new authorization layers.
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={() => onConfirm(selectedRole)}
          disabled={isSyncing || selectedRole === member.role}
          className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-cyan-600 disabled:opacity-30 transition-all active:scale-95"
        >
          Confirm Role Migration
        </button>
      </div>
    </div>
  );
};

export default RoleEditorForm;
