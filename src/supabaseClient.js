import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CONFIGURATION
// Supports environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
// with configured platform defaults.
// ============================================================================

const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://hjrytnekrpiiakxeaenc.supabase.co';

const SUPABASE_PUBLIC_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_SsLGUaQ9jJse6gXdqJfbNw_WS2hO1sJ';

// Export initialized Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

/**
 * Google login function using Supabase OAuth.
 * Initiates the Google OAuth sign-in flow via Supabase client.
 */
export const signInWithGoogle = async (options = {}) => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      ...options,
    },
  });
};
