import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CONFIGURATION
// Replace the values below with your own Supabase project credentials if needed.
// ============================================================================

// 1. Paste your Supabase Project URL here:
const SUPABASE_URL = 'https://hjrytnekrpiiakxeaenc.supabase.co';

// 2. Paste your Supabase Anon / Public API Key here:
const SUPABASE_PUBLIC_KEY = 'sb_publishable_SsLGUaQ9jJse6gXdqJfbNw_WS2hO1sJ';

// Export initialized Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
