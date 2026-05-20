import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tfbcdcrlhsxvlufmnzdr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYmNkY3JsaHN4dmx1Zm1uemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDg2MTIsImV4cCI6MjA4OTg4NDYxMn0.B6a8rFeSof5Ei8rOtwrhQu7QtRcEBt9BTxy0_cu49b0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
