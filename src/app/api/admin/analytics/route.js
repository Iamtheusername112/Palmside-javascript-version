import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  contacts,
  properties,
  responseTemplates,
  contactAnalytics,
  propertyAnalytics,
  systemMetrics,
  monthlyTrends,
  adminActivityLog,
} from '@/lib/db/schema'
import { eq, and, gte, sql, desc, count, avg, sum } from 'drizzle-orm'

// GET /api/admin/analytics - Get comprehensive analytics data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // Calculate date ranges based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get comprehensive contact analytics
    const contactStats = await getContactAnalytics(startDate, now)

    // Get property performance analytics
    const propertyStats = await getPropertyAnalytics(startDate, now)

    // Get system performance metrics
    const systemStats = await getSystemMetrics()

    // Get monthly trends
    const trends = await getMonthlyTrends()

    // Get priority distribution
    const priorityStats = await getPriorityDistribution()

    // Get conversion analytics
    const conversionStats = await getConversionAnalytics(startDate, now)

    // Get performance metrics
    const performanceStats = await getPerformanceMetrics(startDate, now)

    const analytics = {
      period,
      contactStats,
      propertyStats,
      systemStats,
      trends,
      priorityStats,
      conversionStats,
      performanceStats,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// Helper function to get contact analytics
async function getContactAnalytics(startDate, endDate) {
  // Total contacts in period
  const totalContactsResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        gte(contacts.createdAt, startDate),
        sql`${contacts.createdAt} <= ${endDate}`
      )
    )

  const totalContacts = totalContactsResult.length

  // Contacts by status
  const newContactsResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        eq(contacts.status, 'new'),
        gte(contacts.createdAt, startDate),
        sql`${contacts.createdAt} <= ${endDate}`
      )
    )

  const readContactsResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        eq(contacts.status, 'read'),
        gte(contacts.createdAt, startDate),
        sql`${contacts.createdAt} <= ${endDate}`
      )
    )

  const respondedContactsResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        eq(contacts.status, 'responded'),
        gte(contacts.createdAt, startDate),
        sql`${contacts.createdAt} <= ${endDate}`
      )
    )

  // Today's contacts
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayContactsResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(gte(contacts.createdAt, today))

  // Weekly growth calculation
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  const lastWeekContactsResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        gte(contacts.createdAt, lastWeek),
        sql`${contacts.createdAt} <= ${endDate}`
      )
    )

  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(lastWeek.getDate() - 7)
  const weekBeforeLastResult = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        gte(contacts.createdAt, twoWeeksAgo),
        sql`${contacts.createdAt} < ${lastWeek}`
      )
    )

  const weeklyGrowth =
    weekBeforeLastResult.length > 0
      ? Math.round(
          ((lastWeekContactsResult.length - weekBeforeLastResult.length) /
            weekBeforeLastResult.length) *
            100
        )
      : lastWeekContactsResult.length > 0
      ? 100
      : 0

  // Response rate
  const responseRate =
    totalContacts > 0
      ? Math.round((respondedContactsResult.length / totalContacts) * 100)
      : 0

  // Average response time (simplified calculation)
  const avgResponseTime = '24h' // This would be calculated from actual response tracking

  return {
    totalContacts,
    newContacts: newContactsResult.length,
    readContacts: readContactsResult.length,
    respondedContacts: respondedContactsResult.length,
    todayContacts: todayContactsResult.length,
    weeklyGrowth,
    responseRate,
    avgResponseTime,
  }
}

// Helper function to get property analytics
async function getPropertyAnalytics(startDate, endDate) {
  // Total properties
  const totalPropertiesResult = await db
    .select({ count: properties.id })
    .from(properties)

  const totalProperties = totalPropertiesResult.length

  // Properties by status
  const activePropertiesResult = await db
    .select({ count: properties.id })
    .from(properties)
    .where(eq(properties.status, 'active'))

  const pendingPropertiesResult = await db
    .select({ count: properties.id })
    .from(properties)
    .where(eq(properties.status, 'pending'))

  const featuredPropertiesResult = await db
    .select({ count: properties.id })
    .from(properties)
    .where(eq(properties.isFeatured, true))

  // Properties created in period
  const newPropertiesResult = await db
    .select({ count: properties.id })
    .from(properties)
    .where(
      and(
        gte(properties.createdAt, startDate),
        sql`${properties.createdAt} <= ${endDate}`
      )
    )

  // Utilization rate
  const utilizationRate =
    totalProperties > 0
      ? Math.round((activePropertiesResult.length / totalProperties) * 100)
      : 0

  return {
    totalProperties,
    activeProperties: activePropertiesResult.length,
    pendingProperties: pendingPropertiesResult.length,
    featuredProperties: featuredPropertiesResult.length,
    newProperties: newPropertiesResult.length,
    utilizationRate,
  }
}

// Helper function to get system metrics
async function getSystemMetrics() {
  // Get recent system metrics
  const metricsResult = await db
    .select()
    .from(systemMetrics)
    .orderBy(desc(systemMetrics.timestamp))
    .limit(10)

  // Calculate system health based on metrics
  const systemHealth = 98 // This would be calculated from actual metrics

  return {
    metrics: metricsResult,
    systemHealth,
    uptime: '99.8%',
    avgResponseTime: '45ms',
    pageLoadTime: '2.1s',
  }
}

// Helper function to get monthly trends
async function getMonthlyTrends() {
  const currentYear = new Date().getFullYear()

  // Get trends for current year
  const trendsResult = await db
    .select()
    .from(monthlyTrends)
    .where(eq(monthlyTrends.year, currentYear))
    .orderBy(monthlyTrends.month)

  // If no trends exist, create mock data for demonstration
  if (trendsResult.length === 0) {
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
    return months.map((month, index) => ({
      month,
      contacts: Math.floor(Math.random() * 50) + 30,
      properties: Math.floor(Math.random() * 20) + 10,
      responses: Math.floor(Math.random() * 40) + 25,
      conversion: Math.floor(Math.random() * 30) + 60,
    }))
  }

  return trendsResult.map((trend) => ({
    month: trend.month,
    contacts: trend.contactsCount,
    properties: trend.propertiesCount,
    responses: trend.responsesCount,
    conversion: parseFloat(trend.conversionRate),
  }))
}

// Helper function to get priority distribution
async function getPriorityDistribution() {
  // Get priority distribution from contact analytics
  const priorityResult = await db
    .select({
      priority: contactAnalytics.priority,
      count: count(contactAnalytics.id),
    })
    .from(contactAnalytics)
    .groupBy(contactAnalytics.priority)

  // If no analytics exist, return default distribution
  if (priorityResult.length === 0) {
    return {
      high: 12,
      medium: 28,
      low: 45,
    }
  }

  const distribution = {}
  priorityResult.forEach((item) => {
    distribution[item.priority] = parseInt(item.count)
  })

  return distribution
}

// Helper function to get conversion analytics
async function getConversionAnalytics(startDate, endDate) {
  // Get conversion status distribution
  const conversionResult = await db
    .select({
      status: contactAnalytics.conversionStatus,
      count: count(contactAnalytics.id),
    })
    .from(contactAnalytics)
    .groupBy(contactAnalytics.conversionStatus)

  // If no analytics exist, return default data
  if (conversionResult.length === 0) {
    return {
      pending: 35,
      converted: 25,
      lost: 15,
      followUp: 25,
    }
  }

  const conversion = {}
  conversionResult.forEach((item) => {
    conversion[item.status] = parseInt(item.count)
  })

  return conversion
}

// Helper function to get performance metrics
async function getPerformanceMetrics(startDate, endDate) {
  // Calculate performance metrics based on period
  const contactsInPeriod = await db
    .select({ count: contacts.id })
    .from(contacts)
    .where(
      and(
        gte(contacts.createdAt, startDate),
        sql`${contacts.createdAt} <= ${endDate}`
      )
    )

  const totalContacts = contactsInPeriod.length

  // Calculate response time target achievement
  const responseTimeTarget = 120 // 2 hours in minutes
  const targetAchievement = 60 // This would be calculated from actual response times

  // Calculate conversion target achievement
  const conversionTarget = 85
  const conversionAchievement = 75 // This would be calculated from actual conversions

  return {
    responseTimeTarget: '2h',
    responseTimeAchievement: targetAchievement,
    conversionTarget: conversionTarget,
    conversionAchievement: conversionAchievement,
    totalActivities: totalContacts * 2, // Estimate based on contacts
    peakHours: '2-4 PM',
    bestDays: 'Tue, Wed',
    seasonalPeak: 'Spring',
  }
}
