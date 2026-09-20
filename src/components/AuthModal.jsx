import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sprout, Building2, Wrench, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', initialRole = 'farmer' }) {
  const { login, signUp, loginAsDemo } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'farmer' | 'company' | 'skilled_worker'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmOrCompanyDetails, setFarmOrCompanyDetails] = useState('');
  
  // Status messages
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const roleMeta = {
    farmer: {
      title: 'Farmer Portal',
      emoji: '🌾',
      tagline: 'Hire skilled operators, rent machinery, and source inputs for your land.',
      detailPlaceholder: 'Farm Size & Location (e.g. 10 Acres, Guntur)',
      color: '#15803d'
    },
    company: {
      title: 'Agri Company Portal',
      emoji: '🏢',
      tagline: 'Recruit field teams, manage seasonal contracts, and supply farm inputs.',
      detailPlaceholder: 'Company Name & GST/FCO Reg. Number',
      color: '#0284c7'
    },
    skilled_worker: {
      title: 'Skilled Labour + Tools',
      emoji: '🛠️',
      tagline: 'Showcase your machinery, operator skills, and receive nearby bookings.',
      detailPlaceholder: 'Skills & Tools (e.g. Tractor 50HP, Rotavator, Drone Pilot)',
      color: '#ca8a04'
    }
  };

  const currentRoleMeta = roleMeta[selectedRole];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password, selectedRole);
        if (result.success) {
          onClose();
        } else {
          setErrorMessage(result.error || 'Invalid credentials. Please verify your email & password.');
        }
      } else {
        // Sign up
        const result = await signUp({
          email,
          password,
          role: selectedRole,
          fullName: fullName || email.split('@')[0],
          metadata: {
            phone,
            role_details: farmOrCompanyDetails
          }
        });

        if (result.success) {
          if (result.requiresEmailConfirmation) {
            setSuccessMessage('Account registered! Please check your email and verify your address before logging in.');
            // Pre-fill email and switch to login
            setTimeout(() => {
              setMode('login');
            }, 3000);
          } else {
            onClose();
          }
        } else {
          setErrorMessage(result.error || 'Failed to create account.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = () => {
    loginAsDemo(selectedRole);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={styles.closeBtn}
        >
          <X size={20} />
        </button>

        {/* Role Selector Header */}
        <div style={styles.roleTabs}>
          <button
            style={selectedRole === 'farmer' ? styles.roleTabActive : styles.roleTab}
            onClick={() => { setSelectedRole('farmer'); setErrorMessage(''); }}
          >
            <span>🌾</span> Farmer
          </button>
          <button
            style={selectedRole === 'company' ? styles.roleTabActive : styles.roleTab}
            onClick={() => { setSelectedRole('company'); setErrorMessage(''); }}
          >
            <span>🏢</span> Company
          </button>
          <button
            style={selectedRole === 'skilled_worker' ? styles.roleTabActive : styles.roleTab}
            onClick={() => { setSelectedRole('skilled_worker'); setErrorMessage(''); }}
          >
            <span>🛠️</span> Labour + Tools
          </button>
        </div>

        {/* Header Title */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '24px' }}>{currentRoleMeta.emoji}</span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
              {mode === 'login' ? `Sign In to ${currentRoleMeta.title}` : `Register ${currentRoleMeta.title}`}
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {currentRoleMeta.tagline}
          </p>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div style={styles.successBox}>
            <CheckCircle size={18} color="#16a34a" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} color="#dc2626" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name / Authorized Rep</label>
                <input 
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Ramesh Reddy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (WhatsApp notifications)</label>
                <input 
                  type="tel"
                  className="form-input"
                  placeholder="+91 98480 XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Agricultural Profile Summary</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder={currentRoleMeta.detailPlaceholder}
                  value={farmOrCompanyDetails}
                  onChange={(e) => setFarmOrCompanyDetails(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email"
              required
              className="form-input"
              placeholder="farmer@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? `Sign In as ${currentRoleMeta.title}` : `Create ${currentRoleMeta.title} Account`}
          </button>
        </form>

        {/* 1-Click Instant Demo Testing Button */}
        <div style={styles.demoSection}>
          <div style={styles.divider}>
            <span>OR TEST INSTANTLY</span>
          </div>
          <button 
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={handleInstantDemoLogin}
          >
            <span>{currentRoleMeta.emoji} 1-Click Demo Login ({currentRoleMeta.title})</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Footer Toggle */}
        <div style={styles.modalFooter}>
          {mode === 'login' ? (
            <p>
              Don't have a {currentRoleMeta.title} account?{' '}
              <button 
                type="button"
                style={styles.textLink}
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
              >
                Sign Up Here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button 
                type="button"
                style={styles.textLink}
                onClick={() => { setMode('login'); setErrorMessage(''); }}
              >
                Log In Here
              </button>
            </p>
          )}
        </div>
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
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#64748b',
  },
  roleTabs: {
    display: 'flex',
    gap: '6px',
    padding: '4px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  roleTab: {
    flex: 1,
    padding: '8px 6px',
    border: 'none',
    background: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  roleTabActive: {
    flex: 1,
    padding: '8px 6px',
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
    justifyContent: 'center',
    gap: '4px',
  },
  modalHeader: {
    marginBottom: '18px',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    color: '#065f46',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#991b1b',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  demoSection: {
    marginTop: '20px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '16px 0',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  modalFooter: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
  },
  textLink: {
    background: 'none',
    border: 'none',
    color: '#15803d',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  }
};
