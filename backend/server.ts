
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { 
  News, Leader, Announcement, Member, 
  Department, ContactMessage, DepartmentInterest,
  HomeConfig, SystemLog, DailyVerse, BibleQuiz, QuizResult, AboutConfig, FooterConfig,
  Donation, DonationProject
} from './models';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- SWAGGER CONFIGURATION ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RASA UR-Nyarugenge API Nexus',
      version: '2.5.0',
      description: 'Divine Kernel API for the Rwanda Anglican Students Association. Handles membership, spiritual manna, and financial stewardship.',
      contact: { name: 'Esron Tuyishime', email: 'ephrontuyishime21@gmail.com' },
    },
    servers: [{ url: `http://localhost:${PORT}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./server.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ KERNEL ONLINE: LOCAL MONGODB CONNECTED'))
  .catch(err => console.error('❌ KERNEL OFFLINE: CONNECTION ERROR:', err));

const logAction = async (action: string) => {
  try { await new SystemLog({ action }).save(); } catch (e) { console.error("Log failed", e); }
};

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Retrieve all spirit feed stories
 *     responses:
 *       200:
 *         description: A list of news items
 */
app.get('/api/news', async (req, res) => res.json(await News.find().sort({ date: -1 })));

app.post('/api/news', async (req, res) => {
  const n = new News(req.body);
  await n.save();
  await logAction(`CMS: News Story Published - ${n.title}`);
  res.status(201).json(n);
});

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Retrieve bulletin board announcements
 *   post:
 *     summary: Broadcast a new bulletin
 */
app.get('/api/announcements', async (req, res) => res.json(await Announcement.find().sort({ date: -1 })));
app.post('/api/announcements', async (req, res) => {
  const ann = new Announcement(req.body);
  await ann.save();
  await logAction(`CMS: Bulletin Broadcasted - ${ann.title}`);
  res.status(201).json(ann);
});

// --- SPIRITUAL HUB ---
/**
 * @swagger
 * /spiritual/verses/daily:
 *   get:
 *     summary: Get today's daily manna
 */
app.get('/api/spiritual/verses/daily', async (req, res) => {
  const v = await DailyVerse.findOne({ isActive: true }).sort({ date: -1 });
  res.json(v);
});

app.get('/api/spiritual/quizzes/active', async (req, res) => res.json(await BibleQuiz.find({ isActive: true })));

// --- DEPARTMENTS & RECRUITMENT ---
app.get('/api/departments', async (req, res) => res.json(await Department.find()));
app.post('/api/departments/interest', async (req, res) => {
  const interest = new DepartmentInterest(req.body);
  await interest.save();
  await logAction(`RECRUIT: Application received for ${interest.departmentName} from ${interest.fullName}`);
  res.status(201).json(interest);
});

// --- DONATIONS & FINANCIAL LEDGER ---
/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Retrieve full financial flow
 *   post:
 *     summary: Pledge a new offering
 */
app.get('/api/donations', async (req, res) => res.json(await Donation.find().sort({ date: -1 })));

app.post('/api/donations', async (req, res) => {
  const d = new Donation(req.body);
  await d.save();
  await logAction(`FINANCE: Offering Pledged - ${d.donorName} (${d.amount} RWF)`);
  res.status(201).json(d);
});

/**
 * @swagger
 * /donations/{id}/status:
 *   patch:
 *     summary: Finalize a financial pulse (Accountant Only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Completed, Pending, Failed]
 */
app.patch('/api/donations/:id/status', async (req, res) => {
  const { status } = req.body;
  const d = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  
  if (status === 'Completed' && d && d.project) {
    // Atomic increment of project raised amount
    await DonationProject.findOneAndUpdate(
      { title: d.project },
      { $inc: { raised: d.amount } }
    );
  }
  
  await logAction(`FINANCE: Transaction ${d?.transactionId} verified as ${status}`);
  res.json(d);
});

// --- GLOBAL CONFIGS ---
app.get('/api/config/home', async (req, res) => res.json(await HomeConfig.findOne() || {}));
app.get('/api/config/about', async (req, res) => res.json(await AboutConfig.findOne() || {}));
app.get('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOne() || {}));

app.put('/api/config/home', async (req, res) => {
  const result = await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(result);
});

// --- SYSTEM & HEALTH ---
/**
 * @swagger
 * /system/health:
 *   get:
 *     summary: Execute Kernel diagnostics
 */
app.get('/api/system/health', async (req, res) => {
  try {
    const stats = await mongoose.connection.db?.stats();
    res.json({
      status: 'Online',
      database: 'Local MongoDB',
      storage: `${((stats?.dataSize || 0) / 1024).toFixed(2)} KB`,
      collections: {
        members: await Member.countDocuments(),
        news: await News.countDocuments(),
        donations: await Donation.countDocuments()
      }
    });
  } catch (e) { res.status(500).json({ status: 'Error' }); }
});

app.listen(PORT, () => {
  console.log(`🚀 RASA KERNEL LISTENING ON PORT ${PORT}`);
  console.log(`📘 API DOCUMENTATION (SWAGGER): http://localhost:${PORT}/api-docs`);
});
