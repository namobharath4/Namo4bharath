import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, Search, UserCheck } from 'lucide-react';

export default function AdminDeskPage() {
  const [pendingVerifications, setPendingVerifications] = useState([]);

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
            ✓ System Status: Live & Operational
          </span>
        </div>

        {/* Pending Verification Triage */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
            Regulatory Compliance & License Queue
          </h3>

          {pendingVerifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', border: '1px dashed #cbd5e1', borderRadius: '10px' }}>
              <CheckCircle2 size={42} color="#16a34a" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>All regulatory licenses up to date</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                New enterprise registrations, FCO licenses, and DGCA drone pilot submissions will appear here for verification.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
