
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portal from './pages/Portal';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Departments from './pages/Departments';
import Donations from './pages/Donations';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import { User, NewsItem, Leader, Announcement, Department, FooterConfig } from './types';
import { API } from './services/api';
import { DEPARTMENTS as INITIAL_DEPTS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedUser = localStorage.getItem('rasa_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('rasa_user');
          }
        }

        const results = await Promise.allSettled([
          API.news.getAll(),
          API.leaders.getAll(),
          API.members.getAll(),
          API.announcements.getAll(),
          API.departments.getAll(),
          API.footer.getConfig()
        ]);

        const [newsRes, leadersRes, membersRes, announcementsRes, deptsRes, footerRes] = results;

        if (newsRes.status === 'fulfilled') setNews(newsRes.value || []);
        if (leadersRes.status === 'fulfilled') setLeaders(leadersRes.value || []);
        if (membersRes.status === 'fulfilled') setMembers(membersRes.value || []);
        if (announcementsRes.status === 'fulfilled') setAnnouncements(announcementsRes.value || []);
        if (footerRes.status === 'fulfilled') setFooterConfig(footerRes.value);
        if (deptsRes.status === 'fulfilled') {
          const depts = deptsRes.value || [];
          setDepartments(depts.length > 0 ? depts : INITIAL_DEPTS);
        } else {
          setDepartments(INITIAL_DEPTS);
        }
        
      } catch (err) {
        console.error('Boot system experienced issues:', err);
        setDepartments(INITIAL_DEPTS);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('rasa_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rasa_user');
  };

  const handleUpdateSelf = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('rasa_user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-cyan-500" size={48} />
        </motion.div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Authenticating RASA Core...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} departments={departments} onLogout={handleLogout} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home news={news} leaders={leaders} />} />
            <Route path="/portal" element={
              user ? (
                ['it', 'admin', 'executive', 'accountant', 'secretary'].includes(user.role) 
                  ? <Navigate to="/admin" replace /> 
                  : <Navigate to="/dashboard" replace />
              ) : <Portal onLogin={handleLogin} />
            } />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News news={news} />} />
            <Route path="/news/:id" element={<NewsDetail news={news} />} />
            <Route path="/announcements" element={<Announcements announcements={announcements} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/departments" element={<Departments departments={departments} user={user} />} />
            <Route path="/departments/:id" element={<Departments departments={departments} user={user} />} />
            <Route path="/donations" element={<Donations />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user}>
                  <MemberDashboard user={user!} announcements={announcements} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user} allowedRoles={['it', 'admin', 'executive', 'accountant', 'secretary']}> 
                  <AdminDashboard 
                    user={user!}
                    members={members} 
                    news={news} 
                    leaders={leaders}
                    announcements={announcements}
                    depts={departments}
                    onUpdateNews={setNews} 
                    onUpdateLeaders={setLeaders} 
                    onUpdateMembers={setMembers}
                    onUpdateAnnouncements={setAnnouncements}
                    onUpdateDepartments={setDepartments}
                    onUpdateSelf={handleUpdateSelf}
                    onUpdateFooter={setFooterConfig}
                  />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer departments={departments} config={footerConfig} />
    </div>
  );
};

export default App;
