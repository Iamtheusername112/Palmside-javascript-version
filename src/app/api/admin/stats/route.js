import { NextResponse } from 'next/server'
import { sql } from '@/lib/db/connection'

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    // Get total properties count
    const totalPropertiesResult = await sql`
      SELECT COUNT(*) as total FROM properties
    `
    const totalProperties = parseInt(totalPropertiesResult[0].total)

    // Get properties by status
    const statusCountsResult = await sql`
      SELECT status, COUNT(*) as count 
      FROM properties 
      GROUP BY status
    `
    const statusCounts = statusCountsResult.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count)
      return acc
    }, {})

    // Get featured properties count
    const featuredPropertiesResult = await sql`
      SELECT COUNT(*) as count FROM properties WHERE is_featured = true
    `
    const featuredProperties = parseInt(featuredPropertiesResult[0].count)

    // Get total property views
    const totalViewsResult = await sql`
      SELECT COUNT(*) as total FROM property_views
    `
    const totalViews = parseInt(totalViewsResult[0].total)

    // Get recent properties (last 7 days)
    const recentPropertiesResult = await sql`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `
    const recentProperties = parseInt(recentPropertiesResult[0].count)

    // Get properties by type
    const typeCountsResult = await sql`
      SELECT type, COUNT(*) as count 
      FROM properties 
      GROUP BY type
    `
    const typeCounts = typeCountsResult.reduce((acc, row) => {
      acc[row.type] = parseInt(row.count)
      return acc
    }, {})

    // Get recent admin activities
    const recentActivitiesResult = await sql`
      SELECT 
        al.id as log_id,
        al.action,
        al.entity_type,
        al.entity_id,
        al.details,
        al.created_at,
        p.title as property_title
      FROM admin_activity_log al
      LEFT JOIN properties p ON al.entity_id = p.id AND al.entity_type = 'property'
      ORDER BY al.created_at DESC
      LIMIT 10
    `

    const recentActivities = recentActivitiesResult.map((activity, index) => ({
      id: `activity_${Date.now()}_${index}`,
      action: activity.action,
      property: activity.property_title || 'N/A',
      time: activity.created_at,
      admin: 'Admin', // You can add admin user info later
      details: activity.details,
    }))

    // Calculate month-over-month growth
    const currentMonthResult = await sql`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE created_at >= DATE_TRUNC('month', NOW())
    `
    const currentMonth = parseInt(currentMonthResult[0].count)

    const lastMonthResult = await sql`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
      AND created_at < DATE_TRUNC('month', NOW())
    `
    const lastMonth = parseInt(lastMonthResult[0].count)

    const growthPercentage =
      lastMonth > 0
        ? Math.round(((currentMonth - lastMonth) / lastMonth) * 100)
        : currentMonth > 0
        ? 100
        : 0

    const stats = {
      totalProperties: {
        value: totalProperties.toString(),
        change: `${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%`,
        changeType: growthPercentage >= 0 ? 'positive' : 'negative',
      },
      activeProperties: {
        value:
          (statusCounts['For Sale'] || 0) + (statusCounts['For Rent'] || 0),
        change: '+0%',
        changeType: 'positive',
      },
      featuredProperties: {
        value: featuredProperties.toString(),
        change: '+0%',
        changeType: 'positive',
      },
      totalViews: {
        value: totalViews.toLocaleString(),
        change: '+0%',
        changeType: 'positive',
      },
    }

    return NextResponse.json({
      stats,
      statusCounts,
      typeCounts,
      recentActivities,
      summary: {
        totalProperties,
        featuredProperties,
        totalViews,
        recentProperties,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
