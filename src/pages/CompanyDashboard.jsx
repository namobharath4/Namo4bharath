import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageSquare,
  Edit2,
  Check,
  Package,
  ArrowRight,
  Briefcase,
  Trash2,
  Upload,
  Paperclip
} from 'lucide-react';
import { storageService } from '../services/storageService';
import StorageImage from '../components/StorageImage';

export default function CompanyDashboard({ onOpenJobModal, onOpenMessage }) {
  const { user, profile, updateProfile, uploadAvatar, deleteAvatar } = useAuth();
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [companyJobs, setCompanyJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState(profile?.company_name || profile?.name || 'Coromandel Agritech Solutions');
  const [cin, setCin] = useState(profile?.registration_number || 'CIN-U01100AP2019PTC11234');
  const [license, setLicense] = useState(profile?.license_number || 'FCO/AP/GNT/2023/8892');
  const [contactPerson, setContactPerson] = useState(profile?.contact_person || 'Anil Varma');
  const [district, setDistrict] = useState(profile?.location || 'Vijayawada, Krishna, AP');

  // Input Catalog State
  const [catalogItems, setCatalogItems] = useState([
    { id: 1, name: 'Bio-NPK Liquid Consortium 1L', category: 'Nutrients', mrp: 650, stock: 'Available' },
    { id: 2, name: 'Precision Drone Micronutrient Pack 5L', category: 'Foliar Spray', mrp: 1850, stock: 'Available' },
  ]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Nutrients');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [uploadingProduct, setUploadingProduct] = useState(false);

  // Operator Search
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    loadCompanyData();
  }, [user]);

  async function loadCompanyData() {
    if (!user) return;
    setLoading(true);
    try {
      const [jobsData, workersData] = await Promise.all([
        dbService.getMyJobs(user.id),
        dbService.searchWorkers()
      ]);
      setCompanyJobs(jobsData);
      setWorkers(workersData);
    } catch (err) {
      console.warn('Company data error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      alert('Avatar upload failed: ' + err.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      company_name: companyName,
      registration_number: cin,
      license_number: license,
      contact_person: contactPerson,
      location: district
    });
    setIsEditing(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    setUploadingProduct(true);
    try {
      const productId = Date.now();
      let imageUrl = null;

      if (productImageFile && user) {
        const uploadRes = await storageService.uploadFile({
          file: productImageFile,
          userId: user.id,
          featureName: 'catalog',
          itemId: productId.toString()
        });
        imageUrl = uploadRes.path;
      }

      setCatalogItems(prev => [
        ...prev,
        {
          id: productId,
          name: newProductName,
          category: newProductCategory,
          mrp: Number(newProductPrice),
          stock: 'In Stock',
          image_url: imageUrl
        }
      ]);

      setNewProductName('');
      setNewProductPrice('');
      setProductImageFile(null);
      setProductImagePreview('');
      setShowAddProduct(false);
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    } finally {
      setUploadingProduct(false);
    }
  };

  const handleDeleteProduct = async (item) => {
    if (item.image_url) {
      await storageService.deleteFile(item.image_url);
    }
    setCatalogItems(prev => prev.filter(p => p.id !== item.id));
  };

  const filteredWorkers = workers.filter(w => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    const nameMatch = (w.name || w.full_name || '').toLowerCase().includes(term);
    const locMatch = (w.location || w.district || '').toLowerCase().includes(term);
    const skillsMatch = (w.skills || []).some(s => s.toLowerCase().includes(term));
    return nameMatch || locMatch || skillsMatch;
  });

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        {/* Company Header Banner */}
        <div style={styles.headerBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              {profile?.avatar_url ? (
                <StorageImage 
                  src={profile.avatar_url} 
                  alt="Company Logo" 
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #0284c7' }}
                />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: '#0284c7', border: '3px solid #0284c7' }}>
                  {(companyName || user?.email || 'C').charAt(0).toUpperCase()}
                </div>
              )}
              <label 
                style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#0284c7', color: '#fff', padding: '5px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                title="Upload Company Logo"
              >
                <Upload size={13} />
                <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: 'none' }} disabled={avatarUploading} />
              </label>
            </div>
            <div>
              <div className="badge badge-blue" style={{ marginBottom: '4px' }}>
                <Building2 size={14} /> AGRI-ENTERPRISE WORKSPACE
              </div>
              <h1 style={styles.companyTitle}>
                {companyName}
              </h1>
              <div style={styles.metaRow}>
                <span><ShieldCheck size={14} color="#0284c7" style={{ display: 'inline' }} /> CIN: {cin}</span>
                <span>•</span>
                <span>FCO Lic: {license}</span>
                <span>•</span>
                <span>HQ: {district}</span>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
            onClick={onOpenJobModal}
          >
            <PlusCircle size={20} />
            Post Seasonal Contract
          </button>
        </div>

        {/* Dashboard Grid */}
        <div style={styles.gridContainer}>
          {/* Left Column: Corporate Profile & Input Catalog */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Corporate Profile Card */}
            <div className="card">
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={20} color="#0284c7" />
                  <h3 style={styles.cardTitle}>Enterprise Profile</h3>
                </div>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 size={13} /> {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={styles.fieldLabel}>Company Entity Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Registration / CIN</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={cin} 
                      onChange={(e) => setCin(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Fertilizer / Chemical License #</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={license} 
                      onChange={(e) => setLicense(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={styles.fieldLabel}>Contact Person</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={contactPerson} 
                        onChange={(e) => setContactPerson(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Operational District</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={district} 
                        onChange={(e) => setDistrict(e.target.value)} 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary" style={{ backgroundColor: '#0284c7', borderColor: '#0284c7', marginTop: '6px' }}>
                    <Check size={14} /> Update Entity Details
                  </button>
                </form>
              ) : (
                <div style={styles.specGrid}>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Legal Entity</span>
                    <span style={styles.specValue}>{companyName}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>CIN Number</span>
                    <span style={styles.specValue}>{cin}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>FCO Fertilizer License</span>
                    <span style={styles.specValue}>{license}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>Liaison Officer</span>
                    <span style={styles.specValue}>{contactPerson}</span>
                  </div>
                  <div style={styles.specItem}>
                    <span style={styles.specLabel}>District Territory</span>
                    <span style={styles.specValue}>{district}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Supply & Products Catalog */}
            <div className="card">
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={20} color="#0284c7" />
                  <h3 style={styles.cardTitle}>Agri-Inputs Distribution</h3>
                </div>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                >
                  <PlusCircle size={13} /> Add Product
                </button>
              </div>

              {showAddProduct && (
                <form onSubmit={handleAddProduct} style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #bae6fd' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={styles.fieldLabel}>Product Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Micronutrient Zinc Chelate 500g"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={styles.fieldLabel}>Category</label>
                      <select 
                        className="form-select"
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                      >
                        <option value="Nutrients">Nutrients & Fertilizer</option>
                        <option value="Foliar Spray">Foliar Spray / Protection</option>
                        <option value="Seeds">Certified Seeds</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>MRP (₹)</label>
                      <input 
                        type="number" 
                        required 
                        className="form-input" 
                        placeholder="e.g. 750"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={styles.fieldLabel}>Product Image / Brochure (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProductImageFile(file);
                          setProductImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="form-input"
                      style={{ padding: '6px' }}
                    />
                    {productImagePreview && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={productImagePreview} alt="Preview" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{productImageFile?.name}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={uploadingProduct}
                    className="btn btn-sm btn-primary" 
                    style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                  >
                    {uploadingProduct ? 'Saving Product...' : 'Save Product to Catalog'}
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {catalogItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.image_url ? (
                        <StorageImage 
                          src={item.image_url} 
                          alt={item.name} 
                          style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #bae6fd' }}
                        />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={18} color="#0284c7" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{item.category}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0284c7' }}>₹{item.mrp}</div>
                        <span className="badge badge-green" style={{ fontSize: '10px' }}>{item.stock}</span>
                      </div>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        style={{ padding: '6px', color: '#ef4444', borderColor: '#fecaca', backgroundColor: '#fff' }}
                        title="Delete product and storage file"
                        onClick={() => handleDeleteProduct(item)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contracts & Operator Deployment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Active Contracts Card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Seasonal Cluster Contracts</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Manage acreage contracts, spray campaigns, and harvester deployments.</span>
                </div>
                <button 
                  className="btn btn-sm btn-primary"
                  style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                  onClick={onOpenJobModal}
                >
                  <PlusCircle size={14} /> New Contract
                </button>
              </div>

              {companyJobs.length === 0 ? (
                <div style={styles.emptyStateContainer}>
                  <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>No active contracts published yet</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '4px auto 16px' }}>
                    Publish seasonal cluster tenders or spray campaigns to contract verified operators across target districts.
                  </p>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                    onClick={onOpenJobModal}
                  >
                    Post Seasonal Contract
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {companyJobs.map((job) => (
                    <div key={job.id} style={styles.contractRow}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="badge badge-blue">{job.crop || 'Contract'}</span>
                          <span className="badge badge-slate">{job.status}</span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{job.title}</h4>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                          <span><MapPin size={12} style={{ display: 'inline' }} /> {job.location}</span>
                          <span>Budget: ₹{Number(job.budget || 0).toLocaleString()}</span>
                          <span>Duration: {job.duration_days || 1} Days</span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onOpenMessage('Contract Manager')}
                      >
                        <MessageSquare size={13} /> Inquiries
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Operator & Field Machinery Discovery */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Deployable Field Operators</h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Contract skilled certified pilots and machine operators for your territory.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
                  <Search size={16} color="#64748b" />
                  <input 
                    type="text" 
                    placeholder="Search drone pilots, harvester crews..."
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
              </div>

              {filteredWorkers.length === 0 ? (
                <div style={styles.emptyStateContainer}>
                  <Users size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>No matching operators found</h4>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Post a corporate contract so certified operators across Andhra Pradesh and Telangana can reach out to you.
                  </p>
                </div>
              ) : (
                <div className="grid-2">
                  {filteredWorkers.map((w) => (
                    <div key={w.id || w.user_id} style={{ border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{w.name || w.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>
                        <MapPin size={12} style={{ display: 'inline' }} /> {w.location || w.district || 'Andhra Pradesh'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '8px 0' }}>
                        {(w.skills || ['Tractor Specialist']).map((s, idx) => (
                          <span key={idx} className="badge badge-slate" style={{ fontSize: '10px' }}>{s}</span>
                        ))}
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        style={{ width: '100%', marginTop: '6px' }}
                        onClick={() => onOpenMessage(w.name || w.full_name)}
                      >
                        <MessageSquare size={13} /> Contract Operator
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    backgroundColor: '#ffffff',
    padding: '24px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '20px',
  },
  companyTitle: {
    fontSize: '26px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '6px',
    flexWrap: 'wrap',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '3px',
    textTransform: 'uppercase',
  },
  specGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  specLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    marginTop: '2px',
  },
  contractRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    gap: '16px',
    flexWrap: 'wrap',
  },
  emptyStateContainer: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px dashed #cbd5e1',
  }
};
