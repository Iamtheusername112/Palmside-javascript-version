import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function runMigration() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('🚀 Running migration to add unique constraints...\n')

    // Add unique constraint to contact_analytics.contact_id
    console.log('Adding unique constraint to contact_analytics.contact_id...')
    await sql`
      ALTER TABLE "contact_analytics" 
      ADD CONSTRAINT "contact_analytics_contact_id_unique" 
      UNIQUE ("contact_id")
    `
    console.log('✅ Unique constraint added to contact_analytics.contact_id')

    // Add unique constraint to property_analytics.property_id
    console.log('Adding unique constraint to property_analytics.property_id...')
    await sql`
      ALTER TABLE "property_analytics" 
      ADD CONSTRAINT "property_analytics_property_id_unique" 
      UNIQUE ("property_id")
    `
    console.log('✅ Unique constraint added to property_analytics.property_id')

    console.log('\n🎉 Migration completed successfully!')
    console.log('✅ Unique constraints added to analytics tables')
  } catch (error) {
    console.error('❌ Error running migration:', error)
  }
}

runMigration()
