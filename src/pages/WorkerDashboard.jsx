import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Wrench, 
  Tractor, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Star, 
  Briefcase, 
  Edit2, 
  Check, 
  Send, 
  MessageSquare,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function WorkerDashboard({ onOpenEquipmentModal, onOpenMessage }) {
  const { user, profile, updateProfile } = useAuth();

  const [availableJobs, setAvailableJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myEquipment, setMyEquipment] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [workerName, setWorkerName] = useState(profile?.name || profile?.full_name || 'Ramesh Reddy');
  const [skillsStr, setSkillsStr] = useState(
    Array.isArray(profile?.skills) ? profile.skills.join(', ') : 'Tractor Operator, Rotavator Specialist, Laser Land Leveler'
  );
  const [toolsStr, setToolsStr] = useState(
    Array.isArray(profile?.tools_owned) ? profile.tools_owned.join(', ') : 'Mahindra 575 DI Tractor, Shaktiman 7ft Rotavator'
  );
  const [dailyRate, setDailyRate] = useState(profile?.daily_rate || 1800);
  const [location, setLocation] = useState(profile?.location || 'Tenali, Guntur, AP');
  const [availability, setAvailability] = useState(profile?.availability || 'available'); // 'available' | 'busy' | 'offline'

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState(null);
  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    loadWorkerData();
  }, [user]);

  async function loadWorkerData() {
    if (!user) return;
    setLoading(true);
    try {
      const [jobs, apps, equip, reviews] = await Promise.all([
        dbService.getJobs({ status: 'OPEN' }),
        dbService.getMyApplications(user.id),
        dbService.getMyEquipment(user.id),
        dbService.getReviewsForUser(user.id)
      ]);
      setAvailableJobs(jobs);
      setMyApplications(apps);
      setMyEquipment(equip);
      setMyReviews(reviews);
    } catch (err) {
      console.warn('Worker dashboard error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: workerName,
      full_name: workerName,
      skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean),
      tools_owned: toolsStr.split(',').map(s => s.trim()).filter(Boolean),
      daily_rate: Number(dailyRate),
      location,
      availability
    });
    setIsEditing(false);
  };

  const handleToggleAvailability = async (newStatus) => {
    setAvailability(newStatus);
    await updateProfile({ availability: newStatus });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    await dbService.applyToJob({
      jobId: applyingJob.id,
      workerId: user.id,
      workerName: workerName,
      pitch,
      proposedRate: Number(proposedRate) || dailyRate
    });

    setApplySuccess(`Application sent for "${applyingJob.title}"!`);
    setPitch('');
    setApplyingJob(null);

    // Refresh applications
    const updatedApps = await dbService.getMyApplications(user.id);
    setMyApplications(updatedApps);
    setTimeout(() => setApplySuccess(''), 4000);
  };

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        {/* Top Worker Profile Banner */}
        <div style={styles.topBanner}>
          <div>
            <div className="badge badge-yellow" style={{ marginBottom: '8px' }}>
              <Wrench size={14} /> SKILLED LABOUR + TOOLS PORTAL
            </div>
            <h1 style={styles.workerTitle}>
              {workerName}
            </h1>
            <div style={styles.metaRow}>
              <span><MapPin size={13} style={{ display: 'inline' }} /> {location}</span>
              <span>•</span>
              <span>Rate: ₹{dailyRate}/day</span>
              <span>•</span>
              <span style={{ 
                color: availability === 'available' ? '#15803d' : '#ca8a04',
                fontWeight: '700'
              }}>
                ● {availability === 'available' ? 'Available for Work' : availability === 'busy' ? 'Currently on Job' : 'Offline'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-accent"
              onClick={onOpenEquipmentModal}
            >
              <Tractor size={18} /> List Machinery for Rent
            </button>
          </div>
        </div>

        {applySuccess && (
          <div className="badge badge-green" style={{ display: 'block', padding: '12px 16px', fontSize: '14px', marginBottom: '20px' }}>
            ✓ {applySuccess}
          </div>
        )}

        {/* Dashboard Grid */}
        <div style={styles.dashboardGrid}>
          {/* Left Column: Skills Showcase, Equipment Owned, Availability Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Professional Profile & Skills Card */}
            <div className="card">
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={20} color="#ca8a04" />
                  <h3 style={styles.cardTitle}>Skills & Fleet Showcase</h3>
                </div>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 size={13} /> {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={styles.fieldLabel}>Operator / Technician Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={workerName} 
                      onChange={(e) => setWorkerName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Specialized Skills (comma-separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={skillsStr} 
                      onChange={(e) => setSkillsStr(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Machinery & Implements Owned</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={toolsStr} 
                      onChange={(e) => setToolsStr(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={styles.fieldLabel}>Daily Rate (₹)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={dailyRate} 
                        onChange={(e) => setDailyRate(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Location / Base</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Availability Status</label>
                    <select 
                      className="form-select"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="available">Available for Bookings</option>
                      <option value="busy">Busy (Currently on Job)</option>
                      <option value="offline">Offline / Rest Period</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary" style={{ backgroundColor: '#ca8a04', borderColor: '#ca8a04', marginTop: '6px' }}>
                    <Check size={14} /> Save Profile
                  </button>
                </form>
              ) : (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={styles.specLabel}>What can you do? (Skills)</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {skillsStr.split(',').map((s, idx) => (
                        <span key={idx} className="badge badge-yellow" style={{ fontSize: '11px' }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <span style={styles.specLabel}>What tools & machinery can you provide?</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {toolsStr.split(',').map((t, idx) => (
                        <span key={idx} className="badge badge-green" style={{ fontSize: '11px' }}>
                          <Tractor size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={styles.specLabel}>Daily Wage Base</span>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>₹{dailyRate} / day</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        className={`btn btn-sm ${availability === 'available' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleToggleAvailability('available')}
                      >
                        Available
                      </button>
                      <button 
                        className={`btn btn-sm ${availability === 'busy' ? 'btn-accent' : 'btn-secondary'}`}
                        onClick={() => handleToggleAvailability('busy')}
                      >
                        Busy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* My Listed Machinery for Rent */}
            <div className="card">
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tractor size={20} color="#15803d" />
                  <h3 style={styles.cardTitle}>My Machinery for Rent</h3>
                </div>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={onOpenEquipmentModal}
                >
                  <PlusCircle size={13} /> Add Machine
                </button>
              </div>

              {myEquipment.length === 0 ? (
                <div style={styles.emptyCard}>
                  <Tractor size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                    You haven't listed any machinery for farm rental yet.
                  </p>
                  <button className="btn btn-sm btn-accent" onClick={onOpenEquipmentModal}>
                    List a Machine
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {myEquipment.map((eq) => (
                    <div key={eq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{eq.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{eq.category} • {eq.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d' }}>₹{eq.daily_rate}/day</div>
                        <span className="badge badge-green" style={{ fontSize: '10px' }}>Listed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Reviews */}
            <div className="card">
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={20} color="#ca8a04" />
                  <h3 style={styles.cardTitle}>Verified Farmer Reviews</h3>
                </div>
              </div>

              {myReviews.length === 0 ? (
                <div style={styles.emptyCard}>
                  <Star size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    No reviews yet. Complete your first farm booking to build your rating.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {myReviews.map((rev) => (
                    <div key={rev.id} style={{ padding: '10px', backgroundColor: '#fefce8', borderRadius: '8px', border: '1px solid #fef08a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '12px' }}>{rev.reviewer_name || 'Farmer'}</span>
                        <span style={{ color: '#ca8a04', fontWeight: '800', fontSize: '12px' }}>{rev.rating} ★</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#334155' }}>"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Matching Jobs & Applications Submitted */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Open Agricultural Requirements (Live Feed) */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Matching Farm Requirements</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Acreage preparation, sowing, spraying, and harvesting jobs.</span>
                </div>
                <span className="badge badge-green">{availableJobs.length} Open Jobs</span>
              </div>

              {availableJobs.length === 0 ? (
                <div style={styles.emptyCard}>
                  <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>No open jobs matching right now</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '4px auto' }}>
                    Keep your profile marked as "Available" to be notified when farmers in your district post requirements.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {availableJobs.map((job) => (
                    <div key={job.id} style={styles.jobFeedCard}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="badge badge-green">{job.crop || 'Agriculture'}</span>
                          <span className="badge badge-slate">{job.rate_type || 'per_day'}</span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{job.title}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0' }}>{job.description}</p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                          <span><MapPin size={12} style={{ display: 'inline' }} /> {job.location}</span>
                          <span>Budget: ₹{Number(job.budget || 0).toLocaleString()}</span>
                          <span>Duration: {job.duration_days || 1} Days</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setApplyingJob(job);
                            setProposedRate(job.budget || dailyRate);
                          }}
                        >
                          <Send size={13} /> Apply Now
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => onOpenMessage(job.poster_name || 'Farmer')}
                        >
                          <MessageSquare size={13} /> Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Pitch Modal/Drawer */}
            {applyingJob && (
              <div className="card" style={{ border: '2px solid #ca8a04', backgroundColor: '#fefce8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#854d0e' }}>
                    Submit Proposal for: "{applyingJob.title}"
                  </h4>
                  <button className="btn btn-sm btn-secondary" onClick={() => setApplyingJob(null)}>
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={styles.fieldLabel}>Your Proposed Rate (₹)</label>
                    <input 
                      type="number"
                      required
                      className="form-input"
                      value={proposedRate}
                      onChange={(e) => setProposedRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Proposal / Message to Farm Owner</label>
                    <textarea 
                      required
                      className="form-textarea"
                      rows={3}
                      placeholder="e.g. I have 7 years of tractor experience and can bring a 7ft rotavator to finish your 8 acres in 2 days..."
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ca8a04', borderColor: '#ca8a04' }}>
                    Confirm & Send Application
                  </button>
                </form>
              </div>
            )}

            {/* My Submitted Applications */}
            <div className="card">
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>My Submitted Applications</h3>
                <span className="badge badge-slate">{myApplications.length} Total</span>
              </div>

              {myApplications.length === 0 ? (
                <div style={styles.emptyCard}>
                  <Clock size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    You have not submitted any applications yet. Apply to open farm requirements above.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {myApplications.map((app) => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700' }}>Job ID: {app.job_id?.slice(0, 8)}...</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Proposed: ₹{Number(app.proposed_rate || 0).toLocaleString()} • "{app.pitch?.slice(0, 40)}..."</div>
                      </div>
                      <span className={`badge ${app.status === 'ACCEPTED' ? 'badge-green' : app.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  topBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    backgroundColor: '#ffffff',
    padding: '24px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '20px',
  },
  workerTitle: {
    fontSize: '26px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '6px',
    flexWrap: 'wrap',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '3px',
    textTransform: 'uppercase',
  },
  specLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
  },
  jobFeedCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    gap: '16px',
    flexWrap: 'wrap',
  }
};
