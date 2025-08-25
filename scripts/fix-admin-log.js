const { neon } = require('@neondatabase/serverless')
require('dotenv').config({ path: '.env.local' })

async function fixAdminLogTable() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    // Alter the admin_activity_log table to allow NULL admin_id
    await sql`ALTER TABLE admin_activity_log ALTER COLUMN admin_id DROP NOT NULL`
    console.log('✅ Admin activity log table updated to allow NULL admin_id')
  } catch (error) {
    console.log(
      'ℹ️  Table already allows NULL admin_id or error:',
      error.message
    )
  }
}

fixAdminLogTable()
