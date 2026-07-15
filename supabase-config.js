import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://hirgkfhklwtbiajpxhaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcmdrZmhrbHd0YmlhanB4aGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzg3NzUsImV4cCI6MjA5OTYxNDc3NX0.mrHTOZIwnFG41FhZSsr8pRWH7-cCXfEH3ILj-Sh3U1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
