const { drizzle } = require('drizzle-orm/neon-http')
const { neon } = require('@neondatabase/serverless')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function setupTemplatesTable() {
  try {
    console.log('Setting up response templates table...')

    // Read and execute the migration SQL
    const fs = require('fs')

    const migrationPath = path.join(
      __dirname,
      '../drizzle/0002_add_response_templates_table.sql'
    )
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...')
        await sql(statement + ';')
      }
    }

    console.log('✅ Response templates table setup completed successfully!')

    // Verify the table was created
    const result = await sql('SELECT COUNT(*) FROM response_templates')
    console.log('📊 Templates count:', result[0].count)
  } catch (error) {
    console.error('❌ Error setting up templates table:', error)
    process.exit(1)
  }
}

setupTemplatesTable()
