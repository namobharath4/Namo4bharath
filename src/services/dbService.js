import { supabase } from '../supabaseClient';

/**
 * Real Database Service for YUKTI Agricultural Platform
 * Connects directly to Supabase with graceful persistence for user-created data.
 * Zero mock data, zero fake users.
 */

const STORAGE_KEY = 'yukti_real_db_store';

function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse local store:', e);
  }
  return {
    jobs: [],
    equipment: [],
    applications: [],
    conversations: [],
    messages: [],
    notifications: [],
    reviews: [],
    profiles: []
  };
}

function saveLocalStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save local store:', e);
  }
}

export const dbService = {
  // ==========================================================================
  // 1. PROFILES & USERS
  // ==========================================================================
  async getProfile(userId) {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, farmer_profiles(*), company_profiles(*), worker_profiles(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase profile query failed, checking store:', e.message);
    }

    const store = getLocalStore();
    return store.profiles.find(p => p.user_id === userId || p.id === userId) || null;
  },

  async updateProfile(userId, updates) {
    if (!userId) return null;
    let savedProfile = null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        savedProfile = data;
      }
    } catch (e) {
      console.warn('Supabase updateProfile error:', e.message);
    }

    // Always update local store to ensure offline/schema-lag consistency
    const store = getLocalStore();
    const idx = store.profiles.findIndex(p => p.user_id === userId || p.id === userId);
    const existing = idx >= 0 ? store.profiles[idx] : { user_id: userId };
    const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };

    if (idx >= 0) {
      store.profiles[idx] = merged;
    } else {
      store.profiles.push(merged);
    }
    saveLocalStore(store);

    return savedProfile || merged;
  },

  async searchWorkers({ skill, location, availability } = {}) {
    try {
      let query = supabase.from('profiles').select('*, worker_profiles(*)').eq('role', 'skilled_worker');
      if (location) query = query.ilike('district', `%${location}%`);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.filter(w => {
          if (!skill) return true;
          const skillsList = w.worker_profiles?.[0]?.skills || [];
          return skillsList.some(s => s.toLowerCase().includes(skill.toLowerCase()));
        });
      }
    } catch (e) {
      console.warn('Supabase searchWorkers error:', e.message);
    }

    const store = getLocalStore();
    return store.profiles.filter(p => {
      if (p.role !== 'skilled_worker') return false;
      if (location && !(p.location || p.district || '').toLowerCase().includes(location.toLowerCase())) return false;
      if (skill) {
        const skills = p.skills || [];
        if (!skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) return false;
      }
      if (availability && p.availability && p.availability !== availability) return false;
      return true;
    });
  },

  // ==========================================================================
  // 2. JOBS SYSTEM
  // ==========================================================================
  async getJobs({ searchTerm, crop, urgency, status } = {}) {
    try {
      let query = supabase.from('jobs').select('*, profiles:poster_id(*)').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (crop && crop !== 'all') {
        query = query.eq('crop', crop);
      }
      if (urgency && urgency !== 'all') {
        query = query.eq('urgency', urgency);
      }

      const { data, error } = await query;
      if (!error && data) {
        let results = data;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          results = results.filter(j => 
            (j.title || '').toLowerCase().includes(term) ||
            (j.description || '').toLowerCase().includes(term) ||
            (j.location || '').toLowerCase().includes(term)
          );
        }
        return results;
      }
    } catch (e) {
      console.warn('Supabase getJobs error:', e.message);
    }

    const store = getLocalStore();
    return store.jobs.filter(j => {
      if (status && status !== 'all' && j.status !== status) return false;
      if (crop && crop !== 'all' && j.crop !== crop) return false;
      if (urgency && urgency !== 'all' && j.urgency !== urgency) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches = (j.title || '').toLowerCase().includes(term) ||
                        (j.description || '').toLowerCase().includes(term) ||
                        (j.location || '').toLowerCase().includes(term);
        if (!matches) return false;
      }
      return true;
    });
  },

  async getMyJobs(userId) {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, job_applications(*)')
        .eq('poster_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getMyJobs error:', e.message);
    }

    const store = getLocalStore();
    return store.jobs.filter(j => j.poster_id === userId || j.posterId === userId);
  },

  async createJob(jobData) {
    const record = {
      id: jobData.id || crypto.randomUUID(),
      poster_id: jobData.poster_id,
      poster_name: jobData.poster_name,
      poster_role: jobData.poster_role || 'farmer',
      title: jobData.title,
      description: jobData.description,
      crop: jobData.crop,
      location: jobData.location,
      required_skills: Array.isArray(jobData.required_skills) ? jobData.required_skills : (jobData.required_skills || '').split(',').map(s => s.trim()).filter(Boolean),
      required_equipment: Array.isArray(jobData.required_equipment) ? jobData.required_equipment : (jobData.required_equipment || '').split(',').map(s => s.trim()).filter(Boolean),
      workers_needed: Number(jobData.workers_needed) || 1,
      budget: Number(jobData.budget) || 0,
      rate_type: jobData.rate_type || 'per_day',
      duration_days: Number(jobData.duration_days) || 1,
      urgency: jobData.urgency || 'medium',
      status: 'OPEN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('jobs').insert([record]).select().maybeSingle();
      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase createJob error:', e.message);
    }

    const store = getLocalStore();
    store.jobs.unshift(record);
    saveLocalStore(store);

    // Trigger notification
    await this.createNotification({
      user_id: record.poster_id,
      title: 'Job Published',
      message: `Your agricultural requirement "${record.title}" has been published successfully.`,
      type: 'job_update'
    });

    return record;
  },

  async updateJobStatus(jobId, status) {
    try {
      await supabase.from('jobs').update({ status, updated_at: new Date().toISOString() }).eq('id', jobId);
    } catch (e) {
      console.warn('Supabase updateJobStatus error:', e.message);
    }

    const store = getLocalStore();
    const job = store.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = status;
      job.updated_at = new Date().toISOString();
      saveLocalStore(store);
    }
  },

  // ==========================================================================
  // 3. APPLICATIONS
  // ==========================================================================
  async applyToJob({ jobId, workerId, workerName, pitch, proposedRate }) {
    const application = {
      id: crypto.randomUUID(),
      job_id: jobId,
      worker_id: workerId,
      worker_name: workerName,
      pitch: pitch || '',
      proposed_rate: Number(proposedRate) || 0,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('job_applications').insert([application]).select().maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase applyToJob error:', e.message);
    }

    const store = getLocalStore();
    store.applications.push(application);
    saveLocalStore(store);

    // Notify job poster
    const job = store.jobs.find(j => j.id === jobId);
    if (job && job.poster_id) {
      await this.createNotification({
        user_id: job.poster_id,
        title: 'New Applicant Received',
        message: `${workerName || 'A skilled worker'} applied for "${job.title}".`,
        type: 'application_received'
      });
    }

    return application;
  },

  async getApplicationsForJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, profiles:worker_id(*)')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getApplicationsForJob error:', e.message);
    }

    const store = getLocalStore();
    return store.applications.filter(a => a.job_id === jobId);
  },

  async getMyApplications(workerId) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, jobs(*)')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getMyApplications error:', e.message);
    }

    const store = getLocalStore();
    return store.applications.filter(a => a.worker_id === workerId);
  },

  async updateApplicationStatus(applicationId, newStatus) {
    try {
      await supabase.from('job_applications').update({ status: newStatus }).eq('id', applicationId);
    } catch (e) {
      console.warn('Supabase updateApplicationStatus error:', e.message);
    }

    const store = getLocalStore();
    const app = store.applications.find(a => a.id === applicationId);
    if (app) {
      app.status = newStatus;
      saveLocalStore(store);

      // Notify the applicant
      await this.createNotification({
        user_id: app.worker_id,
        title: `Application ${newStatus.toUpperCase()}`,
        message: `Your application status has been updated to ${newStatus}.`,
        type: 'application_status'
      });
    }
  },

  // ==========================================================================
  // 4. EQUIPMENT & MACHINERY
  // ==========================================================================
  async getEquipment({ category, location, operatorIncluded } = {}) {
    try {
      let query = supabase.from('equipment').select('*, profiles:owner_id(*)').eq('is_available', true).order('created_at', { ascending: false });
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (operatorIncluded) {
        query = query.eq('operator_included', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        let results = data;
        if (location) {
          const loc = location.toLowerCase();
          results = results.filter(e => (e.location || '').toLowerCase().includes(loc));
        }
        return results;
      }
    } catch (e) {
      console.warn('Supabase getEquipment error:', e.message);
    }

    const store = getLocalStore();
    return store.equipment.filter(eq => {
      if (!eq.is_available) return false;
      if (category && category !== 'all' && eq.category !== category) return false;
      if (operatorIncluded && !eq.operator_included) return false;
      if (location && !(eq.location || '').toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });
  },

  async getMyEquipment(ownerId) {
    if (!ownerId) return [];
    try {
      const { data, error } = await supabase.from('equipment').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getMyEquipment error:', e.message);
    }

    const store = getLocalStore();
    return store.equipment.filter(e => e.owner_id === ownerId || e.ownerId === ownerId);
  },

  async createEquipment(item) {
    const record = {
      id: crypto.randomUUID(),
      owner_id: item.owner_id,
      owner_name: item.owner_name,
      name: item.name,
      category: item.category,
      model_year: Number(item.model_year) || new Date().getFullYear(),
      daily_rate: Number(item.daily_rate) || 0,
      weekly_rate: item.weekly_rate ? Number(item.weekly_rate) : null,
      operator_included: Boolean(item.operator_included),
      condition: item.condition || 'Good',
      location: item.location || '',
      specs: item.specs || '',
      image_url: item.image_url || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
      is_available: true,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('equipment').insert([record]).select().maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase createEquipment error:', e.message);
    }

    const store = getLocalStore();
    store.equipment.unshift(record);
    saveLocalStore(store);

    await this.createNotification({
      user_id: record.owner_id,
      title: 'Equipment Listed',
      message: `${record.name} is now available for farm hire in ${record.location}.`,
      type: 'equipment_listed'
    });

    return record;
  },

  // ==========================================================================
  // 5. MESSAGING & NOTIFICATIONS
  // ==========================================================================
  async getMessages(userId, targetUserId) {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getMessages error:', e.message);
    }

    const store = getLocalStore();
    return store.messages.filter(m => 
      (m.sender_id === userId && m.recipient_id === targetUserId) ||
      (m.sender_id === targetUserId && m.recipient_id === userId)
    );
  },

  async sendMessage({ senderId, recipientId, senderName, content }) {
    const message = {
      id: crypto.randomUUID(),
      sender_id: senderId,
      recipient_id: recipientId,
      sender_name: senderName,
      content,
      is_read: false,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('messages').insert([message]).select().maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase sendMessage error:', e.message);
    }

    const store = getLocalStore();
    store.messages.push(message);
    saveLocalStore(store);

    if (recipientId) {
      await this.createNotification({
        user_id: recipientId,
        title: 'New Message Received',
        message: `${senderName || 'A member'}: "${content.slice(0, 40)}${content.length > 40 ? '...' : ''}"`,
        type: 'new_message'
      });
    }

    return message;
  },

  async getNotifications(userId) {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getNotifications error:', e.message);
    }

    const store = getLocalStore();
    return store.notifications.filter(n => n.user_id === userId);
  },

  async createNotification({ user_id, title, message, type = 'info' }) {
    if (!user_id) return null;
    const notif = {
      id: crypto.randomUUID(),
      user_id,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from('notifications').insert([notif]);
    } catch (e) {
      // ignore
    }

    const store = getLocalStore();
    store.notifications.unshift(notif);
    saveLocalStore(store);
    return notif;
  },

  // ==========================================================================
  // 6. REVIEWS & RATINGS
  // ==========================================================================
  async getReviewsForUser(userId) {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewer_id(*)')
        .eq('reviewee_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getReviews error:', e.message);
    }

    const store = getLocalStore();
    return store.reviews.filter(r => r.reviewee_id === userId);
  },

  async submitReview({ jobId, reviewerId, revieweeId, rating, comment, reviewerName }) {
    const review = {
      id: crypto.randomUUID(),
      job_id: jobId || null,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      reviewer_name: reviewerName,
      rating: Number(rating),
      comment,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('reviews').insert([review]).select().maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase submitReview error:', e.message);
    }

    const store = getLocalStore();
    store.reviews.unshift(review);
    saveLocalStore(store);

    await this.createNotification({
      user_id: revieweeId,
      title: 'New Review Received',
      message: `${reviewerName || 'A farm client'} rated you ${rating}★: "${comment}"`,
      type: 'review'
    });

    return review;
  }
};
