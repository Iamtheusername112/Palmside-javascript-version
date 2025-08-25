import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts, properties, responseTemplates } from '@/lib/db/schema'
import { eq, and, gte, sql } from 'drizzle-orm'

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    // Get total contacts count
    const totalContactsResult = await db
      .select({ count: contacts.id })
      .from(contacts)
    const totalContacts = totalContactsResult.length

    // Get new contacts count (unread)
    const newContactsResult = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(eq(contacts.status, 'new'))
    const newContacts = newContactsResult.length

    // Get read contacts count
    const readContactsResult = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(eq(contacts.status, 'read'))
    const readContacts = readContactsResult.length

    // Get responded contacts count
    const respondedContactsResult = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(eq(contacts.status, 'responded'))
    const respondedContacts = respondedContactsResult.length

    // Get today's contacts count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayContactsResult = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(gte(contacts.createdAt, today))
    const todayContacts = todayContactsResult.length

    // Get last week's contacts count
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastWeekContactsResult = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(gte(contacts.createdAt, lastWeek))
    const lastWeekContacts = lastWeekContactsResult.length

    // Get week before last week's contacts count
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const weekBeforeLastResult = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(
        and(
          gte(contacts.createdAt, twoWeeksAgo),
          sql`${contacts.createdAt} < ${lastWeek}`
        )
      )
    const weekBeforeLast = weekBeforeLastResult.length

    // Calculate weekly growth
    const weeklyGrowth =
      weekBeforeLast > 0
        ? Math.round(
            ((lastWeekContacts - weekBeforeLast) / weekBeforeLast) * 100
          )
        : lastWeekContacts > 0
        ? 100
        : 0

    // Calculate response rate
    const responseRate =
      totalContacts > 0
        ? Math.round((respondedContacts / totalContacts) * 100)
        : 0

    // Calculate average response time (simplified - using 24 hours as default)
    // In a real app, you'd track when contacts were first read and when responses were sent
    const avgResponseTime = '24h'

    // Get total properties count for additional context
    const totalPropertiesResult = await db
      .select({ count: properties.id })
      .from(properties)
    const totalProperties = totalPropertiesResult.length

    // Get total templates count
    const totalTemplatesResult = await db
      .select({ count: responseTemplates.id })
      .from(responseTemplates)
    const totalTemplates = totalTemplatesResult.length

    const stats = {
      totalContacts,
      newContacts,
      readContacts,
      respondedContacts,
      avgResponseTime,
      responseRate,
      todayContacts,
      weeklyGrowth,
      totalProperties,
      totalTemplates,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
