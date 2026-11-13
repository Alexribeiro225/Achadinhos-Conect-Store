import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getStoredSupabaseConfig = (): SupabaseConfig => {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const local = localStorage.getItem('conect_supabase_config');
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Erro ao ler configuração local do Supabase:', e);
  }

  return { url: '', anonKey: '' };
};

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  localStorage.setItem('conect_supabase_config', JSON.stringify(config));
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (!cachedClient) {
    try {
      cachedClient = createClient(config.url, config.anonKey);
    } catch (e) {
      console.error('Falha ao inicializar cliente Supabase:', e);
      return null;
    }
  }

  return cachedClient;
};

export const isSupabaseConfigured = (): boolean => {
  const config = getStoredSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};
