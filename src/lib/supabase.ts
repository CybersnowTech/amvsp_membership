import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfrsjpmtlrruztvfvwut.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcnNqcG10bHJydXp0dmZ2d3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxODYzMjksImV4cCI6MjA0NTc2MjMyOX0.MNU9TGMSWjPwZCfWX9OVeck70m5j4sRc-n6aHm2onco';

export const supabase = createClient(supabaseUrl, supabaseKey);