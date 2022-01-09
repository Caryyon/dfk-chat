import { createClient } from "@supabase/supabase-js";

const URL = "https://jxwtipgaxkybilikjibm.supabase.co";
const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTUzNDQxOCwiZXhwIjoxOTU1MTEwNDE4fQ.cYPxhb4nWaUsxdYOuD9meiMMlnssp2rNLaYYbJmRcW8";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
