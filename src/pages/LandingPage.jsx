import React from 'react';
import { 
  Sprout, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Star, 
  Search, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Tractor, 
  Sparkles,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { INITIAL_WORKERS, INITIAL_EQUIPMENT, INITIAL_JOBS, INITIAL_COMPANIES } from '../data/mockData';

export default function LandingPage({ onOpenAuth, onNavigateTab }) {
  return (
    <div style={styles.landingContainer}>
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroTag}>
            <Sparkles size={14} color="#15803d" />
            <span>Next-Gen Agricultural Exchange Platform</span>
          </div>

          <h1 style={styles.heroHeadline}>
            Where Agriculture Meets <br />
            <span style={styles.heroHighlight}>Skills, People & Tools</span>
          </h1>

          <p style={styles.heroSubtitle}>
            Connect farmers, agricultural companies, and skilled machinery operators on one unified platform.
            Rent high-power equipment, hire verified labour, or scale your agro-business operations with confidence.
          </p>

          {/* Quick Search Bar */}
          <div style={styles.searchBar}>
            <div style={styles.searchField}>
              <Search size={18} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search e.g. Tractor Operator, Harvester, Drone Sprayer, Guntur..." 
                style={styles.searchInput}
                onClick={() => onNavigateTab('jobs')}
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigateTab('jobs')}
              style={{ whiteSpace: 'nowrap' }}
            >
              Explore Network
            </button>
          </div>
        </div>
      </section>

      {/* 2. THREE ROLE DOORS (CRITICAL USER REQUEST REQUIREMENT) */}
      <section style={styles.roleDoorsSection}>
        <div className="container">
          <div style={styles.sectionHeadingCenter}>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>CHOOSE YOUR PATH</span>
            <h2 style={styles.sectionTitle}>Who Are You? Join As:</h2>
            <p style={styles.sectionSubtitle}>
              Dedicated workflows, tailored verification, and role-specific dashboards built for your workflow.
            </p>
          </div>

          <div style={styles.roleGrid}>
            {/* Card 1: FARMER */}
            <div style={styles.roleCardFarmer}>
              <div style={styles.roleBadgeHeader}>
                <span style={{ fontSize: '32px' }}>🌾</span>
                <span className="badge badge-green">LANDOWNER & CULTIVATOR</span>
              </div>
              <h3 style={styles.roleCardTitle}>Farmer</h3>
              <p style={styles.roleCardText}>
                Find verified machinery operators, rent combine harvesters and rotavators, and connect with direct input suppliers for your acreage.
              </p>
              <ul style={styles.roleFeatureList}>
                <li><CheckCircle2 size={16} color="#15803d" /> Post acreage requirements in 60 seconds</li>
                <li><CheckCircle2 size={16} color="#15803d" /> Rent tractors with or without verified drivers</li>
                <li><CheckCircle2 size={16} color="#15803d" /> Access zero-commission worker directory</li>
              </ul>
              <div style={styles.roleCardActions}>
                <button 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => onOpenAuth('signup', 'farmer')}
                >
                  Join as Farmer
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => onOpenAuth('login', 'farmer')}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Card 2: COMPANY */}
            <div style={styles.roleCardCompany}>
              <div style={styles.roleBadgeHeader}>
                <span style={{ fontSize: '32px' }}>🏢</span>
                <span className="badge badge-blue">ENTERPRISE & DISTRIBUTOR</span>
              </div>
              <h3 style={styles.roleCardTitle}>Agri Company</h3>
              <p style={styles.roleCardText}>
                Deploy field testing campaigns, recruit seasonal agronomy teams, verify retail distributors, and procure bulk crop contracts directly.
              </p>
              <ul style={styles.roleFeatureList}>
                <li><CheckCircle2 size={16} color="#0284c7" /> Post high-volume seasonal cluster contracts</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Triage certified sprayers and drone teams</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Publish retail fertilizers & seed availability</li>
              </ul>
              <div style={styles.roleCardActions}>
                <button 
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                  onClick={() => onOpenAuth('signup', 'company')}
                >
                  Join as Company
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => onOpenAuth('login', 'company')}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Card 3: SKILLED LABOUR + TOOLS */}
            <div style={styles.roleCardWorker}>
              <div style={styles.roleBadgeHeader}>
                <span style={{ fontSize: '32px' }}>🛠️</span>
                <span className="badge badge-yellow">OPERATOR & EQUIPMENT OWNER</span>
              </div>
              <h3 style={styles.roleCardTitle}>Skilled Labour + Tools</h3>
              <p style={styles.roleCardText}>
                Showcase your machinery (tractors, harvesters, drones, rotavators) or specialized field skills and receive direct farm bookings.
              </p>
              <ul style={styles.roleFeatureList}>
                <li><CheckCircle2 size={16} color="#ca8a04" /> List "Skill Only", "Tool Only", or "Both"</li>
                <li><CheckCircle2 size={16} color="#ca8a04" /> Set your own daily, hourly, or acre rates</li>
                <li><CheckCircle2 size={16} color="#ca8a04" /> Guaranteed booking alerts & work history</li>
              </ul>
              <div style={styles.roleCardActions}>
                <button 
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: '#ca8a04', borderColor: '#ca8a04' }}
                  onClick={() => onOpenAuth('signup', 'skilled_worker')}
                >
                  Join as Worker / Owner
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => onOpenAuth('login', 'skilled_worker')}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section style={styles.howItWorksSection}>
        <div className="container">
          <div style={styles.sectionHeadingCenter}>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>SIMPLE & TRANSPARENT</span>
            <h2 style={styles.sectionTitle}>How YUKTI Connects the Ecosystem</h2>
            <p style={styles.sectionSubtitle}>
              From acreage preparation to harvest, find the right equipment and hands in 5 clear steps.
            </p>
          </div>

          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h4 style={styles.stepTitle}>Create Your Profile</h4>
              <p style={styles.stepText}>Select your role (Farmer, Company, or Skilled Worker) and declare your land, tools, or services.</p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h4 style={styles.stepTitle}>Post or Discover Work</h4>
              <p style={styles.stepText}>Publish farm requirements or browse nearby opportunities with transparent per-day or per-acre rates.</p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h4 style={styles.stepTitle}>Connect & Verify</h4>
              <p style={styles.stepText}>Review operator badges, machine model specs, past ratings, and communicate directly inside the platform.</p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>4</div>
              <h4 style={styles.stepTitle}>Execute the Field Work</h4>
              <p style={styles.stepText}>Complete the job on schedule with real-time status updates and transparent operational terms.</p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>5</div>
              <h4 style={styles.stepTitle}>Build Reputation</h4>
              <p style={styles.stepText}>Leave verified ratings, record completed acreage, and unlock higher booking volume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM METRICS */}
      <section style={styles.statsSection}>
        <div className="container" style={styles.statsGrid}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>14,200+</div>
            <div style={styles.statLabel}>Verified Cultivators</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>3,850+</div>
            <div style={styles.statLabel}>Active Machinery & Implements</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>98.4%</div>
            <div style={styles.statLabel}>On-Time Job Completion</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>48,000+</div>
            <div style={styles.statLabel}>Acreage Serviced This Season</div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED OPPORTUNITIES & JOBS PREVIEW */}
      <section style={styles.sectionLight}>
        <div className="container">
          <div style={styles.sectionHeaderFlex}>
            <div>
              <span className="badge badge-green">LIVE DEMAND</span>
              <h2 style={styles.sectionTitleLeft}>Recent Agricultural Work Postings</h2>
            </div>
            <button 
              className="btn btn-outline-primary"
              onClick={() => onNavigateTab('jobs')}
            >
              Browse All Jobs <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3" style={{ marginTop: '24px' }}>
            {INITIAL_JOBS.slice(0, 3).map((job) => (
              <div key={job.id} className="card" style={styles.jobPreviewCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-green">{job.crop}</span>
                  <span style={styles.urgencyBadge(job.urgency)}>{job.urgency.toUpperCase()}</span>
                </div>
                <h4 style={styles.jobCardTitle}>{job.title}</h4>
                <p style={styles.jobCardDesc}>{job.description}</p>
                <div style={styles.jobCardMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
                    <MapPin size={14} /> {job.location}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>
                    ₹{job.budget.toLocaleString()} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>/{job.rateType}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '16px' }}
                  onClick={() => onOpenAuth('login', 'skilled_worker')}
                >
                  Apply for Job
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED EQUIPMENT PREVIEW */}
      <section style={styles.sectionDarker}>
        <div className="container">
          <div style={styles.sectionHeaderFlex}>
            <div>
              <span className="badge badge-yellow">FARM POWER</span>
              <h2 style={styles.sectionTitleLeft}>Available Machinery & Implements</h2>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigateTab('marketplace')}
            >
              Explore All Equipment <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-4" style={{ marginTop: '24px' }}>
            {INITIAL_EQUIPMENT.map((eq) => (
              <div key={eq.id} className="card" style={{ padding: '16px' }}>
                <img 
                  src={eq.image} 
                  alt={eq.name} 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-slate">{eq.category}</span>
                  {eq.operatorIncluded && (
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>Operator Included</span>
                  )}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>{eq.name}</h4>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} /> {eq.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>₹{eq.dailyRate.toLocaleString()}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>/day</span>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onOpenAuth('login', 'farmer')}
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRUST & SAFETY BANNER */}
      <section style={styles.trustSection}>
        <div className="container" style={styles.trustContent}>
          <div style={{ maxWidth: '640px' }}>
            <div className="badge badge-green" style={{ marginBottom: '12px' }}>VERIFIED & SECURE</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
              Built for Ground-Level Agricultural Reliability
            </h2>
            <p style={{ color: '#dcfce7', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              Every equipment listing includes verified horsepower ratings, implement conditions, and driver backgrounds. 
              Review official CIB/FCO agrochemical company certifications and farmer ratings before signing any service contract.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={styles.trustPill}><ShieldCheck size={18} color="#22c55e" /> Identity Verified</div>
              <div style={styles.trustPill}><Tractor size={18} color="#22c55e" /> Equipment Inspected</div>
              <div style={styles.trustPill}><Star size={18} color="#22c55e" /> Community Reviewed</div>
            </div>
          </div>
          <div style={styles.trustActionBox}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Ready to grow your farm or machinery business?
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Free registration for farmers, companies, and equipment operators.
            </p>
            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
              onClick={() => onOpenAuth('signup', 'farmer')}
            >
              Get Started with YUKTI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  landingContainer: {
    backgroundColor: '#ffffff',
  },
  heroSection: {
    background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
    padding: '72px 0 56px',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  heroHeadline: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-1.5px',
    lineHeight: '1.15',
    marginBottom: '20px',
    maxWidth: '850px',
  },
  heroHighlight: {
    color: '#15803d',
    background: 'linear-gradient(90deg, #15803d 0%, #16a34a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '17px',
    color: '#475569',
    lineHeight: '1.6',
    maxWidth: '720px',
    marginBottom: '32px',
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '680px',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #cbd5e1',
  },
  searchField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '12px',
    flex: 1,
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#0f172a',
  },
  roleDoorsSection: {
    padding: '64px 0',
    backgroundColor: '#f8fafc',
  },
  sectionHeadingCenter: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 48px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    marginBottom: '10px',
  },
  sectionSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '24px',
  },
  roleCardFarmer: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid #bbf7d0',
    padding: '32px 24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.25s',
  },
  roleCardCompany: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid #bae6fd',
    padding: '32px 24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.25s',
  },
  roleCardWorker: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '2px solid #fde68a',
    padding: '32px 24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.25s',
  },
  roleBadgeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  roleCardTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '10px',
  },
  roleCardText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '20px',
    flexGrow: 1,
  },
  roleFeatureList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '13px',
    color: '#334155',
    marginBottom: '24px',
  },
  roleCardActions: {
    display: 'flex',
    gap: '10px',
  },
  howItWorksSection: {
    padding: '72px 0',
    backgroundColor: '#ffffff',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: '16px',
  },
  stepCard: {
    padding: '24px 16px',
    borderRadius: '16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    position: 'relative',
    textAlign: 'center',
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#15803d',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  stepText: {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  statsSection: {
    backgroundColor: '#14532d',
    color: '#ffffff',
    padding: '48px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '24px',
    textAlign: 'center',
  },
  statBox: {
    padding: '12px',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#86efac',
    letterSpacing: '-0.5px',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#dcfce7',
    fontWeight: '500',
  },
  sectionLight: {
    padding: '64px 0',
    backgroundColor: '#f8fafc',
  },
  sectionDarker: {
    padding: '64px 0',
    backgroundColor: '#ffffff',
  },
  sectionHeaderFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '32px',
  },
  sectionTitleLeft: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginTop: '6px',
  },
  jobPreviewCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  jobCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  jobCardDesc: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.5',
    marginBottom: '16px',
    flexGrow: 1,
  },
  jobCardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  urgencyBadge: (urgency) => ({
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '800',
    backgroundColor: urgency === 'emergency' ? '#fee2e2' : '#fef3c7',
    color: urgency === 'emergency' ? '#dc2626' : '#b45309',
  }),
  trustSection: {
    backgroundColor: '#166534',
    padding: '64px 0',
  },
  trustContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  trustPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
  },
  trustActionBox: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '380px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  }
};
