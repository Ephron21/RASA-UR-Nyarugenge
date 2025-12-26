
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig, Donation, DonationProject, AboutConfig } from '../types';
import { db } from './db';

const API_BASE_URL = 'http://localhost:5000/api';

const hybridFetch = async (
  endpoint: string, 
  method: string = 'GET', 
  body?: any, 
  fallbackAction?: () => Promise<any>
) => {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    
    if (!res.ok) {
      if (fallbackAction) {
        console.warn(`[API] Server returned ${res.status} for ${endpoint}. Falling back to Local Storage.`);
        return await fallbackAction();
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (err: any) {
    if (fallbackAction) {
      console.warn(`[API] Connection to ${API_BASE_URL} failed for ${endpoint}. Falling back to Local Storage.`);
      return await fallbackAction();
    }
    throw err;
  }
};

export const API = {
  members: {
    getAll: () => hybridFetch('members', 'GET', null, () => db.getCollection('members')),
    create: (item: User) => hybridFetch('members', 'POST', item, () => db.insert('members', item)),
    update: (id: string, updates: Partial<User>) => hybridFetch(`members/${id}`, 'PUT', updates, () => db.update('members', id, updates)),
    delete: (id: string) => hybridFetch(`members/${id}`, 'DELETE', null, () => db.delete('members', id)),
    updateRole: (id: string, role: string) => hybridFetch(`members/${id}/role`, 'PATCH', { role }, () => db.update('members', id, { role }))
  },
  auth: {
    requestOTP: (email: string) => hybridFetch('auth/otp', 'POST', { email }, () => db.generateOTP(email)),
    verifyOTP: (email: string, otp: string) => hybridFetch('auth/verify', 'POST', { email, otp }, () => db.verifyOTP(email, otp)),
    resetPassword: (email: string, pass: string) => hybridFetch('auth/reset', 'POST', { email, newPassword: pass }, () => db.update('members', null, { email, password: pass }))
  },
  news: {
    getAll: () => hybridFetch('news', 'GET', null, () => db.getCollection('news')),
    create: (item: NewsItem) => hybridFetch('news', 'POST', item, () => db.insert('news', item)),
    update: (id: string, updates: Partial<NewsItem>) => hybridFetch(`news/${id}`, 'PUT', updates, () => db.update('news', id, updates)),
    delete: (id: string) => hybridFetch(`news/${id}`, 'DELETE', null, () => db.delete('news', id))
  },
  leaders: {
    getAll: () => hybridFetch('leaders', 'GET', null, () => db.getCollection('leaders')),
    create: (item: Leader) => hybridFetch('leaders', 'POST', item, () => db.insert('leaders', item)),
    update: (id: string, updates: Partial<Leader>) => hybridFetch(`leaders/${id}`, 'PUT', updates, () => db.update('leaders', id, updates)),
    delete: (id: string) => hybridFetch(`leaders/${id}`, 'DELETE', null, () => db.delete('leaders', id))
  },
  announcements: {
    getAll: () => hybridFetch('announcements', 'GET', null, () => db.getCollection('announcements')),
    create: (item: Announcement) => hybridFetch('announcements', 'POST', item, () => db.insert('announcements', item)),
    update: (id: string, updates: Partial<Announcement>) => hybridFetch(`announcements/${id}`, 'PUT', updates, () => db.update('announcements', id, updates)),
    delete: (id: string) => hybridFetch(`announcements/${id}`, 'DELETE', null, () => db.delete('announcements', id))
  },
  departments: {
    getAll: () => hybridFetch('departments', 'GET', null, () => db.getCollection('departments')),
    create: (item: Department) => hybridFetch('departments', 'POST', item, () => db.insert('departments', item)),
    update: (id: string, updates: Partial<Department>) => hybridFetch(`departments/${id}`, 'PUT', updates, () => db.update('departments', id, updates)),
    delete: (id: string) => hybridFetch(`departments/${id}`, 'DELETE', null, () => db.delete('departments', id))
  },
  donations: {
    getAll: () => hybridFetch('donations', 'GET', null, () => db.getCollection('donations')),
    create: (item: Donation) => hybridFetch('donations', 'POST', item, () => db.insert('donations', item)),
    updateStatus: (id: string, status: string) => hybridFetch(`donations/${id}/status`, 'PATCH', { status }, () => db.update('donations', id, { status })),
    delete: (id: string) => hybridFetch(`donations/${id}`, 'DELETE', null, () => db.delete('donations', id)),
    projects: {
      getAll: () => hybridFetch('donation-projects', 'GET', null, () => db.getCollection('donationProjects')),
      create: (item: DonationProject) => hybridFetch('donation-projects', 'POST', item, () => db.insert('donationProjects', item)),
      update: (id: string, updates: Partial<DonationProject>) => hybridFetch(`donation-projects/${id}`, 'PUT', updates, () => db.update('donationProjects', id, updates)),
      delete: (id: string) => hybridFetch(`donation-projects/${id}`, 'DELETE', null, () => db.delete('donationProjects', id))
    }
  },
  contacts: {
    getAll: () => hybridFetch('contacts', 'GET', null, () => db.getCollection('contacts')),
    create: (msg: any) => hybridFetch('contacts', 'POST', msg, () => db.insert('contacts', { ...msg, id: Date.now().toString(), date: new Date().toISOString(), isRead: false })),
    markRead: (id: string) => hybridFetch(`contacts/${id}/read`, 'PATCH', null, () => db.update('contacts', id, { isRead: true })),
    markAllRead: () => hybridFetch(`contacts/read-all`, 'PATCH', null, () => db.markAllRead()),
    delete: (id: string) => hybridFetch(`contacts/${id}`, 'DELETE', null, () => db.delete('contacts', id))
  },
  home: {
    getConfig: () => hybridFetch('config/home', 'GET', null, () => db.getCollection('homeConfig')),
    updateConfig: (updates: Partial<HomeConfig>) => hybridFetch('config/home', 'PUT', updates, () => db.update('homeConfig', null, updates))
  },
  about: {
    getConfig: () => hybridFetch('config/about', 'GET', null, () => db.getCollection('aboutConfig')),
    updateConfig: (updates: Partial<AboutConfig>) => hybridFetch('config/about', 'PUT', updates, () => db.update('aboutConfig', null, updates))
  },
  system: {
    getHealth: () => hybridFetch('system/health', 'GET', null, async () => db.getHealth()),
    getLogs: () => hybridFetch('system/logs', 'GET', null, () => db.getCollection('logs')),
    getBackups: () => hybridFetch('system/backups', 'GET', null, () => db.getBackups()),
    createBackup: (desc: string) => hybridFetch('system/backups', 'POST', { description: desc }, () => db.createBackup(desc)),
    restoreBackup: (id: string) => hybridFetch(`system/backups/${id}/restore`, 'POST', null, () => db.restoreFromBackup(id)),
    resetDB: () => hybridFetch('system/reset', 'POST', null, async () => { db.reset(); return true; })
  }
};
