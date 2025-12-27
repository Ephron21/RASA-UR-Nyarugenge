
import mongoose, { Schema } from 'mongoose';

// SPIRITUAL HUB MODELS
const DailyVerseSchema = new Schema({
  theme: { type: String, required: true },
  verse: { type: String, required: true },
  reference: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const VerseReflectionSchema = new Schema({
  verseId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const BibleQuizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  date: { type: String, required: true },
  questions: [{
    id: String,
    text: String,
    type: { type: String, enum: ['mcq', 'open'], default: 'mcq' },
    options: [String],
    correctAnswer: String
  }]
});

const QuizResultSchema = new Schema({
  quizId: { type: String, required: true },
  userId: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// SYSTEM & AUTH MODELS
const LogSchema = new Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const OTPSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expires: { type: Number, required: true }
});

// ORIGINAL CMS MODELS
const NewsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['event', 'news', 'announcement'], default: 'news' },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
  author: { type: String, default: 'Admin' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  startDate: { type: String },
  endDate: { type: String }
});

const LeaderSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  academicYear: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, enum: ['Executive', 'Arbitration'], default: 'Executive' }
});

const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Notice', 'Urgent', 'Info'], default: 'Info' },
  color: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  image: { type: String },
  category: { type: String, default: 'Ministry' },
  details: { type: String, required: true },
  activities: [{ type: String }]
});

const DepartmentInterestSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  diocese: { type: String, required: true },
  level: { type: String, required: true },
  program: { type: String, required: true },
  motivation: { type: String, required: true },
  experience: { type: String },
  departmentId: { type: String, required: true },
  departmentName: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  date: { type: Date, default: Date.now }
});

const DonationSchema = new Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'RWF' },
  category: { type: String, enum: ['One-time', 'Monthly', 'Project-based'], required: true },
  project: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Pending' },
  transactionId: { type: String, unique: true }
});

const DonationProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const ContactMessageSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

const HomeConfigSchema = new Schema({
  heroTitle: { type: String, required: true },
  heroSubtitle: { type: String, required: true },
  heroImageUrl: { type: String, required: true },
  motto: { type: String, required: true },
  aboutTitle: { type: String, default: 'Who We Are' },
  aboutText: { type: String, default: 'RASA is a vibrant community of students...' },
  aboutImageUrl: { type: String },
  aboutScripture: { type: String },
  aboutScriptureRef: { type: String },
  stat1Value: { type: String },
  stat1Label: { type: String },
  stat2Value: { type: String },
  stat2Label: { type: String }
});

const AboutConfigSchema = new Schema({
  heroTitle: String,
  heroSubtitle: String,
  heroImage: String,
  historyTitle: String,
  historyContent: String,
  historyImage: String,
  visionTitle: String,
  visionContent: String,
  missionTitle: String,
  missionContent: String,
  values: [{ id: String, title: String, description: String, icon: String }],
  timeline: [{ id: String, year: String, title: String, description: String }]
});

const MemberSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['member', 'admin', 'executive', 'accountant', 'secretary', 'it', 'guest'], 
    default: 'member' 
  },
  program: { type: String, required: true },
  level: { type: String, required: true },
  diocese: { type: String, required: true },
  department: { type: String, required: true },
  profileImage: { type: String },
  spiritPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// EXPORTS
export const DailyVerse = mongoose.model('DailyVerse', DailyVerseSchema);
export const VerseReflection = mongoose.model('VerseReflection', VerseReflectionSchema);
export const BibleQuiz = mongoose.model('BibleQuiz', BibleQuizSchema);
export const QuizResult = mongoose.model('QuizResult', QuizResultSchema);
export const SystemLog = mongoose.model('SystemLog', LogSchema);
export const OTPRecord = mongoose.model('OTPRecord', OTPSchema);

export const News = mongoose.model('News', NewsSchema);
export const Leader = mongoose.model('Leader', LeaderSchema);
export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export const Department = mongoose.model('Department', DepartmentSchema);
export const DepartmentInterest = mongoose.model('DepartmentInterest', DepartmentInterestSchema);
export const Donation = mongoose.model('Donation', DonationSchema);
export const DonationProject = mongoose.model('DonationProject', DonationProjectSchema);
export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
export const HomeConfig = mongoose.model('HomeConfig', HomeConfigSchema);
export const AboutConfig = mongoose.model('AboutConfig', AboutConfigSchema);
export const Member = mongoose.model('Member', MemberSchema);
