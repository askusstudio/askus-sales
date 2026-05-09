const { createClient } = require('@supabase/supabase-js');

const url = 'https://bvznflgxyoawdfqmilsj.supabase.co';
const key = 'sb_publishable_p6QT2vP6R-VYbehYbYPziQ_xjwqmP7-';

const supabase = createClient(url, key);

async function check() {
  console.log("Checking Supabase connection...");
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("Error fetching users:", error);
  } else {
    console.log("Users fetched:", data);
  }
}

check();
