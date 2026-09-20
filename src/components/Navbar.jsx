import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Briefcase, 
  Wrench, 
  Building2, 
  Menu, 
  X, 
  LogOut, 
  User, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ onOpenAuth, activeTab, setActiveTab }) {
  const { user, profile, currentRole, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'farmer':
        return { label: 'Farmer Portal', emoji: '🌾', color: 'badge-green' };
      case 'company':
        return { label: 'Company Portal', emoji: '🏢', color: 'badge-blue' };
      case 'skilled_worker':
        return { label: 'Skilled Labour + Tools', emoji: '🛠️', color: 'badge-yellow' };
      default:
        return { label: 'Agricultural Member', emoji: '🌱', color: 'badge-slate' };
    }
  };

  const currentBadge = getRoleBadge(currentRole);

  const handlePortalClick = (role) => {
    if (isAuthenticated && currentRole === role) {
      setActiveTab('dashboard');
    } else if (isAuthenticated) {
      // Authenticated with different role, still allow visiting dashboard
      setActiveTab('dashboard');
    } else {
      onOpenAuth('login', role);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Identity */}
        <div 
          style={styles.brandGroup} 
          onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
        >
          <div style={styles.logoIcon}>
            <Sprout size={24} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={styles.brandTitle}>
              YUKTI <span style={styles.brandDot}>•</span>
            </div>
            <div style={styles.brandTagline}>AGRI-TECH PLATFORM</div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={styles.desktopNav}>
          <button 
            style={activeTab === 'landing' ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveTab('landing')}
          >
            Home
          </button>
          <button 
            style={activeTab === 'jobs' ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveTab('jobs')}
          >
            Find Work & Jobs
          </button>
          <button 
            style={activeTab === 'marketplace' ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveTab('marketplace')}
          >
            Tools & Equipment
          </button>
          
          {/* User's Portal Link */}
          {isAuthenticated && (
            <button 
              style={activeTab === 'dashboard' ? styles.navLinkActive : styles.navLink}
              onClick={() => setActiveTab('dashboard')}
            >
              My Portal ({currentBadge.emoji})
            </button>
          )}
        </nav>

        {/* Right Side Auth Controls */}
        <div style={styles.rightControls}>
          {isAuthenticated ? (
            <div style={styles.userControls}>
              {/* Active Role Tag */}
              <div 
                style={styles.roleTag}
                onClick={() => setActiveTab('dashboard')}
                title="Open your portal dashboard"
              >
                <span>{currentBadge.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>{currentBadge.label}</span>
              </div>

              {/* User Name */}
              <div style={styles.userGreeting}>
                <span style={styles.userName}>
                  {profile?.name || profile?.full_name || user?.email?.split('@')[0]}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                className="btn btn-sm btn-secondary"
                onClick={logout}
                title="Sign out of account"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={styles.guestControls}>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => onOpenAuth('login', 'farmer')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => onOpenAuth('signup', 'farmer')}
              >
                Join Platform
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            style={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer}>
          <div style={styles.mobileLinks}>
            <button 
              style={activeTab === 'landing' ? styles.mobileLinkActive : styles.mobileLink}
              onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
            >
              Home
            </button>
            <button 
              style={activeTab === 'jobs' ? styles.mobileLinkActive : styles.mobileLink}
              onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
            >
              Find Work & Jobs
            </button>
            <button 
              style={activeTab === 'marketplace' ? styles.mobileLinkActive : styles.mobileLink}
              onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
            >
              Tools & Equipment
            </button>

            {isAuthenticated ? (
              <>
                <button 
                  style={activeTab === 'dashboard' ? styles.mobileLinkActive : styles.mobileLink}
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                >
                  My Portal ({currentBadge.label})
                </button>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                    Signed in as <strong>{profile?.name || user?.email}</strong>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    style={{ width: '100%' }}
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Choose Your Portal
                </div>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => handlePortalClick('farmer')}
                >
                  🌾 Farmer Portal
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => handlePortalClick('company')}
                >
                  🏢 Company Portal
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => handlePortalClick('skilled_worker')}
                >
                  🛠️ Skilled Labour + Tools
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoIcon: {
    width: '42px',
    height: '42px',
    backgroundColor: '#15803d',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
  },
  brandTitle: {
    fontSize: '20px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    lineHeight: '1.1',
  },
  brandDot: {
    color: '#15803d',
  },
  brandTagline: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '1px',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    background: '#f0fdf4',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#15803d',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  roleTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#0f172a',
  },
  userGreeting: {
    display: 'none',
    fontSize: '13px',
    color: '#475569',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userName: {
    fontWeight: '600',
  },
  guestControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    padding: '8px',
    color: '#0f172a',
    cursor: 'pointer',
  },
  mobileDrawer: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 0 20px',
  },
  mobileLinks: {
    display: 'flex',
    flexDirection: 'column',
  },
  mobileLink: {
    background: 'none',
    border: 'none',
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
  },
  mobileLinkActive: {
    background: '#f0fdf4',
    border: 'none',
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: '15px',
    fontWeight: '700',
    color: '#15803d',
    cursor: 'pointer',
  }
};
