import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

/**
 * Route protection wrapper component.
 * Uses supabase.auth.getSession() to verify an active session.
 * If no session is found, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          window.location.href = '/login';
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        window.location.href = '/login';
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    // Listen for auth state changes (e.g., sign out in another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        window.location.href = '/login';
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#4a4a4a',
  },
  loadingText: {
    fontSize: '16px',
  },
};
