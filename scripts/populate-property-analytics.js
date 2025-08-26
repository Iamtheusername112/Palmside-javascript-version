const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

async function populatePropertyAnalytics() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('Populating property analytics with sample data...')

    // Get all existing properties
    const properties = await sql`
      SELECT id, title, status, is_featured, created_at 
      FROM properties 
      ORDER BY created_at DESC
    `

    console.log(`Found ${properties.length} properties to process`)

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

    console.log('✓ Property analytics populated successfully!')

    // Show summary
    const summary = await sql`
      SELECT 
        COUNT(*) as total_properties,
        AVG(views) as avg_views,
        AVG(inquiries) as avg_inquiries,
        AVG(conversion_rate) as avg_conversion_rate
      FROM property_analytics
    `

    console.log('\nProperty Analytics Summary:')
    console.log(`  Total Properties: ${summary[0].total_properties}`)
    console.log(`  Average Views: ${Math.round(summary[0].avg_views)}`)
    console.log(`  Average Inquiries: ${Math.round(summary[0].avg_inquiries)}`)
    console.log(
      `  Average Conversion Rate: ${summary[0].avg_conversion_rate.toFixed(2)}%`
    )
  } catch (error) {
    console.error('Error populating property analytics:', error)
  }
}

// Run the population
populatePropertyAnalytics()
