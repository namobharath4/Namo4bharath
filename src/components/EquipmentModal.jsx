import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EquipmentModal({ isOpen, onClose, onEquipmentAdded }) {
  const { profile } = useAuth();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tractor');
  const [specs, setSpecs] = useState('');
  const [dailyRate, setDailyRate] = useState(2000);
  const [weeklyRate, setWeeklyRate] = useState(12000);
  const [operatorIncluded, setOperatorIncluded] = useState(true);
  const [location, setLocation] = useState(profile?.location || 'Guntur, AP');
  const [condition, setCondition] = useState('Excellent');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEq = {
      id: 'eq-' + Date.now(),
      name,
      category,
      specs,
      dailyRate: Number(dailyRate),
      weeklyRate: Number(weeklyRate),
      operatorIncluded,
      location,
      condition,
      ownerName: profile?.name || 'Verified Member',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=500&auto=format&fit=crop&q=80',
      isAvailable: true
    };

    if (onEquipmentAdded) {
      onEquipmentAdded(newEq);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
          List Agricultural Equipment for Hire
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Earn seasonal rental income from your idle machinery.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle2 size={48} color="#15803d" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
              Machinery Listed on Marketplace!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Farmers and companies can now request bookings.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Equipment Model & Make</label>
              <input 
                type="text"
                required
                className="form-input"
                placeholder="e.g. John Deere 5310 55HP 4WD"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Combine Harvester</option>
                  <option value="Drone Sprayer">Agricultural Drone</option>
                  <option value="Rotavator">Rotavator / Cultivator</option>
                  <option value="Pump">Solar / Submersible Pump</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition</label>
                <select className="form-select" value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="Excellent">Prime / New (2023-24)</option>
                  <option value="Good">Good Working Condition</option>
                  <option value="Fair">Fair / Regular Service</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Specs & Implements Attached</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. 55 HP Turbo, Dual Clutch, Power Steering, includes 7ft Rotavator"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Daily Rental Rate (₹)</label>
                <input 
                  type="number"
                  required
                  className="form-input"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weekly Rate (₹, optional)</label>
                <input 
                  type="number"
                  className="form-input"
                  value={weeklyRate}
                  onChange={(e) => setWeeklyRate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Hub</label>
              <input 
                type="text"
                required
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div style={{ margin: '14px 0 20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={operatorIncluded}
                  onChange={(e) => setOperatorIncluded(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                Provide Experienced Operator/Driver with Machine
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Publish Machine on Marketplace
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
