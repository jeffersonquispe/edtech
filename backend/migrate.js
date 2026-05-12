const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigrations() {
  try {
    const migrationFiles = [
      '001_profiles.sql',
      '002_categories.sql',
      '003_courses.sql',
      '004_lessons.sql',
      '005_enrollments.sql',
      '006_reviews.sql',
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, 'supabase/migrations', file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`⏳ Running ${file}...`);

      const { error } = await supabase.rpc('exec_sql', { sql }, {
        headers: { 'x-use-service-role': 'true' },
      });

      if (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        process.exit(1);
      }

      console.log(`✅ ${file} completed`);
    }

    console.log('\n✅ All migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigrations();
