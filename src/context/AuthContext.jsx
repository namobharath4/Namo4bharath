import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize user and profile on mount & auth changes
  useEffect(() => {
    let isMounted = true;

    async function loadUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          const userProfile = await dbService.getProfile(session.user.id);
          
          if (!isMounted) return;
          if (userProfile) {
            setProfile(userProfile);
          } else {
            // Build profile from user metadata if profile row isn't yet created
            const meta = session.user.user_metadata || {};
            const initialProfile = {
              user_id: session.user.id,
              email: session.user.email,
              role: meta.role || 'farmer',
              name: meta.full_name || session.user.email?.split('@')[0] || 'User',
              full_name: meta.full_name || session.user.email?.split('@')[0] || 'User',
              phone: meta.phone || '',
              location: meta.location || meta.district || 'Guntur, Andhra Pradesh',
              district: meta.district || 'Guntur',
              state: meta.state || 'Andhra Pradesh',
              is_verified: false
            };
            setProfile(initialProfile);
            await dbService.updateProfile(session.user.id, initialProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Supabase session load:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUserSession();

    // Listen for real auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const userProfile = await dbService.getProfile(session.user.id);
        const meta = session.user.user_metadata || {};
        const activeProfile = userProfile || {
          user_id: session.user.id,
          email: session.user.email,
          role: meta.role || 'farmer',
          name: meta.full_name || session.user.email?.split('@')[0] || 'User',
          full_name: meta.full_name || session.user.email?.split('@')[0] || 'User',
          phone: meta.phone || '',
          location: meta.location || 'Guntur, Andhra Pradesh',
          is_verified: false
        };
        setProfile(activeProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Real Supabase Email/Password Login
  const login = async (email, password, expectedRole = null) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.session?.user) {
        const u = data.session.user;
        setUser(u);

        // Fetch database profile
        let userProfile = await dbService.getProfile(u.id);
        const meta = u.user_metadata || {};
        const resolvedRole = userProfile?.role || meta.role || expectedRole || 'farmer';

        if (!userProfile) {
          userProfile = {
            user_id: u.id,
            email: u.email,
            role: resolvedRole,
            name: meta.full_name || u.email?.split('@')[0] || 'User',
            full_name: meta.full_name || u.email?.split('@')[0] || 'User',
            phone: meta.phone || '',
            location: meta.location || 'Guntur, Andhra Pradesh',
            is_verified: false
          };
          await dbService.updateProfile(u.id, userProfile);
        }

        setProfile(userProfile);
        return { success: true, user: userProfile };
      }

      return { success: false, error: 'No active session established.' };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  // Real Supabase Email/Password Registration
  const signUp = async ({ email, password, role = 'farmer', fullName, metadata = {} }) => {
    try {
      const trimmedEmail = email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            ...metadata
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const createdUser = data?.user;
      if (createdUser) {
        // Initialize real profile record
        const newProfile = {
          user_id: createdUser.id,
          email: trimmedEmail,
          role,
          name: fullName || trimmedEmail.split('@')[0],
          full_name: fullName || trimmedEmail.split('@')[0],
          phone: metadata.phone || '',
          location: metadata.location || 'Guntur, Andhra Pradesh',
          district: metadata.district || 'Guntur',
          state: metadata.state || 'Andhra Pradesh',
          farm_name: metadata.farm_name || '',
          farm_size_acres: metadata.farm_size_acres || null,
          company_name: metadata.company_name || '',
          registration_number: metadata.registration_number || '',
          license_number: metadata.license_number || '',
          skills: metadata.skills || [],
          tools_owned: metadata.tools_owned || [],
          daily_rate: metadata.daily_rate || null,
          is_verified: false,
          created_at: new Date().toISOString()
        };

        await dbService.updateProfile(createdUser.id, newProfile);
        if (data.session) {
          setUser(createdUser);
          setProfile(newProfile);
        }
      }

      return {
        success: true,
        session: data?.session,
        user: createdUser,
        requiresEmailConfirmation: !data?.session
      };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) return null;
    const updated = await dbService.updateProfile(user.id, updates);
    setProfile(prev => ({ ...prev, ...updated }));
    return updated;
  };

  // Upload user profile avatar to Supabase Storage "app-files" bucket
  const uploadAvatar = async (file) => {
    if (!user || !file) return null;
    try {
      const uploadRes = await storageService.uploadFile({
        file,
        userId: user.id,
        featureName: 'avatar',
        itemId: 'profile'
      });
      // Updates profile in DB and triggers cleanup of any previous avatar
      const updated = await updateProfile({ avatar_url: uploadRes.path });
      return updated;
    } catch (err) {
      console.error('Failed to upload avatar to Supabase Storage:', err);
      throw err;
    }
  };

  // Delete user profile avatar from Storage and DB
  const deleteAvatar = async () => {
    if (!user) return null;
    try {
      await dbService.deleteAvatar(user.id);
      setProfile(prev => ({ ...prev, avatar_url: null }));
      return true;
    } catch (err) {
      console.error('Failed to delete avatar:', err);
      throw err;
    }
  };

  // Google OAuth Login via Supabase
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || 'Google sign-in failed.' };
    }
  };

  // Real Supabase Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut exception:', err.message);
    }
    setUser(null);
    setProfile(null);
  };

  const currentRole = profile?.role || user?.user_metadata?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signUp,
        signInWithGoogle,
        logout,
        updateProfile,
        uploadAvatar,
        deleteAvatar,
        isAuthenticated: !!user,
        currentRole
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
