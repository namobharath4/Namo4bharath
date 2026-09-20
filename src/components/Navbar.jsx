import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Briefcase, 
  Wrench, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Bell, 
  ChevronDown 
} from 'lucide-react';

export default function Navbar({ onOpenAuth, activeTab, setActiveTab }) {
  const { user, profile, currentRole, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'farmer':
        return { label: 'Farmer', icon: Sprout, color: 'badge-green', emoji: '🌾' };
      case 'company':
        return { label: 'Agri Company', icon: Building2, color: 'badge-blue', emoji: '🏢' };
      case 'skilled_worker':
        return { label: 'Skilled Labour + Tools', icon: Wrench, color: 'badge-yellow', emoji: '🛠️' };
      case 'admin':
        return { label: 'Admin Desk', icon: ShieldCheck, color: 'badge-slate', emoji: '⚖️' };
      default:
        return { label: 'Guest', icon: User, color: 'badge-slate', emoji: '👤' };
    }
  };

  const currentBadge = getRoleBadge(currentRole);

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <div style={styles.brandGroup} onClick={() => setActiveTab('landing')}>
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

        {/* Desktop Nav Links */}
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
          {user && (
            <button 
              style={activeTab === 'dashboard' ? styles.navLinkActive : styles.navLink}
              onClick={() => setActiveTab('dashboard')}
            >
              My Dashboard
            </button>
          )}
          <button 
            style={activeTab === 'admin' ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveTab('admin')}
          >
            Official Admin
          </button>
        </nav>

        {/* Right Side Auth / Role Controls */}
        <div style={styles.rightControls}>
          {user ? (
            <div style={styles.userControls}>
              {/* Role Badge Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  style={styles.roleButton}
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                >
                  <span style={{ fontSize: '15px' }}>{currentBadge.emoji}</span>
                  <span style={{ fontWeight: 600 }}>{currentBadge.label}</span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {roleDropdownOpen && (
                  <div style={styles.dropdownMenu}>
                    <div style={styles.dropdownHeader}>Switch Active Role View:</div>
                    <button 
                      style={styles.dropdownItem}
                      onClick={() => { loginAsDemo('farmer'); setRoleDropdownOpen(false); setActiveTab('dashboard'); }}
                    >
                      <span>🌾 Farmer Portal</span>
                    </button>
                    <button 
                      style={styles.dropdownItem}
                      onClick={() => { loginAsDemo('company'); setRoleDropdownOpen(false); setActiveTab('dashboard'); }}
                    >
                      <span>🏢 Agri Company Portal</span>
                    </button>
                    <button 
                      style={styles.dropdownItem}
                      onClick={() => { loginAsDemo('skilled_worker'); setRoleDropdownOpen(false); setActiveTab('dashboard'); }}
                    >
                      <span>🛠️ Skilled Labour + Tools</span>
                    </button>
                    <button 
                      style={styles.dropdownItem}
                      onClick={() => { loginAsDemo('admin'); setRoleDropdownOpen(false); setActiveTab('admin'); }}
                    >
                      <span>⚖️ Official Regulatory Desk</span>
                    </button>
                  </div>
                )}
              </div>

              {/* User Greeting & Logout */}
              <div style={styles.userGreeting}>
                <span style={styles.userName}>{profile?.name || user?.email?.split('@')[0]}</span>
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={logout}
                title="Sign Out"
                style={{ padding: '8px 12px' }}
              >
                <LogOut size={16} />
                <span className="hidden-mobile">Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={styles.authButtons}>
              <button 
                className="btn btn-secondary"
                onClick={() => onOpenAuth('login', 'farmer')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => onOpenAuth('signup', 'farmer')}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            style={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer}>
          <button 
            style={styles.mobileNavLink}
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
          >
            Home
          </button>
          <button 
            style={styles.mobileNavLink}
            onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
          >
            Find Work & Jobs
          </button>
          <button 
            style={styles.mobileNavLink}
            onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
          >
            Tools & Equipment
          </button>
          {user && (
            <button 
              style={styles.mobileNavLink}
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            >
              My Dashboard
            </button>
          )}
          <button 
            style={styles.mobileNavLink}
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
          >
            Official Admin Desk
          </button>

          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => { onOpenAuth('login', 'farmer'); setMobileMenuOpen(false); }}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => { onOpenAuth('signup', 'farmer'); setMobileMenuOpen(false); }}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#15803d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(21, 128, 61, 0.3)',
  },
  brandTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    lineHeight: 1,
  },
  brandDot: {
    color: '#22c55e',
  },
  brandTagline: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#15803d',
    letterSpacing: '1px',
    marginTop: '3px',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    background: '#dcfce7',
    border: 'none',
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#166534',
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
    gap: '12px',
  },
  roleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    width: '230px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
    padding: '8px',
    zIndex: 200,
  },
  dropdownHeader: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    padding: '6px 10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dropdownItem: {
    width: '100%',
    textAlign: 'left',
    padding: '8px 10px',
    borderRadius: '6px',
    border: 'none',
    background: 'none',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.15s',
  },
  userGreeting: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    color: '#334155',
  },
  mobileDrawer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 20px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    padding: '12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#334155',
    textAlign: 'left',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
  }
};
