-- 1. Add user_id to entries table
ALTER TABLE entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Enable RLS and create owner-only policy
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner full access" ON entries;
CREATE POLICY "Owner full access" ON entries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. PAN format constraint (server-side validation)
ALTER TABLE entries DROP CONSTRAINT IF EXISTS valid_pan_format;
ALTER TABLE entries ADD CONSTRAINT valid_pan_format
  CHECK (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$');

-- 4. Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'INSERT','UPDATE','DELETE','EXPORT_CSV','EXPORT_PDF'
  table_name TEXT DEFAULT 'entries',
  record_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Audit trigger function
CREATE OR REPLACE FUNCTION log_audit() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, details)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, 
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    CASE WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', OLD, 'new', NEW)
         WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
         WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) END);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach audit trigger to entries table
DROP TRIGGER IF EXISTS audit_entries ON entries;
CREATE TRIGGER audit_entries AFTER INSERT OR UPDATE OR DELETE ON entries
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- 7. RLS on audit_log (owner read-only)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owner reads audit" ON audit_log;
CREATE POLICY "Owner reads audit" ON audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- 8. After creating your user in Supabase Auth, run this to assign existing data:
-- UPDATE entries SET user_id = 'YOUR_USER_UUID_HERE' WHERE user_id IS NULL;