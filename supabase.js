import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkgxzrywbxouuvtovgpw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3h6cnl3YnhvdXV2dG92Z3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjIyNDMzMywiZXhwIjoyMDQxODAwMzMzfQ.iDPePOYI72gVdYKK7VoBnL0nL81THqg437tz2mhvueA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
