import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for email and registered flag in query params or sessionStorage fallback
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email') || sessionStorage.getItem('signup_email') || '';
    const isRegistered = searchParams.get('registered') === 'true' || sessionStorage.getItem('signup_success') === 'true';

    if (emailParam) {
      setEmail(emailParam);
    }

    if (isRegistered) {
      setSuccessMessage('Your account has been created. Please check your email and verify your address before logging in.');
      sessionStorage.removeItem('signup_success');
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data?.session) {
        // Only redirect when a real session exists after login
        window.location.href = '/';
      } else {
        setErrorMessage('Unable to start session. Please verify your credentials or check your email confirmation.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        {successMessage && (
          <div style={styles.successBanner} role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSignIn} style={styles.form}>
          <h2 style={styles.title}>Sign In</h2>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {errorMessage && (
            <p style={styles.error} role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
  },
  successBanner: {
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
    textAlign: 'center',
    fontWeight: '500',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  form: {
    width: '100%',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#4a4a4a',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: '#dc2626',
    fontSize: '13px',
    marginTop: '12px',
    textAlign: 'center',
  },
};
