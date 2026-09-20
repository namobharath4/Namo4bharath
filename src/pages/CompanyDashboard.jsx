import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Briefcase, 
  Package, 
  ShieldCheck, 
  Search, 
  MapPin, 
  CheckCircle, 
  Filter,
  FileText,
  MessageSquare
} from 'lucide-react';
import { INITIAL_WORKERS, INITIAL_JOBS } from '../data/mockData';

export default function CompanyDashboard({ onOpenJobModal, onOpenMessage }) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('contracts'); // 'contracts' | 'talent' | 'products'
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');

  // Initial Company Products (seeds, fertilizers, implements)
  const [companyProducts, setCompanyProducts] = useState([
    {
      id: 'prod-1',
      name: 'Gromor 28-28-0 Complex Fertilizer',
      category: 'Fertilizer',
      specification: 'High ammoniacal and phosphate formula for basal dressing',
      packageSize: '50 Kg Bag',
      price: 1475,
      stockStatus: 'In Stock (Warehouse GNT)',
      complianceVerified: true
    },
    {
      id: 'prod-2',
      name: 'Coromandel Neem-Coated Urea',
      category: 'Soil Nutrition',
      specification: '46% Nitrogen slow release with nitrification inhibitors',
      packageSize: '45 Kg Bag',
      price: 266,
      stockStatus: 'In Stock (District Hub)',
      complianceVerified: true
    },
    {
      id: 'prod-3',
      name: 'Bio-Organic Trichoderma Viride 1% WP',
      category: 'Bio-Pesticide',
      specification: 'CCOF organic certified fungal antagonist for root wilt prevention',
      packageSize: '1 Kg Foil',
      price: 210,
      stockStatus: 'In Stock',
      complianceVerified: true
    }
  ]);

  const filteredWorkers = INITIAL_WORKERS.filter(w => 
    w.name.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
    w.skills.some(s => s.toLowerCase().includes(workerSearchTerm.toLowerCase())) ||
    w.location.toLowerCase().includes(workerSearchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={styles.companyBanner}>
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '8px' }}>
              <Building2 size={14} /> ENTERPRISE AGRI-PORTAL
            </div>
            <h1 style={styles.welcomeHeading}>
              {profile?.companyName || 'Coromandel Agritech Solutions'}
            </h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              <span>Lic: {profile?.licenseNumber || 'FCO/AP/GNT/2023/8821'}</span>
              <span>CIN: {profile?.registrationNumber || 'CIN-U01100AP2019PLC087'}</span>
              <span style={{ color: '#0284c7', fontWeight: '700' }}>✓ Verified Enterprise Partner</span>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
            onClick={onOpenJobModal}
          >
            <PlusCircle size={20} />
            Post Cluster Contract
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabBar}>
          <button 
            style={activeTab === 'contracts' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('contracts')}
          >
            <Briefcase size={16} /> Active Contracts & Projects
          </button>
          <button 
            style={activeTab === 'talent' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('talent')}
          >
            <Users size={16} /> Search & Recruit Talent ({INITIAL_WORKERS.length})
          </button>
          <button 
            style={activeTab === 'products' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} /> Farm Input Catalog & Supply ({companyProducts.length})
          </button>
        </div>

        {/* Tab 1: Contracts */}
        {activeTab === 'contracts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Seasonal Agri Contracts & Field Campaigns</h3>
                <span className="badge badge-blue">Cluster Hub Operations</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {INITIAL_JOBS.filter(j => j.posterRole === 'company').map((job) => (
                  <div key={job.id} style={styles.contractRow}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-blue">{job.crop}</span>
                        <span className="badge badge-slate">{job.workersNeeded} Open Openings</span>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{job.title}</h4>
                      <p style={{ fontSize: '13px', color: '#475569', margin: '6px 0' }}>{job.description}</p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b' }}>
                        <span><MapPin size={13} style={{ display: 'inline' }} /> {job.location}</span>
                        <span style={{ fontWeight: '700', color: '#0284c7' }}>₹{job.budget.toLocaleString()} /month</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span className="badge badge-green">7 Candidates Applied</span>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenMessage('Field Technicians Team')}
                      >
                        <MessageSquare size={14} /> Review Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Talent Search */}
        {activeTab === 'talent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Search size={20} color="#64748b" />
                <input 
                  type="text"
                  placeholder="Filter talent by skill (e.g. Drone Pilot, Soil Technician, Tractor)..."
                  className="form-input"
                  style={{ border: 'none', padding: 0 }}
                  value={workerSearchTerm}
                  onChange={(e) => setWorkerSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              {filteredWorkers.map((worker) => (
                <div key={worker.id} className="card" style={styles.talentCard}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <img src={worker.avatar} alt={worker.name} style={styles.talentAvatar} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '17px', fontWeight: '700' }}>{worker.name}</h4>
                        <span className="badge badge-green">★ {worker.rating}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        <MapPin size={12} style={{ display: 'inline' }} /> {worker.location} ({worker.experienceYears} yrs exp)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '10px 0' }}>
                        {worker.skills.map((s, idx) => (
                          <span key={idx} className="badge badge-blue" style={{ fontSize: '11px' }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0284c7' }}>₹{worker.dailyRate}/day</span>
                        <button 
                          className="btn btn-sm btn-primary"
                          style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                          onClick={() => onOpenMessage(worker.name)}
                        >
                          Send Proposal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Products Catalog */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Certified Input Catalog (Direct Farm Dispatch)</h3>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Authorized agrochemical and seed distribution directly to registered farmers.</p>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => alert('Add Product modal')}
                >
                  + Add Input Line
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {companyProducts.map((p) => (
                  <div key={p.id} style={styles.productRow}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-green">{p.category}</span>
                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>✓ FCO Approved</span>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{p.name}</h4>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>{p.specification} ({p.packageSize})</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹{p.price}</div>
                      <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>{p.stockStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  companyBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    backgroundColor: '#ffffff',
    padding: '24px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '20px',
  },
  welcomeHeading: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
  },
  tabBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    background: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
  },
  tabActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#e0f2fe',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0369a1',
    cursor: 'pointer',
  },
  contractRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    gap: '20px',
    flexWrap: 'wrap',
  },
  talentCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  talentAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  }
};
