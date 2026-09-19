import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Ensure user is not auto-logged in
      if (data?.session) {
        await supabase.auth.signOut();
      }

      // Store in sessionStorage as fallback and redirect to Sign In with query parameters
      sessionStorage.setItem('signup_email', email);
      sessionStorage.setItem('signup_success', 'true');
      window.location.href = `/login?email=${encodeURIComponent(email)}&registered=true`;
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignUp} style={styles.form}>
        <h2 style={styles.title}>Sign Up</h2>

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {errorMessage && (
          <p style={styles.error} role="alert">
            {errorMessage}
          </p>
        )}
      </form>
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
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
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
