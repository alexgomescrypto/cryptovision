import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnpysphwjohiaqpyedwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucHlzcGh3am9oaWFxcHllZHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDI5ODEsImV4cCI6MjA2MjMxODk4MX0.u2j14xiFUUdedIB6HOJNQ6fPRdsCoFmnEGCSDYgSmuE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
