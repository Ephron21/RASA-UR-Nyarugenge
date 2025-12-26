
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../constants';
import { User, Department } from '../types';

interface NavbarProps {
  user: User | null;
  departments: Department[];
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, departments, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDepts, setShowDepts] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const isHomePage = location.pathname === '/';
  const navTextColor = (scrolled || !isHomePage) ? 'text-gray-900' : 'text-white';

  const dashboardPath = useMemo(() => {
    if (!user) return '/portal';
    const adminRoles = ['it', 'admin', 'executive', 'accountant', 'secretary'];
    return adminRoles.includes(user.role) ? '/admin' : '/dashboard';
  }, [user]);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-gray-100 py-3' 
        : (isHomePage ? 'bg-transparent py-6' : 'bg-white border-b border-gray-100 py-4')
    }`}>
      <div className="max-container flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-200"
          >
            R
          </motion.div>
          <span className={`font-black text-2xl tracking-tighter ${navTextColor}`}>
            RASA <span className="text-cyan-500">NYG</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={`font-bold text-sm uppercase tracking-widest transition-all hover:text-cyan-500 relative ${
                location.pathname === link.href ? 'text-cyan-500' : navTextColor
              }`}
            >
              {link.name}
              {location.pathname === link.href && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-1 bg-cyan-500 rounded-full"
                />
              )}
            </Link>
          ))}
          
          <div className="relative" onMouseEnter={() => setShowDepts(true)} onMouseLeave={() => setShowDepts(false)}>
            <Link 
              to="/departments"
              className={`flex items-center gap-1 font-bold text-sm uppercase tracking-widest transition-all hover:text-cyan-500 ${
                location.pathname.startsWith('/departments') ? 'text-cyan-500' : navTextColor
              }`}
            >
              Ministries <ChevronDown size={14} className={`transition-transform duration-300 ${showDepts ? 'rotate-180' : ''}`} />
            </Link>
            <AnimatePresence>
              {showDepts && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 p-3"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {departments.map((dept) => (
                      <Link 
                        key={dept.id} 
                        to={`/departments/${dept.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 rounded-2xl text-sm font-bold text-gray-700 transition-all hover:translate-x-1"
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        {dept.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 pl-5 rounded-full border border-gray-100 backdrop-blur-md">
              <Link to={dashboardPath} className="flex items-center gap-3 group">
                <div className="text-right">
                  <p className="font-black text-[11px] text-gray-900 leading-none">
                    {user.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[8px] font-black text-cyan-600 uppercase tracking-widest mt-0.5">
                    {user.role}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-100 group-hover:scale-110 transition-transform">
                  {user.role === 'it' ? <Shield size={18}/> : <UserIcon size={18} />}
                </div>
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button 
                onClick={onLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/portal" 
              className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-xl ${
                scrolled || !isHomePage 
                  ? 'bg-cyan-500 text-white shadow-cyan-100 hover:bg-cyan-600' 
                  : 'bg-white text-cyan-600 hover:bg-gray-100 shadow-white/20'
              }`}
            >
              Access Portal
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={`p-2 rounded-xl lg:hidden ${navTextColor}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-black text-3xl tracking-tighter">RASA <span className="text-cyan-500">NYG</span></span>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-2xl"><X size={28} /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-black">
              {NAV_LINKS.map(link => (
                <Link key={link.name} to={link.href} className="hover:text-cyan-500">
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-4"></div>
              {user ? (
                 <div className="space-y-6">
                    <Link to={dashboardPath} className="flex items-center gap-4 text-cyan-600">
                      <LayoutDashboard size={28} /> Dashboard
                    </Link>
                    <button onClick={onLogout} className="flex items-center gap-4 text-red-500">
                      <LogOut size={28} /> Sign Out
                    </button>
                 </div>
              ) : (
                 <Link to="/portal" className="bg-cyan-500 text-white py-6 rounded-3xl text-center shadow-2xl">Member Portal</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
