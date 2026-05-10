const { createClient } = require('@supabase/supabase-js');

const url = 'https://bvznflgxyoawdfqmilsj.supabase.co';
const key = 'sb_publishable_p6QT2vP6R-VYbehYbYPziQ_xjwqmP7-';

const supabase = createClient(url, key);

async function alter() {
  console.log("Altering tables (doing it manually is better but let's see if we can do an RPC or something). Wait, we cannot run arbitrary SQL via supabase-js without an RPC.");
}

alter();
