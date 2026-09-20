import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  PlusCircle, 
  Filter, 
  CheckCircle2, 
  Send,
  Briefcase,
  Layers,
  Trash2,
  Paperclip
} from 'lucide-react';
import StorageImage from '../components/StorageImage';

export default function JobBoardPage({ onOpenJobModal, onOpenAuth, onOpenMessage }) {
  const { user, currentRole, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  // Application Drawer
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [selectedCrop, selectedUrgency]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await dbService.getJobs({
        searchTerm,
        crop: selectedCrop,
        urgency: selectedUrgency,
        status: 'OPEN'
      });
      setJobs(data);
    } catch (err) {
      console.warn('JobBoard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      onOpenAuth('login', 'skilled_worker');
      return;
    }
    setSelectedJobForApply(job);
    setProposedRate(job.budget || 1800);
  };

  const handleConfirmApplication = async (e) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    await dbService.applyToJob({
      jobId: selectedJobForApply.id,
      workerId: user.id,
      workerName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Skilled Operator',
      pitch,
      proposedRate: Number(proposedRate)
    });

    setApplicationSuccess(`Application submitted successfully for "${selectedJobForApply.title}"!`);
    setSelectedJobForApply(null);
    setPitch('');
    setTimeout(() => setApplicationSuccess(''), 4000);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this agricultural requirement?')) {
      await dbService.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
    }
  };

  return (
    <div style={{ padding: '36px 0 72px' }}>
      <div className="container">
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>REAL WORK OPPORTUNITIES</span>
            <h1 style={styles.pageTitle}>Agricultural Requirements & Job Board</h1>
            <p style={styles.pageSubtitle}>
              Direct contract requirements posted by local farmers, producers, and agribusinesses.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (isAuthenticated) {
                onOpenJobModal();
              } else {
                onOpenAuth('login', 'farmer');
              }
            }}
          >
            <PlusCircle size={20} />
            Post Farm Requirement
          </button>
        </div>

        {/* Application Success Feedback */}
        {applicationSuccess && (
          <div className="badge badge-green" style={{ display: 'block', padding: '14px 18px', fontSize: '14px', marginBottom: '24px' }}>
            ✓ {applicationSuccess}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '32px', padding: '16px 20px' }}>
          <form onSubmit={handleSearchSubmit} style={styles.filterForm}>
            <div style={styles.searchBox}>
              <Search size={18} color="#64748b" />
              <input 
                type="text"
                placeholder="Search jobs by title, crop, district or skill..."
                className="form-input"
                style={{ border: 'none', padding: '6px 0' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={styles.selectGroup}>
              <select 
                className="form-select"
                style={{ minWidth: '130px' }}
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="all">All Crops</option>
                <option value="Paddy">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Chilli">Chilli</option>
                <option value="Maize">Maize</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>

              <select 
                className="form-select"
                style={{ minWidth: '130px' }}
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
              >
                <option value="all">All Urgencies</option>
                <option value="emergency">Emergency / Immediate</option>
                <option value="high">High Priority</option>
                <option value="medium">Standard / Planned</option>
              </select>

              <button type="submit" className="btn btn-primary">
                Filter Jobs
              </button>
            </div>
          </form>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '16px', color: '#64748b' }}>Loading active agricultural jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <Briefcase size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>No jobs available yet</h3>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '440px', margin: '6px auto 20px' }}>
              Post a farm requirement to receive applications and transparent price proposals from verified machine operators.
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (isAuthenticated) onOpenJobModal();
                else onOpenAuth('login', 'farmer');
              }}
            >
              Post a Requirement Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map((job) => (
              <div key={job.id} className="card" style={styles.jobRowCard}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-green">{job.crop || 'Field Work'}</span>
                    <span style={styles.urgencyBadge(job.urgency)}>{(job.urgency || 'MEDIUM').toUpperCase()}</span>
                    <span className="badge badge-slate">{job.rate_type || 'per_day'}</span>
                  </div>

                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobDesc}>{job.description}</p>

                  {job.attachment_url && (
                    <div style={{ marginTop: '8px', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <StorageImage 
                        src={job.attachment_url} 
                        alt="Attached field preview" 
                        style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} 
                        fallbackSrc=""
                      />
                      <span style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Paperclip size={12} /> Field Photo Attached
                      </span>
                    </div>
                  )}

                  <div style={styles.metaWrap}>
                    <span><MapPin size={14} style={{ display: 'inline' }} /> {job.location}</span>
                    <span><Calendar size={14} style={{ display: 'inline' }} /> {job.duration_days || 1} Days Required</span>
                    <span>Required: {Array.isArray(job.required_skills) ? job.required_skills.join(', ') : 'Tractor / Equipment Operator'}</span>
                  </div>
                </div>

                <div style={styles.actionColumn}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#15803d' }}>
                      ₹{Number(job.budget || 0).toLocaleString()}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Estimated Budget</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleApplyClick(job)}
                    >
                      Apply Now
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => onOpenMessage(job.poster_name || 'Farm Owner')}
                    >
                      Inquire
                    </button>
                    {user && (user.id === job.poster_id || user.id === job.posterId) && (
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '8px', color: '#ef4444', borderColor: '#fecaca', backgroundColor: '#fff' }}
                        title="Delete your requirement"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Apply Modal / Drawer */}
        {selectedJobForApply && (
          <div className="modal-overlay" onClick={() => setSelectedJobForApply(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                Apply for: {selectedJobForApply.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Location: {selectedJobForApply.location} • Budget: ₹{Number(selectedJobForApply.budget || 0).toLocaleString()}
              </p>

              <form onSubmit={handleConfirmApplication} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Your Proposed Rate (₹)</label>
                  <input 
                    type="number"
                    required
                    className="form-input"
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pitch / Experience & Equipment Provided</label>
                  <textarea 
                    rows={4}
                    required
                    className="form-textarea"
                    placeholder="Describe your machinery, operational speed, and when you can commence work..."
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ flex: 1 }}
                    onClick={() => setSelectedJobForApply(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                  >
                    Send Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginTop: '4px',
  },
  filterForm: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: '240px',
  },
  selectGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 20px',
    border: '1px dashed #cbd5e1',
  },
  jobRowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    gap: '24px',
    flexWrap: 'wrap',
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
  },
  jobDesc: {
    fontSize: '14px',
    color: '#475569',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  metaWrap: {
    display: 'flex',
    gap: '20px',
    fontSize: '13px',
    color: '#64748b',
    flexWrap: 'wrap',
  },
  actionColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '12px',
    minWidth: '180px',
  },
  urgencyBadge: (urgency) => ({
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: urgency === 'emergency' ? '#fee2e2' : '#f1f5f9',
    color: urgency === 'emergency' ? '#dc2626' : '#475569',
  })
};
