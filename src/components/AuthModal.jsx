import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../supabaseClient';
import { X, Sprout, Building2, Wrench, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', initialRole = 'farmer' }) {
  const { login, signUp } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'farmer' | 'company' | 'skilled_worker'

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Guntur, Andhra Pradesh');

  // Role-specific fields
  const [farmName, setFarmName] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [skills, setSkills] = useState('');
  const [toolsOwned, setToolsOwned] = useState('');
  const [dailyRate, setDailyRate] = useState('');

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSelectedRole(initialRole);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const roleMeta = {
    farmer: {
      title: 'Farmer Portal',
      emoji: '🌾',
      tagline: 'Find skilled workers, machinery, services and agricultural support.',
      color: '#15803d'
    },
    company: {
      title: 'Agri Company Portal',
      emoji: '🏢',
      tagline: 'Find agricultural talent, workers, projects and opportunities.',
      color: '#0284c7'
    },
    skilled_worker: {
      title: 'Skilled Labour + Tools',
      emoji: '🛠️',
      tagline: 'Show your skills, services, experience and equipment.',
      color: '#ca8a04'
    }
  };

  const currentRoleMeta = roleMeta[selectedRole] || roleMeta.farmer;

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
          setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
        }
      } else {
        // Build role-specific metadata
        let metadata = {
          phone,
          location,
          role: selectedRole
        };

        if (selectedRole === 'farmer') {
          metadata.farm_name = farmName;
          metadata.farm_size_acres = farmSizeAcres ? Number(farmSizeAcres) : null;
          metadata.primary_crops = primaryCrops.split(',').map(s => s.trim()).filter(Boolean);
        } else if (selectedRole === 'company') {
          metadata.company_name = companyName || fullName;
          metadata.registration_number = registrationNumber;
          metadata.license_number = licenseNumber;
        } else if (selectedRole === 'skilled_worker') {
          metadata.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
          metadata.tools_owned = toolsOwned.split(',').map(s => s.trim()).filter(Boolean);
          metadata.daily_rate = dailyRate ? Number(dailyRate) : null;
        }

        const result = await signUp({
          email,
          password,
          role: selectedRole,
          fullName: selectedRole === 'company' ? (companyName || fullName) : fullName,
          metadata
        });

        if (result.success) {
          if (result.requiresEmailConfirmation) {
            setSuccessMessage('Your account has been created. Please check your email and verify your address before logging in.');
            setTimeout(() => {
              setMode('login');
              setSuccessMessage('Account registered. Please enter your password to sign in once verified.');
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

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during Google sign in.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close dialog">
          <X size={20} />
        </button>

        {/* Portal Role Selector */}
        <div style={styles.roleTabs}>
          <button
            type="button"
            style={selectedRole === 'farmer' ? styles.roleTabActiveFarmer : styles.roleTab}
            onClick={() => { setSelectedRole('farmer'); setErrorMessage(''); }}
          >
            <span>🌾</span> Farmer
          </button>
          <button
            type="button"
            style={selectedRole === 'company' ? styles.roleTabActiveCompany : styles.roleTab}
            onClick={() => { setSelectedRole('company'); setErrorMessage(''); }}
          >
            <span>🏢</span> Company
          </button>
          <button
            type="button"
            style={selectedRole === 'skilled_worker' ? styles.roleTabActiveWorker : styles.roleTab}
            onClick={() => { setSelectedRole('skilled_worker'); setErrorMessage(''); }}
          >
            <span>🛠️</span> Skilled + Tools
          </button>
        </div>

        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>{currentRoleMeta.emoji}</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
            {mode === 'login' ? `Sign In to ${currentRoleMeta.title}` : `Join as ${currentRoleMeta.title}`}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {currentRoleMeta.tagline}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={styles.modeTabs}>
          <button 
            type="button"
            style={mode === 'login' ? styles.modeTabActive : styles.modeTab}
            onClick={() => { setMode('login'); setErrorMessage(''); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            style={mode === 'signup' ? styles.modeTabActive : styles.modeTab}
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Notifications / Alerts */}
        {errorMessage && (
          <div style={styles.errorBanner} role="alert">
            <AlertCircle size={16} color="#dc2626" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={styles.successBanner} role="status">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Sign Up Details */}
          {mode === 'signup' && (
            <>
              {selectedRole === 'company' ? (
                <div className="form-group">
                  <label className="form-label">Company / Entity Name</label>
                  <input 
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Coromandel Agritech Solutions Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ramesh Reddy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel"
                    className="form-input"
                    placeholder="+91 98480 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">District / Location</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g. Guntur, AP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Specific Registration Fields */}
              {selectedRole === 'farmer' && (
                <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#15803d', marginBottom: '8px' }}>
                    🌾 Farm Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Farm Name</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="e.g. Annapurna Farm"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Holding Size (Acres)</label>
                      <input 
                        type="number"
                        step="0.5"
                        className="form-input"
                        placeholder="e.g. 8.5"
                        value={farmSizeAcres}
                        onChange={(e) => setFarmSizeAcres(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Primary Crops (comma-separated)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g. Paddy, Chilli, Cotton"
                      value={primaryCrops}
                      onChange={(e) => setPrimaryCrops(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'company' && (
                <div style={{ padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0284c7', marginBottom: '8px' }}>
                    🏢 Corporate / Compliance Information
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>CIN / Registration #</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="e.g. CIN-U01100AP2019"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>FCO / License #</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="e.g. FCO/AP/GNT/2023"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'skilled_worker' && (
                <div style={{ padding: '12px', backgroundColor: '#fefce8', borderRadius: '8px', border: '1px solid #fef08a' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#ca8a04', marginBottom: '8px' }}>
                    🛠️ Skills & Machinery Information
                  </div>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Skills (comma-separated)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tractor Operator, Rotavator, Drone Pilot"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Tools / Machinery Owned</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="e.g. Mahindra 575 DI, 7ft Rotavator"
                        value={toolsOwned}
                        onChange={(e) => setToolsOwned(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Daily Rate (₹)</label>
                      <input 
                        type="number"
                        className="form-input"
                        placeholder="e.g. 1800"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email & Password */}
          <div className="form-group">
            <label className="form-label">Account Email</label>
            <input 
              type="email"
              required
              className="form-input"
              placeholder="your.email@provider.com"
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ 
              width: '100%', 
              backgroundColor: currentRoleMeta.color,
              borderColor: currentRoleMeta.color,
              marginTop: '8px'
            }}
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? `Sign In to ${currentRoleMeta.title}` : `Create ${currentRoleMeta.title} Account`
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={styles.googleButton}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={styles.googleIcon}>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
  },
  roleTabs: {
    display: 'flex',
    gap: '6px',
    backgroundColor: '#f1f5f9',
    padding: '4px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  roleTab: {
    flex: 1,
    padding: '8px 10px',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  roleTabActiveFarmer: {
    flex: 1,
    padding: '8px 10px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#15803d',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  roleTabActiveCompany: {
    flex: 1,
    padding: '8px 10px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#0284c7',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  roleTabActiveWorker: {
    flex: 1,
    padding: '8px 10px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#ca8a04',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  modeTabs: {
    display: 'flex',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '16px',
  },
  modeTab: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  },
  modeTabActive: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    fontWeight: '700',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#0f172a',
    borderBottom: '2px solid #15803d',
    marginBottom: '-2px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: '8px',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    borderRadius: '8px',
    fontSize: '13px',
    border: '1px solid #bbf7d0',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '12px 0 4px',
    color: '#6b7280',
    fontSize: '13px',
  },
  dividerLine: {
    flex: 1,
    borderBottom: '1px solid #e2e8f0',
  },
  dividerText: {
    padding: '0 10px',
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  googleIcon: {
    marginRight: '8px',
    flexShrink: 0,
  }
};
