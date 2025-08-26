const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

async function populateContactAnalytics() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('Populating contact analytics with real data...')

    // Get all existing contacts
    const contacts = await sql`
      SELECT id, status, created_at, updated_at 
      FROM contacts 
      ORDER BY created_at DESC
    `

    console.log(`Found ${contacts.length} contacts to process`)

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

    console.log('✓ Contact analytics populated successfully!')

    // Show summary
    const summary = await sql`
      SELECT 
        priority,
        conversion_status,
        COUNT(*) as count
      FROM contact_analytics 
      GROUP BY priority, conversion_status
      ORDER BY priority, conversion_status
    `

    console.log('\nAnalytics Summary:')
    summary.forEach((row) => {
      console.log(
        `  ${row.priority} priority, ${row.conversion_status}: ${row.count}`
      )
    })
  } catch (error) {
    console.error('Error populating contact analytics:', error)
  }
}

// Run the population
populateContactAnalytics()
