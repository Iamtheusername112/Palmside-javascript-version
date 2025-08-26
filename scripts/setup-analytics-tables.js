const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

async function setupAnalyticsTables() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('Setting up analytics tables...')

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
    console.log('✓ Contact analytics table created')

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
    console.log('✓ Property analytics table created')

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
    console.log('✓ System metrics table created')

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
    console.log('✓ Monthly trends table created')

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS contact_analytics_contact_id_idx ON contact_analytics(contact_id)`
    await sql`CREATE INDEX IF NOT EXISTS contact_analytics_priority_idx ON contact_analytics(priority)`
    await sql`CREATE INDEX IF NOT EXISTS contact_analytics_conversion_status_idx ON contact_analytics(conversion_status)`
    await sql`CREATE INDEX IF NOT EXISTS property_analytics_property_id_idx ON property_analytics(property_id)`
    await sql`CREATE INDEX IF NOT EXISTS system_metrics_timestamp_idx ON system_metrics(timestamp)`
    await sql`CREATE INDEX IF NOT EXISTS monthly_trends_month_year_idx ON monthly_trends(month, year)`

    console.log('✓ Indexes created')

    // Insert some sample data for demonstration
    await insertSampleData(sql)

    console.log('✓ Analytics tables setup completed successfully!')
  } catch (error) {
    console.error('Error setting up analytics tables:', error)
  }
}

async function insertSampleData(sql) {
  try {
    // Insert sample system metrics
    await sql`
      INSERT INTO system_metrics (metric_name, metric_value, category) VALUES
      ('uptime', '99.8%', 'performance'),
      ('avg_response_time', '45ms', 'performance'),
      ('page_load_time', '2.1s', 'performance'),
      ('database_connections', '15', 'system'),
      ('active_users', '42', 'usage')
      ON CONFLICT DO NOTHING
    `

    // Insert sample monthly trends for current year
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
        (${months[i]}, ${currentYear}, ${
        Math.floor(Math.random() * 50) + 30
      }, ${Math.floor(Math.random() * 20) + 10}, ${
        Math.floor(Math.random() * 40) + 25
      }, ${Math.floor(Math.random() * 30) + 60})
        ON CONFLICT (month, year) DO NOTHING
      `
    }

    console.log('✓ Sample data inserted')
  } catch (error) {
    console.error('Error inserting sample data:', error)
  }
}

// Run the setup
setupAnalyticsTables()
