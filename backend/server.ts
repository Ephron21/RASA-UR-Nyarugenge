import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { 
  News, Leader, Announcement, Member, 
  Department, ContactMessage, DepartmentInterest,
  HomeConfig, SystemLog, DailyVerse, BibleQuiz, QuizResult, AboutConfig, FooterConfig,
  VerseReflection, Donation, DonationProject
} from './models';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const logAction = async (action: string) => {
  try { await new SystemLog({ action }).save(); } catch (e) { console.error("Log failed", e); }
};

// --- BOOTSTRAP SYSTEM ADMIN ---
const bootstrapAdmin = async () => {
  const itEmail = 'ephrontuyishime21@gmail.com';
  const existing = await Member.findOne({ email: itEmail });
  if (!existing) {
    await new Member({
      id: 'it-super-master',
      fullName: 'Esron Tuyishime (IT)',
      email: itEmail,
      phone: '+250 787 846 433',
      role: 'it',
      program: 'Software Engineering',
      level: 'Expert',
      diocese: 'Kigali',
      department: 'IT & Infrastructure',
      spiritPoints: 5000
    }).save();
    console.log('🛡️ SYSTEM BOOTSTRAP: IT Architect Account Created');
  }
};

// --- MEMBERS ---
app.get('/api/members', async (req, res) => res.json(await Member.find().sort({ createdAt: -1 })));
app.put('/api/members/:id', async (req, res) => {
  try {
    const { id, _id, email, ...updateData } = req.body;
    const query = req.params.id.includes('-') || req.params.id.startsWith('u') ? { id: req.params.id } : { _id: req.params.id };
    const m = await Member.findOneAndUpdate(query, updateData, { new: true, upsert: true });
    res.json(m);
  } catch (err) { res.status(500).json({ error: 'Update failed' }); }
});
app.patch('/api/members/:id/role', async (req, res) => {
  const query = req.params.id.includes('-') || req.params.id.startsWith('u') ? { id: req.params.id } : { _id: req.params.id };
  res.json(await Member.findOneAndUpdate(query, { role: req.body.role }, { new: true }));
});

// --- SPIRITUAL ---
app.get('/api/spiritual/verses', async (req, res) => res.json(await DailyVerse.find().sort({ date: -1 })));
app.get('/api/spiritual/verses/daily', async (req, res) => res.json(await DailyVerse.findOne({ isActive: true }).sort({ date: -1 }) || {}));
app.post('/api/spiritual/verses', async (req, res) => res.status(201).json(await new DailyVerse(req.body).save()));
app.put('/api/spiritual/verses/:id', async (req, res) => res.json(await DailyVerse.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/spiritual/verses/:id', async (req, res) => { await DailyVerse.findByIdAndDelete(req.params.id); res.status(204).send(); });

app.get('/api/spiritual/quizzes', async (req, res) => res.json(await BibleQuiz.find()));
app.get('/api/spiritual/quizzes/active', async (req, res) => res.json(await BibleQuiz.find({ isActive: true })));
app.post('/api/spiritual/quizzes', async (req, res) => res.status(201).json(await new BibleQuiz(req.body).save()));
app.put('/api/spiritual/quizzes/:id', async (req, res) => res.json(await BibleQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/spiritual/quizzes/:id', async (req, res) => { await BibleQuiz.findByIdAndDelete(req.params.id); res.status(204).send(); });

app.get('/api/spiritual/reflections', async (req, res) => res.json(await VerseReflection.find().sort({ timestamp: -1 })));
app.post('/api/spiritual/reflections', async (req, res) => res.status(201).json(await new VerseReflection(req.body).save()));
app.get('/api/spiritual/quiz-results', async (req, res) => res.json(await QuizResult.find().sort({ timestamp: -1 })));
app.post('/api/spiritual/quiz-results', async (req, res) => res.status(201).json(await new QuizResult(req.body).save()));

// --- CMS & DEPARTMENTS ---
app.get('/api/news', async (req, res) => res.json(await News.find().sort({ date: -1 })));
app.post('/api/news', async (req, res) => res.status(201).json(await new News(req.body).save()));
app.get('/api/announcements', async (req, res) => res.json(await Announcement.find().sort({ date: -1 })));
app.post('/api/announcements', async (req, res) => res.status(201).json(await new Announcement(req.body).save()));
app.get('/api/leaders', async (req, res) => res.json(await Leader.find()));
app.post('/api/leaders', async (req, res) => res.status(201).json(await new Leader(req.body).save()));
app.get('/api/departments', async (req, res) => res.json(await Department.find()));
app.get('/api/departments/interests', async (req, res) => res.json(await DepartmentInterest.find().sort({ date: -1 })));

// --- FINANCE ---
app.get('/api/donations', async (req, res) => res.json(await Donation.find().sort({ date: -1 })));
app.post('/api/donations', async (req, res) => res.status(201).json(await new Donation(req.body).save()));
app.patch('/api/donations/:id/status', async (req, res) => {
  const d = await Donation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (req.body.status === 'Completed' && d?.project) await DonationProject.findOneAndUpdate({ title: d.project }, { $inc: { raised: d.amount } });
  res.json(d);
});

// --- CONTACTS ---
app.get('/api/contacts', async (req, res) => res.json(await ContactMessage.find().sort({ date: -1 })));
app.post('/api/contacts', async (req, res) => res.status(201).json(await new ContactMessage(req.body).save()));

// --- CONFIGS & SYSTEM ---
app.get('/api/config/home', async (req, res) => res.json(await HomeConfig.findOne() || {}));
app.put('/api/config/home', async (req, res) => res.json(await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));
app.get('/api/config/about', async (req, res) => res.json(await AboutConfig.findOne() || { values: [], timeline: [] }));
app.put('/api/config/about', async (req, res) => res.json(await AboutConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));
app.get('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOne() || {}));
app.put('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));

// --- UPDATED ROLES LIST ---
app.get('/api/roles', (req, res) => {
  const allTabs = ['tab.overview', 'tab.profile', 'tab.home', 'tab.about', 'tab.footer', 'tab.spiritual', 'tab.members', 'tab.clearance', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.donations', 'tab.contacts', 'tab.system'];
  res.json([
    { id: 'it', label: 'IT Architect', icon: 'Shield', description: 'System-wide access and security administration.', permissions: [...allTabs, 'action.manage_roles', 'action.reset_db'] },
    { id: 'executive', label: 'EXCOM Member', icon: 'Briefcase', description: 'General management and association oversight.', permissions: ['tab.overview', 'tab.profile', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.contacts'] },
    { id: 'accountant', label: 'Accountant', icon: 'Landmark', description: 'Treasury and financial ledger management.', permissions: ['tab.overview', 'tab.profile', 'tab.donations', 'action.verify_donations'] },
    { id: 'secretary', label: 'Secretary', icon: 'MessageSquare', description: 'Communication and documentation management.', permissions: ['tab.overview', 'tab.profile', 'tab.content', 'tab.bulletin', 'tab.contacts'] },
    { id: 'member', label: 'RASA Member', icon: 'User', description: 'Default portal access for association members.', permissions: ['tab.overview', 'tab.profile', 'tab.spiritual'] }
  ]);
});

app.get('/api/system/health', async (req, res) => res.json({ status: 'Online' }));
app.get('/api/system/logs', async (req, res) => res.json(await SystemLog.find().sort({ timestamp: -1 }).limit(50)));
app.get('/api/system/backups', (req, res) => res.json([]));

// --- SERVER START ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI).then(() => {
  console.log('✅ KERNEL ONLINE');
  bootstrapAdmin();
  app.listen(PORT, () => console.log(`🚀 PORT ${PORT}`));
});
