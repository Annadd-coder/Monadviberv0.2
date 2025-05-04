// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Подстраховка: если переменные окружения не подхватятся,
// используем дефолтные значения из вашего проекта.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://tltnsfotzvsbttigleve.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdG5zZm90enZzYnR0aWdsZXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTY4NjMsImV4cCI6MjA2MTE3Mjg2M30.bPyQ1DpKFrkp0s7-iz5d0_TuM7qo-O7O_pvbS6HEaYo';

// Инициализируем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey?.slice(0,4)+'…');