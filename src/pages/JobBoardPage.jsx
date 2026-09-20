import React, { useState } from 'react';
import { Search, MapPin, Calendar, Briefcase, Filter, PlusCircle, CheckCircle } from 'lucide-react';
import { INITIAL_JOBS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function JobBoardPage({ onOpenJobModal, onOpenMessage }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState([]);

  const filteredJobs = INITIAL_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || job.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesUrgency = selectedUrgency === 'all' || job.urgency.toLowerCase() === selectedUrgency.toLowerCase();
    return matchesSearch && matchesCrop && matchesUrgency;
  });

  const handleApply = (jobId, posterName) => {
    setAppliedJobs(prev => [...prev, jobId]);
    onOpenMessage(posterName);
  };

  return (
    <div style={{ padding: '36px 0 72px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>LIVE OPPORTUNITIES</span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
              Agricultural Work & Operations Board
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              Browse farm preparation, spraying, harvest, and agro-enterprise campaigns looking for hands & machines.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={onOpenJobModal}
          >
            <PlusCircle size={20} />
            Post New Requirement
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search job title, skills, or district..." 
                className="form-input"
                style={{ border: 'none', padding: 0 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="form-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="all">All Crops</option>
              <option value="Paddy">Paddy</option>
              <option value="Chilli">Chilli</option>
              <option value="Cotton">Cotton</option>
              <option value="Multi-crop">Multi-crop (Commercial)</option>
            </select>

            <select 
              className="form-select"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="emergency">Emergency (within 24 hrs)</option>
              <option value="high">High Priority</option>
              <option value="medium">Standard Priority</option>
            </select>
          </div>
        </div>

        {/* Jobs Feed Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Briefcase size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No matching work postings found</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Try widening your search terms or filters.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="card" style={styles.jobItemCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-green">{job.crop}</span>
                    <span className="badge badge-slate">Posted by: {job.posterName}</span>
                    {job.urgency === 'emergency' && (
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                        ⚡ Emergency Need
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                    {job.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {job.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="badge badge-slate">Skill: {skill}</span>
                    ))}
                    {job.requiredEquipment?.map((eq, idx) => (
                      <span key={idx} className="badge badge-yellow">Machine: {eq}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b' }}>
                    <span><MapPin size={14} style={{ display: 'inline' }} /> {job.location}</span>
                    <span><Calendar size={14} style={{ display: 'inline' }} /> {job.durationDays} Days</span>
                    <span><Briefcase size={14} style={{ display: 'inline' }} /> {job.workersNeeded} Operator(s) needed</span>
                  </div>
                </div>

                {/* Right Pay & Action */}
                <div style={styles.jobActionBox}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#15803d' }}>
                    ₹{job.budget.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                    {job.rateType === 'per_acre' ? 'Per Acre Rate' : job.rateType === 'per_day' ? 'Per Day' : 'Total Contract'}
                  </span>

                  {appliedJobs.includes(job.id) ? (
                    <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                      <CheckCircle size={16} color="#16a34a" /> Applied
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleApply(job.id, job.posterName)}
                    >
                      Apply / Quote Rate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  jobItemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
  },
  jobActionBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: '180px',
    borderLeft: '1px solid #f1f5f9',
    paddingLeft: '24px',
  }
};
