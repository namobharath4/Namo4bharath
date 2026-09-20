import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, Search, UserCheck } from 'lucide-react';
import { INITIAL_COMPANIES, INITIAL_WORKERS } from '../data/mockData';

export default function AdminDeskPage() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'pv-1',
      type: 'Company License',
      entityName: 'Nuziveedu Hybrid Seeds Ltd.',
      regDoc: 'NSC/FCO/AP/2024/911',
      date: 'Sep 19, 2026',
      status: 'UNDER_REVIEW'
    },
    {
      id: 'pv-2',
      type: 'Drone Operator DGCA License',
      entityName: 'Suresh Kumar (Kisan Drones)',
      regDoc: 'DGCA-RPA-PILOT-88319',
      date: 'Sep 18, 2026',
      status: 'UNDER_REVIEW'
    }
  ]);

  const handleApprove = (id) => {
    setPendingVerifications(prev => prev.map(item => item.id === id ? { ...item, status: 'APPROVED' } : item));
  };

  const handleReject = (id) => {
    setPendingVerifications(prev => prev.map(item => item.id === id ? { ...item, status: 'REJECTED' } : item));
  };

  return (
    <div style={{ padding: '36px 0 72px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-slate" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={14} /> OFFICIAL REGULATORY CONSOLE
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>
              District Agronomy & Compliance Desk
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              Department of Agriculture & Farmers Welfare • Verification & Safety Audit
            </p>
          </div>

          <span className="badge badge-green" style={{ fontSize: '13px', padding: '8px 16px' }}>
            ✓ System Integrity: Normal
          </span>
        </div>

        {/* Overview Stats */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div className="card">
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>VERIFIED COMPANIES</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>128</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>LICENSED OPERATORS</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>1,490</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>PENDING AUDITS</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#ca8a04', marginTop: '4px' }}>2</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>FCO CERTIFICATION PASS</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>99.2%</div>
          </div>
        </div>

        {/* Pending Verification Triage */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
            Regulatory Compliance Queue
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingVerifications.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-blue">{item.type}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Submitted: {item.date}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{item.entityName}</h4>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Certificate/Doc Reference: <code>{item.regDoc}</code></div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.status === 'APPROVED' ? (
                    <span className="badge badge-green" style={{ padding: '6px 14px' }}>✓ Approved & Licensed</span>
                  ) : item.status === 'REJECTED' ? (
                    <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '6px 14px' }}>✕ Rejected</span>
                  ) : (
                    <>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(item.id)}
                      >
                        Reject
                      </button>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve License
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
