import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  Tractor, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  Star, 
  DollarSign, 
  ShieldCheck, 
  PlusCircle, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { INITIAL_JOBS, INITIAL_EQUIPMENT } from '../data/mockData';

export default function WorkerDashboard({ onOpenMessage, onOpenEquipmentModal }) {
  const { profile } = useAuth();
  
  const [availability, setAvailability] = useState('available');
  const [serviceType, setServiceType] = useState('skill_and_tool'); // 'skill_only' | 'tool_only' | 'skill_and_tool'
  const [dailyRate, setDailyRate] = useState(1800);
  const [hourlyRate, setHourlyRate] = useState(250);

  // Incoming Job Booking Requests
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 'req-1',
      farmerName: 'Venkat Reddy (Farmer)',
      location: 'Duggirala, Guntur (12 km away)',
      serviceNeeded: '8 Acres Paddy Land Rotavator Puddling',
      dates: 'Tomorrow - 3 Days',
      proposedPay: '₹5,400 total (₹1,800/day)',
      status: 'PENDING'
    },
    {
      id: 'req-2',
      farmerName: 'K. Subba Rao (Chilli Cultivator)',
      location: 'Pedakakani, Guntur (18 km away)',
      serviceNeeded: 'Tractor Deep Furrowing & Bed Making',
      dates: 'Sep 25 - 2 Days',
      proposedPay: '₹3,600 total',
      status: 'PENDING'
    }
  ]);

  const handleAcceptRequest = (id) => {
    setIncomingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
  };

  const handleDeclineRequest = (id) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        {/* Worker Top Banner */}
        <div style={styles.workerBanner}>
          <div>
            <div className="badge badge-yellow" style={{ marginBottom: '8px' }}>
              <Wrench size={14} /> CERTIFIED OPERATOR & TOOL OWNER
            </div>
            <h1 style={styles.welcomeHeading}>
              {profile?.name || 'Ramesh Reddy'}
            </h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              <span>Location: {profile?.location || 'Tenali, Guntur, AP'}</span>
              <span style={{ color: '#ca8a04', fontWeight: '700' }}>★ 4.9 (38 Farm Reviews)</span>
              <span style={{ color: '#16a34a', fontWeight: '700' }}>✓ 64 Jobs Completed</span>
            </div>
          </div>

          {/* Availability Switch */}
          <div style={styles.availabilityBox}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>STATUS:</span>
            <button 
              style={availability === 'available' ? styles.statusBtnActive : styles.statusBtn}
              onClick={() => setAvailability('available')}
            >
              <span style={{ color: '#16a34a' }}>●</span> Available Now
            </button>
            <button 
              style={availability === 'busy' ? styles.statusBtnActive : styles.statusBtn}
              onClick={() => setAvailability('busy')}
            >
              <span style={{ color: '#ca8a04' }}>●</span> Busy on Field
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={styles.dashboardGrid}>
          {/* Left Column: Service Setup & Machinery Inventory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Service Profile Configuration */}
            <div className="card">
              <h3 style={styles.cardTitle}>⚙️ Service Configuration</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                How you provide service to farmers & companies.
              </p>

              <div className="form-group">
                <label className="form-label">Service Provision Mode</label>
                <select 
                  className="form-select"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                >
                  <option value="skill_and_tool">🛠️ Skill + Equipment (Operator with Machine)</option>
                  <option value="skill_only">👤 Skill Only (Driver/Technician without machine)</option>
                  <option value="tool_only">🚜 Tool Only (Equipment Rental without operator)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Daily Rate (₹)</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hourly Rate (₹)</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* My Equipment & Tools Registry */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={styles.cardTitle}>🚜 My Tools & Machines</h3>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={onOpenEquipmentModal}
                >
                  + Add Tool
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={styles.machineItem}>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: '700' }}>Mahindra 575 DI (47 HP)</h5>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Model: 2023 • With Dual Clutch & Rotavator</span>
                  </div>
                  <span className="badge badge-green">Active on Rental</span>
                </div>

                <div style={styles.machineItem}>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: '700' }}>Shaktiman 7ft Rotavator</h5>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>54 Boron Steel Blades • Prime Condition</span>
                  </div>
                  <span className="badge badge-green">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Incoming Booking Requests & Direct Inquiries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Incoming Requests */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Direct Field Booking Inquiries</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Farmers requesting your machinery or operator service.</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {incomingRequests.map((req) => (
                  <div key={req.id} style={styles.requestCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge badge-green" style={{ marginBottom: '4px' }}>{req.dates}</span>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{req.serviceNeeded}</h4>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                          From <strong>{req.farmerName}</strong> • {req.location}
                        </div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>
                        {req.proposedPay}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onOpenMessage(req.farmerName)}
                      >
                        <MessageSquare size={14} /> Message Farmer
                      </button>

                      {req.status === 'ACCEPTED' ? (
                        <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
                          ✓ Booking Confirmed
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeclineRequest(req.id)}
                          >
                            Decline
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAcceptRequest(req.id)}
                          >
                            Accept Job
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Open Requirements Nearby */}
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Open Farm Requirements in Your Radius</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Apply with your rates and machine availability.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {INITIAL_JOBS.slice(0, 2).map((job) => (
                  <div key={job.id} style={styles.jobFeedRow}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-green">{job.crop}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{job.location}</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{job.title}</h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#15803d' }}>
                        ₹{job.budget.toLocaleString()}
                      </div>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => onOpenMessage(job.posterName)}
                      >
                        Send Quotation
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
  workerBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    backgroundColor: '#ffffff',
    padding: '24px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '20px',
  },
  welcomeHeading: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
  },
  availabilityBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    padding: '6px 12px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
  },
  statusBtn: {
    padding: '6px 12px',
    border: 'none',
    background: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusBtnActive: {
    padding: '6px 12px',
    border: 'none',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    gap: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  machineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  requestCard: {
    padding: '18px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  jobFeedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '12px',
  }
};
