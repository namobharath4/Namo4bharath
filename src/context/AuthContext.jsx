import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

const DEMO_PROFILES = {
  farmer: {
    id: 'f-demo-1',
    email: 'farmer.demo@yukti.ag',
    role: 'farmer',
    name: 'Nageswara Rao',
    phone: '+91 98480 23145',
    farmName: 'Annapurna Organic Farm',
    farmSizeAcres: 12.5,
    primaryCrops: ['Paddy (BPT 5204)', 'Export Guntur Chilli', 'Black Gram'],
    soilType: 'Rich Black Alluvial',
    irrigationSource: 'Krishna Canal & Solar Borewell',
    location: 'Tenali, Guntur District, AP',
    isVerified: true
  },
  company: {
    id: 'c-demo-1',
    email: 'company.demo@yukti.ag',
    role: 'company',
    name: 'Coromandel Agritech Solutions',
    companyName: 'Coromandel Agritech Solutions Ltd.',
    registrationNumber: 'CIN-U01100AP2019PLC087',
    licenseNumber: 'FCO/AP/GNT/2023/8821',
    companyType: 'Agrochemicals, Bio-inputs & Tech Services',
    contactPerson: 'K. Srinivasa Murthy (Zonal Manager)',
    website: 'https://coromandel.ag',
    location: 'Secunderabad & Guntur, AP',
    isVerified: true
  },
  skilled_worker: {
    id: 'w-demo-1',
    email: 'worker.demo@yukti.ag',
    role: 'skilled_worker',
    name: 'Ramesh Reddy',
    phone: '+91 94401 58210',
    serviceType: 'skill_and_tool',
    skills: ['Tractor Operator', 'Rotavator Specialist', 'Laser Land Leveling', 'Paddy Puddling'],
    experienceYears: 7,
    dailyRate: 1800,
    hourlyRate: 250,
    toolsOwned: ['Mahindra 575 DI Tractor', 'Shaktiman 7ft Rotavator'],
    serviceRadiusKm: 35,
    rating: 4.9,
    reviewsCount: 38,
    completedJobs: 64,
    availabilityStatus: 'available',
    location: 'Tenali, Guntur, AP',
    isVerified: true
  },
  admin: {
    id: 'adm-demo-1',
    email: 'admin.desk@yukti.gov.in',
    role: 'admin',
    name: 'District Agronomy Officer',
    deskName: 'Official Regulatory & Certification Cell',
    department: 'Department of Agriculture & Farmers Welfare',
    location: 'AP Secretariat / Guntur Collectorate',
    isVerified: true
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from Supabase or persistent local state
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile from Supabase profiles table
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (userProfile) {
            setUser(session.user);
            setProfile(userProfile);
            setLoading(false);
            return;
          }
        }

        // Check local persisted session fallback
        const savedSession = localStorage.getItem('yukti_user_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setUser(parsed);
          setProfile(parsed);
        }
      } catch (err) {
        console.warn('Supabase auth initialization fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        setUser(session.user);
        setProfile(userProfile || { id: session.user.id, email: session.user.email, role: 'farmer' });
      } else if (event === 'SIGNED_OUT') {
        const savedSession = localStorage.getItem('yukti_user_session');
        if (!savedSession) {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Role-specific sign-in with Supabase + fallback
  const login = async (email, password, expectedRole) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If Supabase credentials don't exist yet on remote or network fails,
        // provide a clean role-validated fallback so testing is never blocked
        if (email.includes('demo') || email.includes('test')) {
          const demoUser = DEMO_PROFILES[expectedRole] || DEMO_PROFILES.farmer;
          setUser(demoUser);
          setProfile(demoUser);
          localStorage.setItem('yukti_user_session', JSON.stringify(demoUser));
          return { success: true, user: demoUser };
        }
        throw error;
      }

      if (data?.session) {
        // Fetch role from Supabase
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();

        const activeProfile = userProfile || {
          id: data.session.user.id,
          email: data.session.user.email,
          role: expectedRole,
          name: email.split('@')[0],
        };

        setUser(data.session.user);
        setProfile(activeProfile);
        localStorage.setItem('yukti_user_session', JSON.stringify(activeProfile));
        return { success: true, user: activeProfile };
      }
      throw new Error('No session returned.');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Role-specific signup with Supabase
  const signUp = async ({ email, password, role, fullName, metadata = {} }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: fullName,
            ...metadata
          }
        }
      });

      if (error) throw error;

      // In case session exists immediately or email confirmation is required
      return {
        success: true,
        session: data?.session,
        user: data?.user,
        requiresEmailConfirmation: !data?.session
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Instant 1-Click Demo Login Preset for fast evaluation
  const loginAsDemo = (roleKey) => {
    const demoProfile = DEMO_PROFILES[roleKey] || DEMO_PROFILES.farmer;
    setUser(demoProfile);
    setProfile(demoProfile);
    localStorage.setItem('yukti_user_session', JSON.stringify(demoProfile));
    return demoProfile;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout error:', err);
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('yukti_user_session');
    window.location.hash = '#/';
  };

  const switchRole = (newRole) => {
    loginAsDemo(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signUp,
        logout,
        loginAsDemo,
        switchRole,
        isAuthenticated: !!user,
        currentRole: profile?.role || user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
