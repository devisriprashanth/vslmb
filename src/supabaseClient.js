import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ifcivkmccvwvtcttucrc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2l2a21jY3Z3dnRjdHR1Y3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1Nzg4NTksImV4cCI6MjA1NjE1NDg1OX0.hUqFSofFvU-8zeG7ze7jQoxCXCyHqK72mOpslr_fc7o";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; // ✅ This is correct
