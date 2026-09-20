import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Sprout, 
  PlusCircle, 
  Search, 
  Tractor, 
  Wrench, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Calculator,
  MessageSquare,
  Users,
  Edit2,
  Check,
  XCircle,
  Briefcase,
  Trash2,
  Paperclip,
  Upload
} from 'lucide-react';
import StorageImage from '../components/StorageImage';

export default function FarmerDashboard({ onOpenJobModal, onOpenMessage }) {
  const { user, profile, updateProfile, uploadAvatar, deleteAvatar } = useAuth();
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  // Real database states
  const [myJobs, setMyJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Farm Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [farmName, setFarmName] = useState(profile?.farm_name || 'Annapurna Cultivation');
  const [farmSize, setFarmSize] = useState(profile?.farm_size_acres || 8.5);
  const [crops, setCrops] = useState(Array.isArray(profile?.primary_crops) ? profile.primary_crops.join(', ') : 'Paddy, Chilli, Cotton');
  const [soilType, setSoilType] = useState(profile?.soil_type || 'Black Cotton Alluvial');
  const [irrigation, setIrrigation] = useState(profile?.irrigation_source || 'Canal & Borewell');
  const [location, setLocation] = useState(profile?.location || 'Tenali, Guntur, AP');

  // Applications Drawer state
  const [selectedJobForApps, setSelectedJobForApps] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);

  // Worker Search State
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');

  // Calculator state
  const [calcAcres, setCalcAcres] = useState(farmSize || 8);
  const [calcMachinery, setCalcMachinery] = useState('tractor');

  const machinePurchaseCost = calcMachinery === 'tractor' ? 850000 : 2400000;
  const seasonalRentalCost = calcMachinery === 'tractor' ? (calcAcres * 2200) : (calcAcres * 3800);
  const annualSavings = Math.round(machinePurchaseCost * 0.18 - seasonalRentalCost);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    if (!user) return;
    setLoading(true);
    try {
      const [jobsData, workersData] = await Promise.all([
        dbService.getMyJobs(user.id),
        dbService.searchWorkers()
      ]);
      setMyJobs(jobsData);
      setWorkers(workersData);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      farm_name: farmName,
      farm_size_acres: Number(farmSize),
      primary_crops: crops.split(',').map(s => s.trim()).filter(Boolean),
      soil_type: soilType,
      irrigation_source: irrigation,
      location: location
    });
    setIsEditingProfile(false);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    await dbService.updateJobStatus(jobId, newStatus);
    setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
  };

  const handleViewApplications = async (job) => {
    setSelectedJobForApps(job);
    const apps = await dbService.getApplicationsForJob(job.id);
    setJobApplications(apps);
  };

  const handleApplicationDecision = async (appId, decision) => {
    await dbService.updateApplicationStatus(appId, decision);
    setJobApplications(prev => prev.map(a => a.id === appId ? { ...a, status: decision } : a));
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Delete this agricultural requirement?')) {
      await dbService.deleteJob(jobId);
      setMyJobs(prev => prev.filter(j => j.id !== jobId));
      if (selectedJobForApps?.id === jobId) {
        setSelectedJobForApps(null);
        setJobApplications([]);
      }
    }
  };

  const handleDeleteJobAttachment = async (jobId) => {
    if (window.confirm('Remove attached photo from this requirement?')) {
      await dbService.deleteJobAttachment(jobId);
      setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, attachment_url: null } : j));
    }
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      alert('Avatar upload failed: ' + err.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (window.confirm('Remove profile avatar?')) {
      await deleteAvatar();
    }
  };

  const filteredWorkers = workers.filter(w => {
    if (!workerSearchTerm) return true;
    const term = workerSearchTerm.toLowerCase();
    const nameMatch = (w.name || w.full_name || '').toLowerCase().includes(term);
    const locMatch = (w.location || w.district || '').toLowerCase().includes(term);
    const skillsMatch = (w.skills || []).some(s => s.toLowerCase().includes(term));
    return nameMatch || locMatch || skillsMatch;
  });

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        {/* Top Banner */}
        <div style={styles.topBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              {profile?.avatar_url ? (
                <StorageImage 
                  src={profile.avatar_url} 
                  alt="Farmer Avatar" 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #16a34a' }}
                />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: '#15803d', border: '3px solid #16a34a' }}>
                  {(profile?.name || user?.email || 'F').charAt(0).toUpperCase()}
                </div>
              )}
              <label 
                style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#15803d', color: '#fff', padding: '5px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                title="Upload Profile Picture"
              >
                <Upload size={13} />
                <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: 'none' }} disabled={avatarUploading} />
              </label>
            </div>
            <div>
              <div className="badge badge-green" style={{ marginBottom: '4px' }}>
                <Sprout size={14} /> FARMER PORTAL
              </div>
              <h1 style={styles.welcomeHeading}>
                Welcome, {profile?.name || profile?.full_name || user?.email?.split('@')[0]}
              </h1>
              <p style={styles.welcomeSub}>
                Manage your agricultural holdings, post acreage requirements, and connect with verified machinery operators.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={onOpenJobModal}
          >
            <PlusCircle size={20} />
            Post Farm Requirement
          </button>
        </div>

        {/* Main Grid */}
        <div style={styles.dashboardGrid}>
          {/* Left Column: Farm Profile & Custom Hiring Calculator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Farm Profile Card */}
            <div className="card">
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sprout size={20} color="#15803d" />
                  <h3 style={styles.cardTitle}>Farm Holding Overview</h3>
                </div>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit2 size={13} /> {isEditingProfile ? 'Cancel' : 'Edit Farm'}
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={styles.fieldLabel}>Farm Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={farmName} 
                      onChange={(e) => setFarmName(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={styles.fieldLabel}>Acreage</label>
                      <input 
                        type="number" 
                        step="0.5" 
                        className="form-input" 
                        value={farmSize} 
                        onChange={(e) => setFarmSize(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Location</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Primary Crops</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={crops} 
                      onChange={(e) => setCrops(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Soil Type</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={soilType} 
                      onChange={(e) => setSoilType(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Irrigation Source</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={irrigation} 
                      onChange={(e) => setIrrigation(e.target.value)} 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '6px' }}>
                    <Check size={14} /> Save Farm Details
                  </button>
                </form>
              ) : (
                <div style={styles.specGrid}>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Farm Holding</span>
                    <span style={styles.specValue}>{farmName}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Holding Size</span>
                    <span style={styles.specValue}>{farmSize} Acres</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Location</span>
                    <span style={styles.specValue}>{location}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Primary Crops</span>
                    <span style={styles.specValue}>{crops}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Soil Classification</span>
                    <span style={styles.specValue}>{soilType}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Irrigation Source</span>
                    <span style={styles.specValue}>{irrigation}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Hiring Calculator */}
            <div className="card" style={{ borderLeft: '4px solid #15803d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Calculator size={20} color="#15803d" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Custom Hiring vs. Ownership Calculator</h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Calculate financial savings from renting specialized field machinery versus capital investment.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={styles.fieldLabel}>Acreage to Service</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={calcAcres}
                    onChange={(e) => setCalcAcres(Number(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label style={styles.fieldLabel}>Machine Type</label>
                  <select 
                    className="form-select"
                    value={calcMachinery}
                    onChange={(e) => setCalcMachinery(e.target.value)}
                  >
                    <option value="tractor">Tractor (45-55 HP)</option>
                    <option value="harvester">Combine Harvester</option>
                  </select>
                </div>
              </div>

              <div style={styles.calcResultsBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Machine Capital Value:</span>
                  <span style={{ fontWeight: '600' }}>₹{machinePurchaseCost.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Annual Custom Rental:</span>
                  <span style={{ fontWeight: '600', color: '#15803d' }}>₹{seasonalRentalCost.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', color: '#15803d' }}>
                  <span>Annual Capital Saved:</span>
                  <span>~₹{annualSavings > 0 ? annualSavings.toLocaleString() : '85,000'} / year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Manage Posted Requirements & Nearby Workers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Posted Jobs Section */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>My Farm Requirements</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Track active bids, worker applicants, and execution progress.</span>
                </div>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={onOpenJobModal}
                >
                  <PlusCircle size={14} /> New Requirement
                </button>
              </div>

              {myJobs.length === 0 ? (
                <div style={styles.emptyStateContainer}>
                  <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>You don't have any active jobs</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '4px auto 16px' }}>
                    Post a job to start receiving proposals and applications from skilled machinery operators in your area.
                  </p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={onOpenJobModal}
                  >
                    Post Farm Requirement
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myJobs.map((job) => (
                    <div key={job.id} style={styles.jobItemRow}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="badge badge-green">{job.crop || 'Crop Prep'}</span>
                          <span style={styles.statusBadge(job.status)}>{job.status}</span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{job.title}</h4>
                        
                        {job.attachment_url && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '6px 0', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                            <StorageImage 
                              src={job.attachment_url} 
                              alt="Job attachment" 
                              style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Paperclip size={12} /> Attachment
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteJobAttachment(job.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: '600', padding: '0 4px' }}
                              title="Delete attachment from Storage"
                            >
                              Remove
                            </button>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span><MapPin size={12} style={{ display: 'inline' }} /> {job.location}</span>
                          <span><Calendar size={12} style={{ display: 'inline' }} /> {job.duration_days || 1} Days</span>
                          <span style={{ fontWeight: '700', color: '#15803d' }}>₹{Number(job.budget || 0).toLocaleString()} ({job.rate_type || 'per_day'})</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleViewApplications(job)}
                        >
                          <Users size={14} /> Applicants
                        </button>
                        {job.status === 'OPEN' && (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleStatusChange(job.id, 'COMPLETED')}
                          >
                            Mark Completed
                          </button>
                        )}
                        {job.status === 'OPEN' && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatusChange(job.id, 'CANCELLED')}
                          >
                            Close
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-secondary"
                          style={{ color: '#ef4444', borderColor: '#fecaca', backgroundColor: '#fff' }}
                          title="Delete requirement"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Applications Viewer Drawer if selected */}
            {selectedJobForApps && (
              <div className="card" style={{ border: '2px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#15803d' }}>
                    Applicants for: "{selectedJobForApps.title}"
                  </h4>
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => setSelectedJobForApps(null)}
                  >
                    Close Panel
                  </button>
                </div>

                {jobApplications.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#64748b', padding: '12px 0' }}>
                    No applications received for this posting yet. Operators will appear here as soon as they apply.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {jobApplications.map((app) => (
                      <div key={app.id} style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px' }}>{app.worker_name || 'Skilled Operator'}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Proposed: ₹{Number(app.proposed_rate || 0).toLocaleString()}</div>
                          </div>
                          <span className="badge badge-slate">{app.status}</span>
                        </div>
                        {app.pitch && (
                          <p style={{ fontSize: '13px', color: '#334155', margin: '6px 0' }}>"{app.pitch}"</p>
                        )}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          {app.status === 'PENDING' && (
                            <>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleApplicationDecision(app.id, 'ACCEPTED')}
                              >
                                Accept Applicant
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleApplicationDecision(app.id, 'REJECTED')}
                              >
                                Decline
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onOpenMessage(app.worker_name || 'Worker')}
                          >
                            <MessageSquare size={13} /> Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Operator Directory */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Skilled Machinery & Operators Network</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Direct discovery of certified operators in your district.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
                  <Search size={16} color="#64748b" />
                  <input 
                    type="text" 
                    placeholder="Search by skill or location..."
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    value={workerSearchTerm}
                    onChange={(e) => setWorkerSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredWorkers.length === 0 ? (
                <div style={styles.emptyStateContainer}>
                  <Users size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>No workers found in this area</h4>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Post a farm requirement so operators who travel across districts can view and apply for your job.
                  </p>
                </div>
              ) : (
                <div className="grid-2">
                  {filteredWorkers.map((worker) => (
                    <div key={worker.id || worker.user_id} style={styles.workerSmallCard}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                          {worker.name || worker.full_name}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          <MapPin size={12} style={{ display: 'inline' }} /> {worker.location || worker.district || 'Andhra Pradesh'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '8px 0' }}>
                        {(worker.skills || ['Tractor Operator']).map((s, idx) => (
                          <span key={idx} className="badge badge-slate" style={{ fontSize: '10px' }}>{s}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: 'auto' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#15803d' }}>
                          ₹{worker.daily_rate || 1800}/day
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onOpenMessage(worker.name || worker.full_name)}
                        >
                          <MessageSquare size={13} /> Book Operator
                        </button>
                      </div>
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
  welcomeHeading: {
    fontSize: '26px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  welcomeSub: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
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
  specGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  specLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    marginTop: '2px',
  },
  calcResultsBox: {
    backgroundColor: '#f0fdf4',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  jobItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    gap: '16px',
    flexWrap: 'wrap',
  },
  statusBadge: (status) => ({
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: status === 'OPEN' ? '#dcfce7' : status === 'COMPLETED' ? '#e0f2fe' : '#fee2e2',
    color: status === 'OPEN' ? '#15803d' : status === 'COMPLETED' ? '#0369a1' : '#dc2626',
  }),
  workerSmallCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    gap: '8px',
  },
  emptyStateContainer: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px dashed #cbd5e1',
  }
};
