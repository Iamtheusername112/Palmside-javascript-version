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

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...')

    // Test connection
    const result = await sql`SELECT version()`
    console.log('✅ Database connection successful')
    console.log('📊 Database version:', result[0].version)

    // Create tables directly
    console.log('📝 Creating database tables...')

    // Properties table
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        image TEXT NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms DECIMAL(3,1) NOT NULL,
        sqft INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'For Sale',
        rating DECIMAL(3,1) DEFAULT 0.0,
        is_favorite BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Properties table created')

    // Admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Admin users table created')

    // Property images table
    await sql`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Property images table created')

    // Property views table
    await sql`
      CREATE TABLE IF NOT EXISTS property_views (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP DEFAULT NOW(),
        ip_address TEXT,
        user_agent TEXT
      )
    `
    console.log('✅ Property views table created')

    // Admin activity log table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admin_users(id),
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id INTEGER,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Admin activity log table created')

    // Contacts table
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
    console.log('✅ Contacts table created')

    console.log('')
    console.log('🎉 Database setup complete!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start your application: npm run dev')
    console.log('2. Visit: http://localhost:3000/admin')
    console.log('3. Sign in with Clerk to access the admin dashboard')
    console.log('4. Contact forms will now be saved to the database!')
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

setupDatabase()
