import mongoose, { Schema } from 'mongoose';

const schemaOptions = {
  toJSON: { 
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._v;
      return ret;
    }
  },
  toObject: { virtuals: true }
};

// SPIRITUAL HUB MODELS
const DailyVerseSchema = new Schema({
  theme: { type: String },
  verse: { type: String },
  reference: { type: String },
  description: { type: String },
  date: { type: String },
  isActive: { type: Boolean, default: true }
}, schemaOptions);

const VerseReflectionSchema = new Schema({
  verseId: { type: String },
  userId: { type: String },
  userName: { type: String },
  content: { type: String },
  timestamp: { type: Date, default: Date.now }
}, schemaOptions);

const BibleQuizSchema = new Schema({
  title: { type: String },
  description: { type: String },
  timeLimit: { type: Number },
  isActive: { type: Boolean, default: true },
  date: { type: String },
  questions: [{
    id: String,
    text: String,
    type: { type: String, enum: ['mcq', 'open'], default: 'mcq' },
    options: [String],
    correctAnswer: String
  }]
}, schemaOptions);

const QuizResultSchema = new Schema({
  quizId: { type: String },
  userId: { type: String },
  score: { type: Number },
  total: { type: Number },
  timestamp: { type: Date, default: Date.now }
}, schemaOptions);

// SYSTEM & AUTH MODELS
const LogSchema = new Schema({
  action: { type: String },
  timestamp: { type: Date, default: Date.now }
}, schemaOptions);

// CMS MODELS
const NewsSchema = new Schema({
  title: { type: String },
  content: { type: String },
  category: { type: String, enum: ['event', 'news', 'announcement'], default: 'news' },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
  author: { type: String, default: 'Admin' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, schemaOptions);

const LeaderSchema = new Schema({
  name: { type: String },
  position: { type: String },
  phone: { type: String },
  academicYear: { type: String },
  image: { type: String },
  type: { type: String, enum: ['Executive', 'Arbitration'], default: 'Executive' }
}, schemaOptions);

const AnnouncementSchema = new Schema({
  title: { type: String },
  content: { type: String },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Notice', 'Urgent', 'Info'], default: 'Info' },
  color: { type: String },
  isActive: { type: Boolean, default: true }
}, schemaOptions);

const DepartmentSchema = new Schema({
  name: { type: String },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  category: { type: String, default: 'Ministry' },
  details: { type: String },
  activities: [{ type: String }]
}, schemaOptions);

const DepartmentInterestSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  departmentName: String,
  date: { type: Date, default: Date.now }
}, schemaOptions);

const DonationSchema = new Schema({
  donorName: { type: String },
  email: { type: String },
  phone: { type: String },
  amount: { type: Number },
  currency: { type: String, default: 'RWF' },
  category: { type: String },
  project: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Pending' },
  transactionId: { type: String, unique: true }
}, schemaOptions);

const DonationProjectSchema = new Schema({
  title: { type: String },
  description: { type: String },
  goal: { type: Number },
  raised: { type: Number, default: 0 },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, schemaOptions);

const ContactMessageSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  message: { type: String },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
}, schemaOptions);

const MemberSchema = new Schema({
  id: { type: String, unique: true },
  fullName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String },
  role: { type: String, default: 'member' },
  program: { type: String },
  level: { type: String },
  diocese: { type: String },
  department: { type: String },
  profileImage: { type: String },
  spiritPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, schemaOptions);

export const DailyVerse = mongoose.model('DailyVerse', DailyVerseSchema);
export const VerseReflection = mongoose.model('VerseReflection', VerseReflectionSchema);
export const BibleQuiz = mongoose.model('BibleQuiz', BibleQuizSchema);
export const QuizResult = mongoose.model('QuizResult', QuizResultSchema);
export const SystemLog = mongoose.model('SystemLog', LogSchema);
export const News = mongoose.model('News', NewsSchema);
export const Leader = mongoose.model('Leader', LeaderSchema);
export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export const Department = mongoose.model('Department', DepartmentSchema);
export const DepartmentInterest = mongoose.model('DepartmentInterest', DepartmentInterestSchema);
export const Donation = mongoose.model('Donation', DonationSchema);
export const DonationProject = mongoose.model('DonationProject', DonationProjectSchema);
export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
export const HomeConfig = mongoose.model('HomeConfig', new Schema({ heroTitle: String, heroSubtitle: String, heroImageUrl: String, motto: String, aboutTitle: String, aboutText: String, aboutImageUrl: String, aboutScripture: String, aboutScriptureRef: String }, schemaOptions));
export const AboutConfig = mongoose.model('AboutConfig', new Schema({ heroTitle: String, heroSubtitle: String, heroImage: String, historyTitle: String, historyContent: String, historyImage: String, visionTitle: String, visionContent: String, missionTitle: String, missionContent: String, values: Array, timeline: Array }, schemaOptions));
export const FooterConfig = mongoose.model('FooterConfig', new Schema({ description: String, facebookUrl: String, twitterUrl: String, instagramUrl: String, linkedinUrl: String, youtubeUrl: String, whatsappUrl: String, tiktokUrl: String, address: String, phone: String, email: String }, schemaOptions));
export const Member = mongoose.model('Member', MemberSchema);