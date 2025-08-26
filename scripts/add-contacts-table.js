import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.log(
    'Please create a .env.local file with your database connection string'
  )
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function addContactsTable() {
  try {
    console.log('🚀 Adding contacts table to existing database...')

    // Test connection
    const result = await sql`SELECT version()`
    console.log('✅ Database connection successful')

    // Create contacts table
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Contacts table created successfully!')
    console.log('')
    console.log('🎉 Contact forms will now be saved to the database!')
    console.log(
      'You can test this by submitting a contact form on your website.'
    )
  } catch (error) {
    console.error('❌ Failed to add contacts table:', error.message)
    process.exit(1)
  }
}

addContactsTable()




