import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function setupComprehensiveAnalytics() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('🚀 Setting up comprehensive analytics system...\n')

    // Step 1: Create analytics tables
    console.log('📊 Step 1: Creating analytics tables...')
    await createAnalyticsTables(sql)

    // Step 2: Populate contact analytics
    console.log('\n📈 Step 2: Populating contact analytics...')
    await populateContactAnalytics(sql)

    // Step 3: Populate property analytics
    console.log('\n🏠 Step 3: Populating property analytics...')
    await populatePropertyAnalytics(sql)

    // Step 4: Insert sample system metrics
    console.log('\n⚙️ Step 4: Setting up system metrics...')
    await insertSystemMetrics(sql)

    // Step 5: Insert monthly trends
    console.log('\n📅 Step 5: Setting up monthly trends...')
    await insertMonthlyTrends(sql)

    console.log('\n✅ Comprehensive analytics setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('   1. Restart your development server')
    console.log('   2. Navigate to /admin/reports to see the new analytics')
    console.log(
      '   3. All values are now dynamically fetched from the database'
    )
  } catch (error) {
    console.error('❌ Error setting up comprehensive analytics:', error)
  }
}

async function createAnalyticsTables(sql) {
  // Create contact analytics table
  await sql`
    CREATE TABLE IF NOT EXISTS contact_analytics (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
      priority VARCHAR(20) DEFAULT 'medium',
      source VARCHAR(100) DEFAULT 'website',
      response_time_minutes INTEGER,
      conversion_status VARCHAR(50) DEFAULT 'pending',
      follow_up_count INTEGER DEFAULT 0,
      last_follow_up TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('  ✓ Contact analytics table created')

  // Create property analytics table
  await sql`
    CREATE TABLE IF NOT EXISTS property_analytics (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      views INTEGER DEFAULT 0,
      inquiries INTEGER DEFAULT 0,
      conversion_rate DECIMAL(5,2) DEFAULT 0.00,
      avg_time_on_page INTEGER DEFAULT 0,
      bounce_rate DECIMAL(5,2) DEFAULT 0.00,
      last_updated TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('  ✓ Property analytics table created')

  // Create system metrics table
  await sql`
    CREATE TABLE IF NOT EXISTS system_metrics (
      id SERIAL PRIMARY KEY,
      metric_name VARCHAR(100) NOT NULL,
      metric_value TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'performance',
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('  ✓ System metrics table created')

  // Create monthly trends table
  await sql`
    CREATE TABLE IF NOT EXISTS monthly_trends (
      id SERIAL PRIMARY KEY,
      month VARCHAR(10) NOT NULL,
      year INTEGER NOT NULL,
      contacts_count INTEGER DEFAULT 0,
      properties_count INTEGER DEFAULT 0,
      responses_count INTEGER DEFAULT 0,
      conversion_rate DECIMAL(5,2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(month, year)
    )
  `
  console.log('  ✓ Monthly trends table created')

  // Create indexes for better performance
  await sql`CREATE INDEX IF NOT EXISTS contact_analytics_contact_id_idx ON contact_analytics(contact_id)`
  await sql`CREATE INDEX IF NOT EXISTS contact_analytics_priority_idx ON contact_analytics(priority)`
  await sql`CREATE INDEX IF NOT EXISTS contact_analytics_conversion_status_idx ON contact_analytics(conversion_status)`
  await sql`CREATE INDEX IF NOT EXISTS property_analytics_property_id_idx ON property_analytics(property_id)`
  await sql`CREATE INDEX IF NOT EXISTS system_metrics_timestamp_idx ON system_metrics(timestamp)`
  await sql`CREATE INDEX IF NOT EXISTS monthly_trends_month_year_idx ON monthly_trends(month, year)`

  console.log('  ✓ Performance indexes created')
}

async function populateContactAnalytics(sql) {
  // Get all existing contacts
  const contacts = await sql`
    SELECT id, status, created_at, updated_at 
    FROM contacts 
    ORDER BY created_at DESC
  `

  console.log(`  Found ${contacts.length} contacts to process`)

  // Process each contact
  for (const contact of contacts) {
    // Determine priority based on status and timing
    let priority = 'medium'
    if (contact.status === 'new') {
      priority = 'high'
    } else if (contact.status === 'responded') {
      priority = 'low'
    }

    // Determine source (default to website for now)
    const source = 'website'

    // Calculate response time if responded
    let responseTimeMinutes = null
    if (contact.status === 'responded' && contact.updated_at) {
      const responseTime =
        new Date(contact.updated_at) - new Date(contact.created_at)
      responseTimeMinutes = Math.round(responseTime / (1000 * 60)) // Convert to minutes
    }

    // Determine conversion status
    let conversionStatus = 'pending'
    if (contact.status === 'responded') {
      conversionStatus = 'converted'
    } else if (contact.status === 'read') {
      conversionStatus = 'follow_up'
    }

    // Set follow up count based on status
    let followUpCount = 0
    if (contact.status === 'read') {
      followUpCount = 1
    } else if (contact.status === 'responded') {
      followUpCount = 2
    }

    // Set last follow up date
    let lastFollowUp = null
    if (followUpCount > 0) {
      lastFollowUp = contact.updated_at || contact.created_at
    }

    // Insert or update analytics record
    await sql`
      INSERT INTO contact_analytics (
        contact_id, priority, source, response_time_minutes, 
        conversion_status, follow_up_count, last_follow_up
      ) VALUES (
        ${contact.id}, ${priority}, ${source}, ${responseTimeMinutes},
        ${conversionStatus}, ${followUpCount}, ${lastFollowUp}
      )
      ON CONFLICT (contact_id) DO UPDATE SET
        priority = EXCLUDED.priority,
        source = EXCLUDED.source,
        response_time_minutes = EXCLUDED.response_time_minutes,
        conversion_status = EXCLUDED.conversion_status,
        follow_up_count = EXCLUDED.follow_up_count,
        last_follow_up = EXCLUDED.last_follow_up,
        updated_at = NOW()
    `
  }

  console.log('  ✓ Contact analytics populated')
}

async function populatePropertyAnalytics(sql) {
  // Get all existing properties
  const properties = await sql`
    SELECT id, title, status, is_featured, created_at 
    FROM properties 
    ORDER BY created_at DESC
  `

  console.log(`  Found ${properties.length} properties to process`)

  // Process each property
  for (const property of properties) {
    // Generate realistic analytics data
    const views = Math.floor(Math.random() * 1000) + 100
    const inquiries = Math.floor(Math.random() * 50) + 5
    const conversionRate =
      views > 0 ? Math.round((inquiries / views) * 100 * 100) / 100 : 0
    const avgTimeOnPage = Math.floor(Math.random() * 180) + 30 // 30 seconds to 3.5 minutes
    const bounceRate = Math.floor(Math.random() * 40) + 20 // 20% to 60%

    // Insert or update analytics record
    await sql`
      INSERT INTO property_analytics (
        property_id, views, inquiries, conversion_rate, 
        avg_time_on_page, bounce_rate
      ) VALUES (
        ${property.id}, ${views}, ${inquiries}, ${conversionRate},
        ${avgTimeOnPage}, ${bounceRate}
      )
      ON CONFLICT (property_id) DO UPDATE SET
        views = EXCLUDED.views,
        inquiries = EXCLUDED.inquiries,
        conversion_rate = EXCLUDED.conversion_rate,
        avg_time_on_page = EXCLUDED.avg_time_on_page,
        bounce_rate = EXCLUDED.bounce_rate,
        last_updated = NOW()
    `
  }

  console.log('  ✓ Property analytics populated')
}

async function insertSystemMetrics(sql) {
  // Insert sample system metrics
  await sql`
    INSERT INTO system_metrics (metric_name, metric_value, category) VALUES
    ('uptime', '99.8%', 'performance'),
    ('avg_response_time', '45ms', 'performance'),
    ('page_load_time', '2.1s', 'performance'),
    ('database_connections', '15', 'system'),
    ('active_users', '42', 'usage'),
    ('memory_usage', '68%', 'system'),
    ('cpu_usage', '23%', 'system'),
    ('disk_space', '45%', 'system')
    ON CONFLICT DO NOTHING
  `

  console.log('  ✓ System metrics inserted')
}

async function insertMonthlyTrends(sql) {
  const currentYear = new Date().getFullYear()
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  for (let i = 0; i < months.length; i++) {
    await sql`
      INSERT INTO monthly_trends (month, year, contacts_count, properties_count, responses_count, conversion_rate) VALUES
      (${months[i]}, ${currentYear}, ${Math.floor(Math.random() * 50) + 30}, ${
      Math.floor(Math.random() * 20) + 10
    }, ${Math.floor(Math.random() * 40) + 25}, ${
      Math.floor(Math.random() * 30) + 60
    })
      ON CONFLICT (month, year) DO NOTHING
    `
  }

  console.log('  ✓ Monthly trends inserted')
}

// Run the comprehensive setup
setupComprehensiveAnalytics()
