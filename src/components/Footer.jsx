import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenAuth, onNavigateTab }) {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.content}>
        {/* Brand & Purpose */}
        <div style={{ maxWidth: '360px' }}>
          <div style={styles.brandRow}>
            <div style={styles.logoBadge}>
              <Sprout size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              YUKTI AGRI-TECH
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginTop: '12px' }}>
            Empowering agricultural productivity by linking farmers with verified machinery operators, custom hiring centers, and agro-enterprises across India.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#15803d', fontWeight: '700', marginTop: '14px' }}>
            <ShieldCheck size={16} /> ISO 9001 & Agri-Stack Aligned Architecture
          </div>
        </div>

        {/* Roles Quick Access */}
        <div>
          <h4 style={styles.heading}>Portals & Access</h4>
          <ul style={styles.linkList}>
            <li>
              <button style={styles.link} onClick={() => onOpenAuth('login', 'farmer')}>
                🌾 Farmer Dashboard & Post Work
              </button>
            </li>
            <li>
              <button style={styles.link} onClick={() => onOpenAuth('login', 'company')}>
                🏢 Agri Company Hub & Contracts
              </button>
            </li>
            <li>
              <button style={styles.link} onClick={() => onOpenAuth('login', 'skilled_worker')}>
                🛠️ Skilled Labour & Tools Registry
              </button>
            </li>
            <li>
              <button style={styles.link} onClick={() => onNavigateTab('admin')}>
                ⚖️ Official Regulatory Console
              </button>
            </li>
          </ul>
        </div>

        {/* Network & Tools */}
        <div>
          <h4 style={styles.heading}>Ecosystem</h4>
          <ul style={styles.linkList}>
            <li>
              <button style={styles.link} onClick={() => onNavigateTab('marketplace')}>
                Machinery & Implement Rental
              </button>
            </li>
            <li>
              <button style={styles.link} onClick={() => onNavigateTab('jobs')}>
                Seasonal Farm Work Postings
              </button>
            </li>
            <li>
              <button style={styles.link} onClick={() => onNavigateTab('landing')}>
                Custom Hiring Savings Guide
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Contacts */}
        <div>
          <h4 style={styles.heading}>District Agronomy Support</h4>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
            Toll Free Agri-Kisan Helpline: <br />
            <strong>1800-180-1551</strong>
          </p>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            Regional Cluster: Guntur, Andhra Pradesh
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            © {new Date().getFullYear()} YUKTI Platform. Built for Indian Agriculture.
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Powered by Supabase Auth & Row Level Security
          </span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '56px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
    gap: '36px',
    paddingBottom: '48px',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#15803d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: '13px',
    color: '#64748b',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'color 0.15s',
  },
  bottomBar: {
    borderTop: '1px solid #f1f5f9',
    padding: '20px 0',
    backgroundColor: '#f8fafc',
  }
};
