
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { 
  News, Leader, Announcement, Member, 
  Department, DepartmentInterest, ContactMessage, 
  HomeConfig, Donation, DonationProject, AboutConfig,
  DailyVerse, VerseReflection, BibleQuiz, QuizResult,
  SystemLog, OTPRecord
} from './models';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// SWAGGER CONFIGURATION
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RASA UR-Nyarugenge API',
      version: '2.5.0',
      description: 'Divine Kernel API for the Rwanda Anglican Students Association Portal. This documentation allows for testing the communication between the frontend and the MongoDB backend.',
      contact: {
        name: 'RASA IT Infrastructure',
        email: 'it@rasa-nyg.org'
      },
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      schemas: {
        Member: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['member', 'admin', 'executive', 'accountant', 'secretary', 'it'] },
            program: { type: 'string' },
            level: { type: 'string' }
          }
        },
        News: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string', enum: ['event', 'news', 'announcement'] },
            mediaUrl: { type: 'string' }
          }
        },
        SpiritualResult: {
          type: 'object',
          properties: {
            quizId: { type: 'string' },
            userId: { type: 'string' },
            score: { type: 'number' },
            total: { type: 'number' }
          }
        }
      }
    }
  },
  apis: ['./backend/server.ts'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Log helper
const logAction = async (action: string) => {
  try {
    const log = new SystemLog({ action });
    await log.save();
  } catch (e) { console.error("Logger fail", e); }
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Security tokens and member verification
 *   - name: Spiritual Hub
 *     description: Verses, Quizzes, and Leaderboard
 *   - name: Core CMS
 *     description: Members, News, and Announcements
 *   - name: System
 *     description: Health and Logs
 */

/**
 * @swagger
 * /api/spiritual/verses/daily:
 *   get:
 *     summary: Retrieve the current active daily verse
 *     tags: [Spiritual Hub]
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/api/spiritual/verses/daily', async (req, res) => {
  try {
    const verse = await DailyVerse.findOne({ isActive: true }).sort({ date: -1 });
    res.json(verse);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch daily bread' }); }
});

/**
 * @swagger
 * /api/spiritual/verses:
 *   get:
 *     summary: Get all archived scriptures
 *     tags: [Spiritual Hub]
 *   post:
 *     summary: Create a new daily verse
 *     tags: [Spiritual Hub]
 */
app.get('/api/spiritual/verses', async (req, res) => {
  try {
    const verses = await DailyVerse.find().sort({ date: -1 });
    res.json(verses);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch archive' }); }
});

app.post('/api/spiritual/verses', async (req, res) => {
  try {
    const verse = new DailyVerse(req.body);
    await verse.save();
    await logAction(`CMS: New Verse Created - ${verse.theme}`);
    res.status(201).json(verse);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
});

app.delete('/api/spiritual/verses/:id', async (req, res) => {
  try {
    await DailyVerse.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

/**
 * @swagger
 * /api/spiritual/quizzes/active:
 *   get:
 *     summary: Get all active sanctuary challenges
 *     tags: [Spiritual Hub]
 */
app.get('/api/spiritual/quizzes/active', async (req, res) => {
  try {
    const quizzes = await BibleQuiz.find({ isActive: true });
    res.json(quizzes);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch tests' }); }
});

app.get('/api/spiritual/quizzes', async (req, res) => {
  try {
    const quizzes = await BibleQuiz.find();
    res.json(quizzes);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch all tests' }); }
});

app.post('/api/spiritual/quizzes', async (req, res) => {
  try {
    const quiz = new BibleQuiz(req.body);
    await quiz.save();
    await logAction(`CMS: New Sanctuary Test Deployed - ${quiz.title}`);
    res.status(201).json(quiz);
  } catch (err) { res.status(400).json({ error: 'Deployment failed' }); }
});

/**
 * @swagger
 * /api/spiritual/quiz-results:
 *   post:
 *     summary: Submit a quiz performance result
 *     tags: [Spiritual Hub]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpiritualResult'
 */
app.post('/api/spiritual/quiz-results', async (req, res) => {
  try {
    const result = new QuizResult(req.body);
    await result.save();
    const pointsToAdd = Math.floor((result.score / result.total) * 100);
    await Member.findByIdAndUpdate(result.userId, { $inc: { spiritPoints: pointsToAdd } });
    await logAction(`SPIRIT: Quiz Completed by ${result.userId} (+${pointsToAdd} SP)`);
    res.status(201).json(result);
  } catch (err) { res.status(400).json({ error: 'Submission failed' }); }
});

/**
 * @swagger
 * /api/auth/otp:
 *   post:
 *     summary: Generate a security token for email
 *     tags: [Authentication]
 */
app.post('/api/auth/otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000;
  try {
    await OTPRecord.deleteMany({ email });
    const record = new OTPRecord({ email, otp, expires });
    await record.save();
    console.log(`[AUTH] TOKEN FOR ${email}: ${otp}`); 
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Token generation fail' }); }
});

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Fetch all registered members
 *     tags: [Core CMS]
 *   post:
 *     summary: Register a new member manually
 *     tags: [Core CMS]
 */
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch members' }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
});

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Fetch news feed
 *     tags: [Core CMS]
 *   post:
 *     summary: Publish a news story
 *     tags: [Core CMS]
 */
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch news' }); }
});

app.post('/api/news', async (req, res) => {
  try {
    const item = new News(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: Check backend and DB status
 *     tags: [System]
 */
app.get('/api/system/health', async (req, res) => {
  try {
    const stats = await mongoose.connection.db?.stats();
    res.json({
      status: 'Online',
      database: 'Connected',
      size: `${((stats?.dataSize || 0) / 1024).toFixed(2)} KB`,
      version: '2.5.0-SwaggerIntegrated',
      timestamp: new Date()
    });
  } catch (e) {
    res.json({ status: 'Online', database: 'Unknown', timestamp: new Date() });
  }
});

app.get('/api/system/logs', async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.listen(PORT, () => {
  console.log(`RASA Backend running on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
