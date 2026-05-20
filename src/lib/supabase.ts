import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lqprxfokpkrstxpcklpc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_z6cUnoxTW8LozDQZ5Bfmgg_zIr80-H4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
