const { createClient } = require('@supabase/supabase-js');

const url = 'https://bvznflgxyoawdfqmilsj.supabase.co';
const key = 'sb_publishable_p6QT2vP6R-VYbehYbYPziQ_xjwqmP7-';

const supabase = createClient(url, key);

async function seed() {
  console.log("Seeding users...");
  const { data, error } = await supabase.from('users').insert([
    { name: 'kb', username: 'kb', password: 'admin', role: 'admin' },
    { name: 'Shivani', username: 'shivani', password: 'member', role: 'member' },
    { name: 'Anamika', username: 'anamika', password: 'member', role: 'member' }
  ]);
  
  if (error) {
    console.error("Error inserting users:", error);
  } else {
    console.log("Users inserted!");
  }
  
  const { data: sData, error: sError } = await supabase.from('settings').insert([
    { key: 'target_amount', value: '50000000' }
  ]);
  
  if (sError) {
    console.error("Error inserting settings:", sError);
  } else {
    console.log("Settings inserted!");
  }
}

seed();
