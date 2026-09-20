import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import StorageImage from '../components/StorageImage';
import { 
  Tractor, 
  Search, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Filter,
  MessageSquare,
  Sparkles,
  Trash2
} from 'lucide-react';

export default function MarketplacePage({ onOpenEquipmentModal, onOpenAuth, onOpenMessage }) {
  const { user, isAuthenticated } = useAuth();

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationSearch, setLocationSearch] = useState('');
  const [operatorOnly, setOperatorOnly] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory, operatorOnly]);

  async function fetchEquipment() {
    setLoading(true);
    try {
      const data = await dbService.getEquipment({
        category: selectedCategory,
        location: locationSearch,
        operatorIncluded: operatorOnly
      });
      setEquipmentList(data);
    } catch (err) {
      console.warn('Equipment fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  const handleDeleteEquipment = async (equipId) => {
    if (window.confirm('Are you sure you want to delete this machinery listing?')) {
      await dbService.deleteEquipment(equipId);
      setEquipmentList(prev => prev.filter(e => e.id !== equipId));
    }
  };

  const categories = [
    { id: 'all', label: 'All Machinery' },
    { id: 'Tractor', label: 'Tractors' },
    { id: 'Harvester', label: 'Combine Harvesters' },
    { id: 'Drone', label: 'Agri Drones' },
    { id: 'Sprayer', label: 'Sprayers' },
    { id: 'Rotavator', label: 'Rotavators & Implements' },
  ];

  return (
    <div style={{ padding: '36px 0 72px' }}>
      <div className="container">
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>MACHINERY & TOOLS FLEET</span>
            <h1 style={styles.pageTitle}>Farm Equipment & Machinery Network</h1>
            <p style={styles.pageSubtitle}>
              Rent high-capacity agricultural machinery and precision implements with or without operators.
            </p>
          </div>

          <button 
            className="btn btn-accent btn-lg"
            onClick={() => {
              if (isAuthenticated) onOpenEquipmentModal();
              else onOpenAuth('login', 'skilled_worker');
            }}
          >
            <PlusCircle size={20} />
            List Machinery for Rent
          </button>
        </div>

        {/* Category Tabs */}
        <div style={styles.categoryScroll}>
          {categories.map((c) => (
            <button 
              key={c.id}
              style={selectedCategory === c.id ? styles.categoryTabActive : styles.categoryTab}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Location & Operator Filters */}
        <div className="card" style={{ marginBottom: '32px', padding: '16px 20px' }}>
          <form onSubmit={handleSearchSubmit} style={styles.filterBar}>
            <div style={styles.searchBox}>
              <Search size={18} color="#64748b" />
              <input 
                type="text"
                placeholder="Search by district or city (e.g. Guntur, Krishna, Tenali)..."
                className="form-input"
                style={{ border: 'none', padding: '6px 0' }}
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={operatorOnly}
                  onChange={(e) => setOperatorOnly(e.target.checked)}
                />
                With Operator Included Only
              </label>

              <button type="submit" className="btn btn-primary">
                Search Machinery
              </button>
            </div>
          </form>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '16px', color: '#64748b' }}>Loading machinery directory...</div>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <Tractor size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>No equipment has been listed yet</h3>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '440px', margin: '6px auto 20px' }}>
              Have tractors, rotavators, harvesters, or agricultural drones? List them on YUKTI to earn rental income during peak acreage seasons.
            </p>
            <button 
              className="btn btn-accent btn-lg"
              onClick={() => {
                if (isAuthenticated) onOpenEquipmentModal();
                else onOpenAuth('login', 'skilled_worker');
              }}
            >
              List Machinery for Rent
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {equipmentList.map((eq) => (
              <div key={eq.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
                <StorageImage 
                  src={eq.image_url} 
                  alt={eq.name}
                  style={styles.imageBox}
                  fallbackSrc="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=80"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 4px' }}>
                  <span className="badge badge-yellow">{eq.category}</span>
                  {eq.operator_included ? (
                    <span className="badge badge-green">Driver Included</span>
                  ) : (
                    <span className="badge badge-slate">Machine Only</span>
                  )}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>
                  {eq.name}
                </h3>

                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  {eq.location} • Year: {eq.model_year || 2023}
                </div>

                {eq.specs && (
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: '1.4' }}>
                    {eq.specs}
                  </p>
                )}

                <div style={styles.cardFooter}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#15803d' }}>
                      ₹{Number(eq.daily_rate || 0).toLocaleString()}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Rate per Day</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => onOpenMessage(eq.owner_name || 'Equipment Owner')}
                    >
                      <MessageSquare size={14} /> Book / Rent
                    </button>
                    {user && (user.id === eq.owner_id || user.id === eq.ownerId) && (
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '8px', color: '#ef4444', borderColor: '#fecaca', backgroundColor: '#fff' }}
                        title="Delete machinery listing"
                        onClick={() => handleDeleteEquipment(eq.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginTop: '4px',
  },
  categoryScroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
    marginBottom: '20px',
  },
  categoryTab: {
    padding: '8px 18px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '24px',
    cursor: 'pointer',
    color: '#475569',
    whiteSpace: 'nowrap',
  },
  categoryTabActive: {
    padding: '8px 18px',
    fontSize: '14px',
    fontWeight: '700',
    backgroundColor: '#ca8a04',
    border: '1px solid #ca8a04',
    borderRadius: '24px',
    cursor: 'pointer',
    color: '#ffffff',
    whiteSpace: 'nowrap',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: '260px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 20px',
    border: '1px dashed #cbd5e1',
  },
  imageBox: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '14px',
    marginTop: 'auto',
  }
};
