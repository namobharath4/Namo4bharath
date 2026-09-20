import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  AlertCircle,
  Calculator,
  MessageSquare,
  Users,
  ChevronRight
} from 'lucide-react';
import { INITIAL_WORKERS, INITIAL_EQUIPMENT, INITIAL_JOBS } from '../data/mockData';

export default function FarmerDashboard({ onOpenJobModal, onOpenMessage }) {
  const { profile } = useAuth();
  
  // Local state for farmer's active jobs
  const [myJobs, setMyJobs] = useState(INITIAL_JOBS.filter(j => j.posterRole === 'farmer'));
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Calculator state
  const [calcAcres, setCalcAcres] = useState(8);
  const [calcMachinery, setCalcMachinery] = useState('tractor');

  // Calculate rental vs buy savings
  const machinePurchaseCost = calcMachinery === 'tractor' ? 850000 : 2400000;
  const seasonalRentalCost = calcMachinery === 'tractor' ? (calcAcres * 2200) : (calcAcres * 3800);
  const annualSavings = Math.round(machinePurchaseCost * 0.18 - seasonalRentalCost);

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        {/* Top Greeting & Banner */}
        <div style={styles.topBanner}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: '8px' }}>
              <Sprout size={14} /> VERIFIED CULTIVATOR
            </div>
            <h1 style={styles.welcomeHeading}>
              Good day, {profile?.name || 'Farmer'} 👋
            </h1>
            <p style={styles.welcomeSub}>
              Manage your agricultural labor, schedule field machinery, and monitor harvest operations.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={onOpenJobModal}
          >
            <PlusCircle size={20} />
            Post Farm Requirement
          </button>
        </div>

        {/* Farm Profile Summary & Quick Actions */}
        <div style={styles.dashboardGrid}>
          {/* Left Column: Farm Specs & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Farm Profile Card */}
            <div className="card">
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>🌾 Farm Overview</h3>
                <span className="badge badge-green">Active Season</span>
              </div>
              
              <div style={styles.specGrid}>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Holding Size</span>
                  <span style={styles.specValue}>{profile?.farmSizeAcres || '12.5'} Acres</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Location</span>
                  <span style={styles.specValue}>{profile?.location || 'Tenali, Guntur'}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Primary Crops</span>
                  <span style={styles.specValue}>Paddy, Chilli, Cotton</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Irrigation</span>
                  <span style={styles.specValue}>Canal + Borewell</span>
                </div>
              </div>
            </div>

            {/* Rent vs Buy Savings Engine */}
            <div className="card" style={{ borderLeft: '4px solid #15803d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Calculator size={20} color="#15803d" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Custom Hiring Savings Engine</h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Compare custom hiring rental costs against outright machinery capital depreciation.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11px' }}>Land Extent (Acres)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={calcAcres}
                    onChange={(e) => setCalcAcres(Number(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '11px' }}>Equipment Type</label>
                  <select 
                    className="form-select"
                    value={calcMachinery}
                    onChange={(e) => setCalcMachinery(e.target.value)}
                  >
                    <option value="tractor">47HP Tractor + Rotavator</option>
                    <option value="harvester">Paddy Combine Harvester</option>
                  </select>
                </div>
              </div>

              <div style={styles.calcResultsBox}>
                <div style={{ fontSize: '12px', color: '#166534' }}>Estimated Seasonal Rental: ₹{seasonalRentalCost.toLocaleString()}</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
                  Saves ~₹{annualSavings > 0 ? annualSavings.toLocaleString() : '1,20,000'}/year vs. ownership debt
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Manage Posted Jobs & Worker Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Posted Jobs Management */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>My Farm Requirements</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Track bids, worker applicants, and work completion.</span>
                </div>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={onOpenJobModal}
                >
                  <PlusCircle size={14} /> New Post
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myJobs.map((job) => (
                  <div key={job.id} style={styles.jobItemRow}>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-green">{job.crop}</span>
                        <span style={styles.statusBadge(job.status)}>{job.status}</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{job.title}</h4>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                        <span><MapPin size={12} style={{ display: 'inline' }} /> {job.location}</span>
                        <span><Calendar size={12} style={{ display: 'inline' }} /> {job.durationDays} Days</span>
                        <span style={{ fontWeight: '700', color: '#15803d' }}>₹{job.budget.toLocaleString()} ({job.rateType})</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onOpenMessage(job.posterName)}
                      >
                        <MessageSquare size={14} /> Applicants ({job.applicantsCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Verified Operators & Machinery */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Verified Local Machinery & Operators</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Within 35km radius of your farm location.</span>
                </div>
              </div>

              <div className="grid-2">
                {INITIAL_WORKERS.slice(0, 2).map((worker) => (
                  <div key={worker.id} style={styles.workerSmallCard}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={worker.avatar} alt={worker.name} style={styles.workerAvatar} />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{worker.name}</h4>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{worker.location}</div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#ca8a04' }}>★ {worker.rating} ({worker.reviewsCount} reviews)</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '10px 0' }}>
                      {worker.skills.map((s, idx) => (
                        <span key={idx} className="badge badge-slate" style={{ fontSize: '10px' }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#15803d' }}>₹{worker.dailyRate}/day</span>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onOpenMessage(worker.name)}
                      >
                        Book Worker
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
  },
  welcomeSub: {
    fontSize: '14px',
    color: '#64748b',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
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
    fontWeight: '700',
    color: '#0f172a',
  },
  specGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  specLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
  },
  calcResultsBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '12px',
  },
  jobItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    gap: '16px',
    flexWrap: 'wrap',
  },
  statusBadge: (status) => ({
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: status === 'OPEN' ? '#dcfce7' : '#e0f2fe',
    color: status === 'OPEN' ? '#166534' : '#0369a1',
  }),
  workerSmallCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '16px',
  },
  workerAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  }
};
