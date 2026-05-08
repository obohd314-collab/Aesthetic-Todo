/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const supabase = (): SupabaseClient => {
  if (!supabaseClient) {
    // Falls back to provided credentials if environment variables are missing
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://onvcpqaddeolbbqrqvhy.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9nfTLyIEgaxw_8_xFETRag_kTFwCfM5';

    if (!supabaseUrl) {
      throw new Error('Supabase URL is missing. Please set VITE_SUPABASE_URL in your environment.');
    }
    if (!supabaseAnonKey) {
      throw new Error('Supabase Anon Key is missing. Please set VITE_SUPABASE_ANON_KEY in your environment.');
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};
