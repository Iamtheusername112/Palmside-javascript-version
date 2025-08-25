import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts, adminActivityLog } from '@/lib/db/schema'
import { eq, desc, limit } from 'drizzle-orm'

export async function GET() {
  try {
    // Get recent contacts with their status changes
    const recentContacts = await db
      .select({
        id: contacts.id,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        email: contacts.email,
        status: contacts.status,
        createdAt: contacts.createdAt,
        updatedAt: contacts.updatedAt,
      })
      .from(contacts)
      .orderBy(desc(contacts.updatedAt))
      .limit(20)

    // Get admin activity log entries
    const recentActivities = await db
      .select({
        id: adminActivityLog.id,
        action: adminActivityLog.action,
        entityType: adminActivityLog.entityType,
        entityId: adminActivityLog.entityId,
        details: adminActivityLog.details,
        createdAt: adminActivityLog.createdAt,
      })
      .from(adminActivityLog)
      .orderBy(desc(adminActivityLog.createdAt))
      .limit(20)

    // Transform contacts into activity items
    const contactActivities = recentContacts.map((contact) => {
      let activityType = 'new_contact'
      let description = 'New contact submission received'

      if (contact.status === 'read') {
        activityType = 'contact_marked_read'
        description = 'Contact marked as read'
      } else if (contact.status === 'responded') {
        activityType = 'contact_responded'
        description = 'Response sent to contact'
      } else if (contact.status === 'archived') {
        activityType = 'contact_archived'
        description = 'Contact archived'
      }

      return {
        id: `contact_${contact.id}`,
        type: activityType,
        contactId: contact.id,
        contactName: `${contact.firstName} ${contact.lastName}`,
        contactEmail: contact.email,
        timestamp: contact.updatedAt || contact.createdAt,
        description,
        entityType: 'contact',
      }
    })

    // Transform admin activities
    const adminActivities = recentActivities.map((activity) => ({
      id: `admin_${activity.id}`,
      type: 'admin_action',
      action: activity.action,
      entityType: activity.entityType,
      entityId: activity.entityId,
      details: activity.details,
      timestamp: activity.createdAt,
      description: `${activity.action} ${activity.entityType}`,
    }))

    // Combine and sort all activities by timestamp
    const allActivities = [...contactActivities, ...adminActivities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 30) // Limit to 30 most recent activities

    return NextResponse.json(allActivities)
  } catch (error) {
    console.error('Error fetching activity feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity feed' },
      { status: 500 }
    )
  }
}
