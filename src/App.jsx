import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/FarmerDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import JobBoardPage from './pages/JobBoardPage';
import MarketplacePage from './pages/MarketplacePage';
import AdminDeskPage from './pages/AdminDeskPage';
import AuthModal from './components/AuthModal';
import JobPostModal from './components/JobPostModal';
import EquipmentModal from './components/EquipmentModal';
import MessageDrawer from './components/MessageDrawer';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function App() {
  const { user, currentRole } = useAuth();
  const pathname = window.location.pathname;

  if (pathname === '/login' || pathname === '/signin') {
    return <SignIn />;
  }

  if (pathname === '/signup') {
    return <SignUp />;
  }
  
  // Navigation tab: 'landing' | 'dashboard' | 'jobs' | 'marketplace' | 'admin'
  const [activeTab, setActiveTab] = useState('landing');

  // Modals state
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login', // 'login' | 'signup'
    role: 'farmer' // 'farmer' | 'company' | 'skilled_worker'
  });

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [messageDrawer, setMessageDrawer] = useState({
    isOpen: false,
    targetUser: ''
  });

  const handleOpenAuth = (mode = 'login', role = 'farmer') => {
    setAuthModal({
      isOpen: true,
      mode,
      role
    });
  };

  const handleOpenMessage = (targetUser) => {
    setMessageDrawer({
      isOpen: true,
      targetUser
    });
  };

  // Render role-specific dashboard
  const renderDashboard = () => {
    if (!user) {
      return (
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Authentication Required</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Please sign in to access your role-specific agricultural dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => handleOpenAuth('login', 'farmer')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleOpenAuth('signup', 'farmer')}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentRole) {
      case 'company':
        return (
          <CompanyDashboard 
            onOpenJobModal={() => setJobModalOpen(true)}
            onOpenMessage={handleOpenMessage}
          />
        );
      case 'skilled_worker':
        return (
          <WorkerDashboard 
            onOpenMessage={handleOpenMessage}
            onOpenEquipmentModal={() => setEquipmentModalOpen(true)}
          />
        );
      case 'admin':
        return <AdminDeskPage />;
      case 'farmer':
      default:
        return (
          <FarmerDashboard 
            onOpenJobModal={() => setJobModalOpen(true)}
            onOpenMessage={handleOpenMessage}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar 
        onOpenAuth={handleOpenAuth} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main View Area */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'landing' && (
          <LandingPage 
            onOpenAuth={handleOpenAuth}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && renderDashboard()}

        {activeTab === 'jobs' && (
          <JobBoardPage 
            onOpenJobModal={() => setJobModalOpen(true)}
            onOpenMessage={handleOpenMessage}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplacePage 
            onOpenEquipmentModal={() => setEquipmentModalOpen(true)}
            onOpenMessage={handleOpenMessage}
          />
        )}

        {activeTab === 'admin' && <AdminDeskPage />}
      </main>

      {/* Footer */}
      <Footer 
        onOpenAuth={handleOpenAuth} 
        onNavigateTab={setActiveTab} 
      />

      {/* Global Modals */}
      <AuthModal 
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        initialRole={authModal.role}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
      />

      <JobPostModal 
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
      />

      <EquipmentModal 
        isOpen={equipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
      />

      <MessageDrawer 
        isOpen={messageDrawer.isOpen}
        targetUser={messageDrawer.targetUser}
        onClose={() => setMessageDrawer(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
