import React, { useState } from 'react';
import { Search, MapPin, Tractor, CheckCircle, PlusCircle, Wrench } from 'lucide-react';
import { INITIAL_EQUIPMENT } from '../data/mockData';

export default function MarketplacePage({ onOpenEquipmentModal, onOpenMessage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [operatorOnly, setOperatorOnly] = useState(false);

  const filteredEquipment = INITIAL_EQUIPMENT.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          eq.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          eq.specs.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || eq.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesOperator = !operatorOnly || eq.operatorIncluded;
    return matchesSearch && matchesCategory && matchesOperator;
  });

  return (
    <div style={{ padding: '36px 0 72px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>CUSTOM HIRING NETWORK</span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
              Agricultural Tools & Machinery Marketplace
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              Rent vetted tractors, combine harvesters, rotavators, and sprayers directly with or without certified operators.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            style={{ backgroundColor: '#ca8a04', borderColor: '#ca8a04' }}
            onClick={onOpenEquipmentModal}
          >
            <PlusCircle size={20} />
            List Machinery for Rent
          </button>
        </div>

        {/* Filter Controls */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search tractor HP, drone sprayer, harvester, or district..." 
                className="form-input"
                style={{ border: 'none', padding: 0 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Machinery Categories</option>
              <option value="Tractor">Tractors (40-65 HP)</option>
              <option value="Harvester">Combine Harvesters</option>
              <option value="Drone Sprayer">Agricultural Drones</option>
              <option value="Rotavator">Rotavators & Tillers</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={operatorOnly}
                onChange={(e) => setOperatorOnly(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Operator Included Only
            </label>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid-3">
          {filteredEquipment.map((eq) => (
            <div key={eq.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={eq.image} 
                  alt={eq.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }}
                />
                <span className="badge badge-slate" style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#ffffff' }}>
                  {eq.condition}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-yellow">{eq.category}</span>
                {eq.operatorIncluded ? (
                  <span className="badge badge-green">✓ Certified Driver Included</span>
                ) : (
                  <span className="badge badge-slate">Self-Operated Rental</span>
                )}
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                {eq.name}
              </h3>
              
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '14px', flexGrow: 1 }}>
                {eq.specs}
              </p>

              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                <div><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Location: {eq.location}</div>
                <div>Owner: <strong>{eq.ownerName}</strong> (Verified Registry)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <div>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#15803d' }}>₹{eq.dailyRate.toLocaleString()}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>/day</span>
                  {eq.weeklyRate && (
                    <div style={{ fontSize: '11px', color: '#64748b' }}>₹{eq.weeklyRate.toLocaleString()}/week</div>
                  )}
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={() => onOpenMessage(eq.ownerName)}
                >
                  Book Machine
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
