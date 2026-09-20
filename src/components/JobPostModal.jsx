import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

export default function JobPostModal({ isOpen, onClose, onJobCreated }) {
  const { user, profile, currentRole } = useAuth();
  
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState('Paddy');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(profile?.location || 'Guntur, AP');
  const [skills, setSkills] = useState('Tractor Operator, Rotavator');
  const [equipment, setEquipment] = useState('Tractor 45HP+');
  const [workersNeeded, setWorkersNeeded] = useState(1);
  const [durationDays, setDurationDays] = useState(2);
  const [budget, setBudget] = useState(4000);
  const [rateType, setRateType] = useState('per_day');
  const [urgency, setUrgency] = useState('medium');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await dbService.createJob({
        poster_id: user?.id,
        poster_name: profile?.name || profile?.full_name || user?.email?.split('@')[0],
        poster_role: currentRole || 'farmer',
        title,
        crop,
        description,
        location,
        required_skills: skills,
        required_equipment: equipment,
        workers_needed: Number(workersNeeded),
        duration_days: Number(durationDays),
        budget: Number(budget),
        rate_type: rateType,
        urgency
      });

      if (onJobCreated) {
        onJobCreated(created);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to create job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close dialog">
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
          Publish Agricultural Requirement
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Broadcast your need to verified machinery owners and operators within your district.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle2 size={48} color="#15803d" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
              Requirement Published Successfully!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Nearby operators have been alerted on their dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Requirement Title</label>
              <input 
                type="text"
                required
                className="form-input"
                placeholder="e.g. Need 50HP Tractor with Rotavator for 6 Acres Paddy Prep"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Target Crop</label>
                <select className="form-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
                  <option value="Paddy">Paddy (Wetland/Dry)</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Pulses / Grams">Pulses / Grams</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Horticulture">Horticulture</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Village</label>
                <input 
                  type="text"
                  required
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Description & Soil Conditions</label>
              <textarea 
                rows={3}
                required
                className="form-textarea"
                placeholder="Specify field status, moisture, rocks, or chemical requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Skills Needed (comma-separated)</label>
                <input 
                  type="text"
                  className="form-input"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Machinery Required</label>
                <input 
                  type="text"
                  className="form-input"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Workers / Operators</label>
                <input 
                  type="number"
                  min={1}
                  className="form-input"
                  value={workersNeeded}
                  onChange={(e) => setWorkersNeeded(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Days)</label>
                <input 
                  type="number"
                  min={1}
                  className="form-input"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="medium">Standard</option>
                  <option value="high">High (48 hrs)</option>
                  <option value="emergency">⚡ Emergency (Today)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Offered Budget (₹)</label>
                <input 
                  type="number"
                  required
                  className="form-input"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rate Terms</label>
                <select className="form-select" value={rateType} onChange={(e) => setRateType(e.target.value)}>
                  <option value="per_day">Per Day</option>
                  <option value="per_acre">Per Acre</option>
                  <option value="total">Total Fixed</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '8px' }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Requirement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  closeBtn: {
    position: 'absolute',
    top: '18px',
    right: '18px',
    background: 'none',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    color: '#64748b',
  }
};
