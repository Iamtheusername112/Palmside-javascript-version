import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../src/lib/db/schema.js'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.log(
    'Please create a .env.local file with your database connection string'
  )
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql, { schema })

async function initDatabase() {
  try {
    console.log('🚀 Initializing database...')

    // Test connection
    const result = await sql`SELECT version()`
    console.log('✅ Database connection successful')
    console.log('📊 Database version:', result[0].version)

    // Create tables (this will be handled by Drizzle migrations)
    console.log('📝 Database schema ready for migrations')
    console.log('')
    console.log('Next steps:')
    console.log('1. Run: npm run db:generate (generates migration files)')
    console.log('2. Run: npm run db:push (pushes schema directly to database)')
    console.log('3. Start your application: npm run dev')
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    process.exit(1)
  }
}

initDatabase()
