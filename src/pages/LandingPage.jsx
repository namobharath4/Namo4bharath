import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  MapPin, 
  ArrowRight, 
  Tractor, 
  Sparkles,
  Briefcase,
  Users,
  Clock,
  Layers,
  PhoneCall
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onOpenAuth, onNavigateTab, onSelectPortal }) {
  const { user, currentRole, isAuthenticated } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [jobs, equipment] = await Promise.all([
          dbService.getJobs({ status: 'OPEN' }),
          dbService.getEquipment()
        ]);
        setRecentJobs(jobs.slice(0, 3));
        setRecentEquipment(equipment.slice(0, 4));
      } catch (err) {
        console.warn('Live data fetch:', err.message);
      } finally {
        setLoadingData(false);
      }
    }
    loadLiveData();
  }, []);

  const handlePortalEnter = (role) => {
    if (isAuthenticated) {
      // Direct to dashboard
      onNavigateTab('dashboard');
    } else {
      // Open portal sign-in/registration
      onOpenAuth('login', role);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigateTab('jobs');
  };

  return (
    <div style={styles.landingContainer}>
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <Sparkles size={14} color="#15803d" />
            <span>Digital Agricultural Ecosystem</span>
          </div>

          <h1 style={styles.heroHeadline}>
            Connecting Agriculture, <br />
            <span style={styles.heroGradient}>People, Skills & Equipment</span>
          </h1>

          <p style={styles.heroSubtitle}>
            "One platform for farmers, companies and skilled professionals."
          </p>

          {/* Quick Search & Exploration Bar */}
          <form onSubmit={handleSearchSubmit} style={styles.searchBar}>
            <div style={styles.searchField}>
              <Search size={20} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search tractor operators, combine harvesters, drone pilots, acreage prep..." 
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ whiteSpace: 'nowrap' }}
            >
              Search Platform
            </button>
          </form>
        </div>
      </section>

      {/* 2. CHOOSE YOUR PORTAL (MANDATED CORE SECTION) */}
      <section style={styles.portalSection} id="choose-portal">
        <div className="container">
          <div style={styles.sectionHeaderCenter}>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>THREE DEDICATED WORKSPACES</span>
            <h2 style={styles.sectionTitle}>CHOOSE YOUR PORTAL</h2>
            <p style={styles.sectionSubtitle}>
              Tailored tools, custom verification, and role-specific workflows for agricultural stakeholders.
            </p>
          </div>

          <div style={styles.portalGrid}>
            {/* PORTAL 1: FARMER */}
            <div style={styles.portalCardFarmer}>
              <div style={styles.portalCardHeader}>
                <div style={styles.portalEmoji}>🌾</div>
                <span className="badge badge-green">LANDOWNER & PRODUCER</span>
              </div>
              <h3 style={styles.portalTitle}>FARMER</h3>
              <p style={styles.portalDesc}>
                Find skilled workers, machinery, services and agricultural support.
              </p>
              <ul style={styles.featureList}>
                <li><CheckCircle2 size={16} color="#15803d" /> Post acreage requirements in seconds</li>
                <li><CheckCircle2 size={16} color="#15803d" /> Rent tractors, harvesters & rotavators</li>
                <li><CheckCircle2 size={16} color="#15803d" /> Direct messaging with verified operators</li>
              </ul>
              <button 
                className="btn btn-primary btn-lg"
                style={styles.portalActionBtn}
                onClick={() => handlePortalEnter('farmer')}
              >
                Enter Farmer Portal <ArrowRight size={18} />
              </button>
            </div>

            {/* PORTAL 2: COMPANY */}
            <div style={styles.portalCardCompany}>
              <div style={styles.portalCardHeader}>
                <div style={styles.portalEmoji}>🏢</div>
                <span className="badge badge-blue">ENTERPRISE & DISTRIBUTOR</span>
              </div>
              <h3 style={styles.portalTitle}>COMPANY</h3>
              <p style={styles.portalDesc}>
                Find agricultural talent, workers, projects and opportunities.
              </p>
              <ul style={styles.featureList}>
                <li><CheckCircle2 size={16} color="#0284c7" /> Post seasonal cluster campaigns & contracts</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Triage certified sprayers and field operators</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Verified input supply & corporate contracts</li>
              </ul>
              <button 
                className="btn btn-primary btn-lg"
                style={{ ...styles.portalActionBtn, backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                onClick={() => handlePortalEnter('company')}
              >
                Enter Company Portal <ArrowRight size={18} />
              </button>
            </div>

            {/* PORTAL 3: SKILLED LABOUR + TOOLS */}
            <div style={styles.portalCardWorker}>
              <div style={styles.portalCardHeader}>
                <div style={styles.portalEmoji}>🛠️</div>
                <span className="badge badge-yellow">SKILLS & EQUIPMENT</span>
              </div>
              <h3 style={styles.portalTitle}>SKILLED LABOUR + TOOLS</h3>
              <p style={styles.portalDesc}>
                Show your skills, services, experience and equipment.
              </p>
              <ul style={styles.featureList}>
                <li><CheckCircle2 size={16} color="#ca8a04" /> Showcase both operator skills & machine fleet</li>
                <li><CheckCircle2 size={16} color="#ca8a04" /> Set transparent daily, hourly, or acre rates</li>
                <li><CheckCircle2 size={16} color="#ca8a04" /> Direct bookings with guaranteed job alerts</li>
              </ul>
              <button 
                className="btn btn-primary btn-lg"
                style={{ ...styles.portalActionBtn, backgroundColor: '#ca8a04', borderColor: '#ca8a04' }}
                onClick={() => handlePortalEnter('skilled_worker')}
              >
                Enter Skilled Portal <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW THE PLATFORM WORKS */}
      <section style={styles.stepsSection}>
        <div className="container">
          <div style={styles.sectionHeaderCenter}>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>TRANSPARENT WORKFLOW</span>
            <h2 style={styles.sectionTitle}>How YUKTI Connects the Agri Ecosystem</h2>
            <p style={styles.sectionSubtitle}>
              Direct peer-to-peer engagement between farm requirements and skilled mechanical solutions.
            </p>
          </div>

          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNum}>1</div>
              <h4 style={styles.stepTitle}>Select Your Portal</h4>
              <p style={styles.stepText}>Register as a Farmer, Agricultural Company, or Skilled Worker & Equipment Owner.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNum}>2</div>
              <h4 style={styles.stepTitle}>Publish or Search</h4>
              <p style={styles.stepText}>Post farm requirements or search machinery and specialized operators in your district.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNum}>3</div>
              <h4 style={styles.stepTitle}>Direct Communication</h4>
              <p style={styles.stepText}>Negotiate terms, review equipment condition, and confirm bookings directly inside the portal.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNum}>4</div>
              <h4 style={styles.stepTitle}>Field Execution & Review</h4>
              <p style={styles.stepText}>Execute on schedule and leave genuine verified reviews based on real completed work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL LIVE JOBS FEED (DATABASE POWERED) */}
      <section style={styles.feedSection}>
        <div className="container">
          <div style={styles.feedHeader}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '6px' }}>REAL WORK POSTINGS</span>
              <h2 style={styles.sectionTitleLeft}>Active Agricultural Requirements</h2>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigateTab('jobs')}
            >
              View All Jobs <ArrowRight size={16} />
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="card" style={styles.emptyStateBox}>
              <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>No jobs available yet</h3>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '4px auto 16px' }}>
                Be the first cultivator or company to post an agricultural requirement.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => handlePortalEnter('farmer')}
              >
                Post a Farm Requirement
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="card" style={styles.jobCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-green">{job.crop || 'Agricultural'}</span>
                    <span style={styles.urgencyBadge(job.urgency)}>{(job.urgency || 'MEDIUM').toUpperCase()}</span>
                  </div>
                  <h4 style={styles.jobTitle}>{job.title}</h4>
                  <p style={styles.jobDesc}>{job.description}</p>
                  <div style={styles.jobMeta}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
                      <MapPin size={14} /> {job.location}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>
                      ₹{Number(job.budget || 0).toLocaleString()} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>/{job.rate_type || 'per_day'}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={() => handlePortalEnter('skilled_worker')}
                  >
                    Apply for Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. REAL LIVE EQUIPMENT FEED (DATABASE POWERED) */}
      <section style={styles.equipmentSection}>
        <div className="container">
          <div style={styles.feedHeader}>
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '6px' }}>AVAILABLE MACHINERY</span>
              <h2 style={styles.sectionTitleLeft}>Machinery & Implements Network</h2>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigateTab('marketplace')}
            >
              Explore All Equipment <ArrowRight size={16} />
            </button>
          </div>

          {recentEquipment.length === 0 ? (
            <div className="card" style={styles.emptyStateBox}>
              <Tractor size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>No equipment has been listed yet</h3>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '4px auto 16px' }}>
                List your tractors, combine harvesters, rotavators, or drones for rental in your local district.
              </p>
              <button 
                className="btn btn-accent"
                onClick={() => handlePortalEnter('skilled_worker')}
              >
                List Machinery for Rent
              </button>
            </div>
          ) : (
            <div className="grid-4">
              {recentEquipment.map((eq) => (
                <div key={eq.id} className="card" style={{ padding: '16px' }}>
                  <img 
                    src={eq.image_url || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80'} 
                    alt={eq.name} 
                    style={styles.eqImage}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-yellow">{eq.category}</span>
                    {eq.operator_included && (
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>With Operator</span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>{eq.name}</h4>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} /> {eq.location}
                  </div>
                  <div style={styles.eqFooter}>
                    <div>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>₹{Number(eq.daily_rate || 0).toLocaleString()}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>/day</span>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePortalEnter('farmer')}
                    >
                      Rent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. TRUST & STANDARDS */}
      <section style={styles.trustSection}>
        <div className="container" style={styles.trustContent}>
          <div style={{ maxWidth: '680px' }}>
            <div className="badge badge-green" style={{ marginBottom: '12px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              RELIABLE & VERIFIED
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
              Ground-Level Agricultural Reliability
            </h2>
            <p style={{ color: '#dcfce7', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Built specifically to serve rural acreage operations with clear terms, direct contact with machine owners, and zero intermediaries.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                style={{ backgroundColor: '#ffffff', color: '#15803d', borderColor: '#ffffff' }}
                onClick={() => handlePortalEnter('farmer')}
              >
                Join as Farmer
              </button>
              <button 
                className="btn btn-outline-primary"
                style={{ color: '#ffffff', borderColor: '#ffffff' }}
                onClick={() => handlePortalEnter('skilled_worker')}
              >
                Join as Skilled Worker / Owner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  landingContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  heroSection: {
    backgroundColor: '#ffffff',
    padding: '72px 0 60px',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
    backgroundImage: 'radial-gradient(#dcfce7 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
  heroContent: {
    maxWidth: '840px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#15803d',
    marginBottom: '20px',
  },
  heroHeadline: {
    fontSize: '44px',
    fontWeight: '900',
    lineHeight: '1.15',
    color: '#0f172a',
    letterSpacing: '-1px',
    marginBottom: '16px',
  },
  heroGradient: {
    color: '#15803d',
    display: 'inline-block',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#475569',
    fontWeight: '500',
    marginBottom: '36px',
    fontStyle: 'italic',
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    backgroundColor: '#ffffff',
    padding: '8px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
    maxWidth: '720px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  searchField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: '240px',
    padding: '0 12px',
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#0f172a',
  },
  portalSection: {
    padding: '72px 0',
    backgroundColor: '#f8fafc',
  },
  sectionHeaderCenter: {
    textAlign: 'center',
    maxWidth: '680px',
    margin: '0 auto 48px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    marginBottom: '10px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  portalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  portalCardFarmer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px 28px',
    border: '2px solid #bbf7d0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  portalCardCompany: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px 28px',
    border: '2px solid #bae6fd',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  portalCardWorker: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px 28px',
    border: '2px solid #fef08a',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  portalCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  portalEmoji: {
    fontSize: '36px',
  },
  portalTitle: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: '8px',
  },
  portalDesc: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.5',
    marginBottom: '20px',
    minHeight: '44px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '14px',
    color: '#334155',
  },
  portalActionBtn: {
    width: '100%',
    marginTop: 'auto',
  },
  stepsSection: {
    padding: '64px 0',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  stepCard: {
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  stepNum: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#15803d',
    color: '#ffffff',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    fontSize: '14px',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#0f172a',
  },
  stepText: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  feedSection: {
    padding: '64px 0',
    backgroundColor: '#f8fafc',
  },
  equipmentSection: {
    padding: '64px 0',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
  },
  feedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitleLeft: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
  },
  emptyStateBox: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    border: '1px dashed #cbd5e1',
  },
  jobCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#0f172a',
  },
  jobDesc: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  jobMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '12px',
  },
  urgencyBadge: (urgency) => ({
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: urgency === 'emergency' ? '#fee2e2' : '#f1f5f9',
    color: urgency === 'emergency' ? '#dc2626' : '#475569',
  }),
  eqImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  eqFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '10px',
  },
  trustSection: {
    backgroundColor: '#15803d',
    padding: '64px 0',
  },
  trustContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '24px',
  }
};
