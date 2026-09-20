import React, { useState } from 'react';
import { X, CheckCircle2, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';

export default function EquipmentModal({ isOpen, onClose, onEquipmentAdded }) {
  const { user, profile } = useAuth();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tractor');
  const [specs, setSpecs] = useState('');
  const [dailyRate, setDailyRate] = useState(2000);
  const [weeklyRate, setWeeklyRate] = useState(12000);
  const [operatorIncluded, setOperatorIncluded] = useState(true);
  const [location, setLocation] = useState(profile?.location || 'Guntur, AP');
  const [condition, setCondition] = useState('Excellent');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size exceeds 10MB limit.');
        return;
      }
      setUploadError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveSelectedFile = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError('');

    try {
      const itemId = crypto.randomUUID();
      let finalImageUrl = category === 'Harvester'
        ? 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=500&auto=format&fit=crop&q=80'
        : category === 'Drone Sprayer'
        ? 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=80';

      // If user uploaded a custom equipment photo, upload to Supabase Storage "app-files"
      if (imageFile && user?.id) {
        try {
          const uploadRes = await storageService.uploadFile({
            file: imageFile,
            userId: user.id,
            featureName: 'equipment',
            itemId
          });
          finalImageUrl = uploadRes.path; // Saved in database
        } catch (uploadErr) {
          console.error('Storage upload failed:', uploadErr);
          setUploadError('Image upload failed. Saving with standard photo.');
        }
      }

      const created = await dbService.createEquipment({
        id: itemId,
        owner_id: user?.id,
        owner_name: profile?.name || profile?.full_name || user?.email?.split('@')[0],
        name,
        category,
        specs,
        daily_rate: Number(dailyRate),
        weekly_rate: weeklyRate ? Number(weeklyRate) : null,
        operator_included: operatorIncluded,
        location,
        condition,
        image_url: finalImageUrl
      });

      if (onEquipmentAdded) {
        onEquipmentAdded(created);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setImageFile(null);
        setImagePreview('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to create equipment:', err);
      setUploadError(err.message || 'Failed to save equipment listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close dialog">
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

            {/* Machinery Photo Upload (Supabase Storage "app-files") */}
            <div className="form-group">
              <label className="form-label">Machinery Photo (Optional)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="form-input"
                  style={{ padding: '8px' }}
                />
                {uploadError && (
                  <span style={{ fontSize: '12px', color: '#ef4444' }}>{uploadError}</span>
                )}
                {imagePreview && (
                  <div style={{ position: 'relative', marginTop: '6px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', maxHeight: '140px' }}>
                    <img 
                      src={imagePreview} 
                      alt="Selected machinery preview" 
                      style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                    />
                    <button
                      type="button"
                      onClick={handleRemoveSelectedFile}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                )}
              </div>
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

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Machine on Marketplace'}
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
