import { createClient } from '@supabase/supabase-js';

const URL = "https://oqlhfioqfmzhzwzxxcav.supabase.co";
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbGhmaW9xZm16aHp3enh4Y2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzOTYxNTcsImV4cCI6MjA3MDk3MjE1N30.HJSug4zqYwteZNfwCaosycqB1PozaUiwuRN3zdPgaL4';

export const supabase = createClient(URL, API_KEY);