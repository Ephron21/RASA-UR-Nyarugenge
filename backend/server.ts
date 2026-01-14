
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { 
  News, Leader, Announcement, Member, 
  Department, ContactMessage, 
  HomeConfig, SystemLog, DailyVerse, BibleQuiz, QuizResult, AboutConfig, FooterConfig
} from './models';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ KERNEL ONLINE: LOCAL MONGODB CONNECTED'))
  .catch(err => console.error('❌ KERNEL OFFLINE: CONNECTION ERROR:', err));

const logAction = async (action: string) => {
  try { await new SystemLog({ action }).save(); } catch (e) { console.error("Log failed", e); }
};

// --- NEWS (SPIRIT FEED) CRUD ---
app.get('/api/news', async (req, res) => res.json(await News.find().sort({ date: -1 })));
app.post('/api/news', async (req, res) => {
  const n = new News(req.body);
  await n.save();
  await logAction(`CMS: News Story Published - ${n.title}`);
  res.status(201).json(n);
});
app.put('/api/news/:id', async (req, res) => {
  const n = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await logAction(`CMS: News Story Refined - ${n?.title}`);
  res.json(n);
});
app.delete('/api/news/:id', async (req, res) => {
  const n = await News.findByIdAndDelete(req.params.id);
  await logAction(`CMS: News Story Purged - ${n?.title}`);
  res.json({ message: 'Success' });
});

// --- ANNOUNCEMENT (BULLETIN) CRUD ---
app.get('/api/announcements', async (req, res) => res.json(await Announcement.find().sort({ date: -1 })));
app.post('/api/announcements', async (req, res) => {
  const ann = new Announcement(req.body);
  await ann.save();
  await logAction(`CMS: Bulletin Broadcasted - ${ann.title}`);
  res.status(201).json(ann);
});
app.put('/api/announcements/:id', async (req, res) => {
  const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await logAction(`CMS: Bulletin Updated - ${ann?.title}`);
  res.json(ann);
});
app.delete('/api/announcements/:id', async (req, res) => {
  const ann = await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Success' });
});

// --- SPIRITUAL HUB (VERSES & QUIZZES) CRUD ---
app.get('/api/spiritual/verses', async (req, res) => res.json(await DailyVerse.find().sort({ date: -1 })));
app.get('/api/spiritual/verses/daily', async (req, res) => {
  const v = await DailyVerse.findOne({ isActive: true }).sort({ date: -1 });
  res.json(v);
});
app.post('/api/spiritual/verses', async (req, res) => {
  const v = new DailyVerse(req.body);
  await v.save();
  await logAction(`SPIRIT: New Manna Published - ${v.theme}`);
  res.status(201).json(v);
});
app.put('/api/spiritual/verses/:id', async (req, res) => res.json(await DailyVerse.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/spiritual/verses/:id', async (req, res) => res.json(await DailyVerse.findByIdAndDelete(req.params.id)));

app.get('/api/spiritual/quizzes', async (req, res) => res.json(await BibleQuiz.find()));
app.get('/api/spiritual/quizzes/active', async (req, res) => res.json(await BibleQuiz.find({ isActive: true })));
app.post('/api/spiritual/quizzes', async (req, res) => {
  const q = new BibleQuiz(req.body);
  await q.save();
  await logAction(`SPIRIT: Sanctuary Test Deployed - ${q.title}`);
  res.status(201).json(q);
});
app.put('/api/spiritual/quizzes/:id', async (req, res) => res.json(await BibleQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/spiritual/quizzes/:id', async (req, res) => res.json(await BibleQuiz.findByIdAndDelete(req.params.id)));

// --- DEPARTMENTS (MINISTRIES) CRUD ---
app.get('/api/departments', async (req, res) => res.json(await Department.find()));
app.post('/api/departments', async (req, res) => {
  const dept = new Department(req.body);
  await dept.save();
  await logAction(`SYS: Ministry Init - ${dept.name}`);
  res.status(201).json(dept);
});
app.put('/api/departments/:id', async (req, res) => res.json(await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/departments/:id', async (req, res) => res.json(await Department.findByIdAndDelete(req.params.id)));

// --- LEADERS CRUD ---
app.get('/api/leaders', async (req, res) => res.json(await Leader.find().sort({ name: 1 })));
app.post('/api/leaders', async (req, res) => res.json(await new Leader(req.body).save()));
app.put('/api/leaders/:id', async (req, res) => res.json(await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/leaders/:id', async (req, res) => res.json(await Leader.findByIdAndDelete(req.params.id)));

// --- CONTACTS & MESSAGES ---
app.get('/api/contacts', async (req, res) => res.json(await ContactMessage.find().sort({ date: -1 })));
app.post('/api/contacts', async (req, res) => res.json(await new ContactMessage(req.body).save()));
app.patch('/api/contacts/:id/read', async (req, res) => res.json(await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })));
app.delete('/api/contacts/:id', async (req, res) => res.json(await ContactMessage.findByIdAndDelete(req.params.id)));

// --- GLOBAL SETTINGS ---
app.get('/api/config/home', async (req, res) => res.json(await HomeConfig.findOne() || {}));
app.put('/api/config/home', async (req, res) => {
  const result = await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true, setDefaultsOnInsert: true });
  await logAction('SYS: Home Config Updated');
  res.json(result);
});

app.get('/api/config/about', async (req, res) => res.json(await AboutConfig.findOne() || {}));
app.put('/api/config/about', async (req, res) => {
  const result = await AboutConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true, setDefaultsOnInsert: true });
  await logAction('SYS: About Config Updated');
  res.json(result);
});

app.get('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOne() || {}));
app.put('/api/config/footer', async (req, res) => {
  const result = await FooterConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true, setDefaultsOnInsert: true });
  await logAction('SYS: Footer Config Updated');
  res.json(result);
});

// --- SYSTEM & LOGS ---
app.get('/api/system/health', async (req, res) => {
  try {
    const stats = await mongoose.connection.db?.stats();
    res.json({
      status: 'Online',
      database: 'Local MongoDB',
      storage: `${((stats?.dataSize || 0) / 1024).toFixed(2)} KB`,
      version: '2.5.0-CompleteSync',
      collections: {
        members: await Member.countDocuments(),
        news: await News.countDocuments(),
        announcements: await Announcement.countDocuments(),
        verses: await DailyVerse.countDocuments()
      }
    });
  } catch (e) { res.status(500).json({ status: 'Error' }); }
});

app.get('/api/system/logs', async (req, res) => res.json(await SystemLog.find().sort({ timestamp: -1 }).limit(50)));

app.listen(PORT, () => console.log(`🚀 KERNEL LISTENING ON PORT ${PORT}`));
