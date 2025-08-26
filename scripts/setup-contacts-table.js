const { drizzle } = require('drizzle-orm/neon-http')
const { neon } = require('@neondatabase/serverless')
const { migrate } = require('drizzle-orm/neon-http/migrator')

require('dotenv').config()

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function setupContactsTable() {
  try {
    console.log('Setting up contacts table...')

    // Run the migration
    await migrate(db, { migrationsFolder: './drizzle' })

    console.log('✅ Contacts table created successfully!')
    console.log(
      'You can now submit contact forms and they will be saved to the database.'
    )
  } catch (error) {
    console.error('❌ Error setting up contacts table:', error)
  } finally {
    process.exit(0)
  }
}

setupContactsTable()



