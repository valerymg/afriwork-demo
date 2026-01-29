import { supabase } from './supabase';

// Simple analytics: track page views via Supabase
// Table: page_views (path TEXT, referrer TEXT, created_at TIMESTAMPTZ)
// Run this SQL in Supabase to create the table:
// CREATE TABLE page_views (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), path TEXT NOT NULL, referrer TEXT, user_agent TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
// ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "anyone_insert" ON page_views FOR INSERT WITH CHECK (true);
// CREATE POLICY "admin_select" ON page_views FOR SELECT USING (true);

let tracked = false;

export function trackPageView(path: string) {
  // Only track once per page load to avoid duplicates
  const key = `pv_${path}`;
  if (tracked && sessionStorage.getItem(key)) return;
  tracked = true;
  sessionStorage.setItem(key, '1');

  supabase
    .from('page_views')
    .insert({
      path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent.slice(0, 200),
    })
    .then(() => {});
}
