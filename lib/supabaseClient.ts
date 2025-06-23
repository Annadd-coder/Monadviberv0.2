// lib/supabaseClient.ts   (можешь сохранить как .js — без типов всё то же)
import { createClient } from '@supabase/supabase-js';

/**
 *   1. Берём из ENV, если они заданы в системе / на Vercel.
 *   2. Иначе используем ВАШИ дефолтные значения.
 *   ───────────────────────────────────────────────────────
 *   ⚠️  Помни: коммитить приватный ключ в публичный репо =
 *      = любой сможет пользоваться твоей базой.  Если делаете
 *        это сознательно (тестовый проект, public-anon key) —
 *        окей, просто имей в виду.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://tltnsfotzvsbttigleve.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdG5zZm90enZzYnR0aWdsZXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTY4NjMsImV4cCI6MjA2MTE3Mjg2M30.bPyQ1DpKFrkp0s7-iz5d0_TuM7qo-O7O_pvbS6HEaYo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Просто для контроля в консоли ‒ можно убрать
console.log('[supabase] URL  →', supabaseUrl);
console.log('[supabase] KEY  →', supabaseKey.slice(0, 4) + '…');