
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lyrmkxdcbrlhltujrmnw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cm1reGRjYnJsaGx0dWpybW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjYzNDEsImV4cCI6MjA1NTgwMjM0MX0.aN0ULym7NNR7tBOrcH9j9ddOIox71xUrPcajSEiqY60'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
