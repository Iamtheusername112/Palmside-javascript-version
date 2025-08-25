import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'

export async function GET() {
  try {
    // Get count of new contacts (unread)
    const newContactsCount = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(eq(contacts.status, 'new'))

    // Get count of contacts from the last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const recentContactsCount = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(
        and(gte(contacts.createdAt, yesterday), eq(contacts.status, 'new'))
      )

    // Get count of contacts from the last 7 days
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const weeklyContactsCount = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(and(gte(contacts.createdAt, lastWeek), eq(contacts.status, 'new')))

    return NextResponse.json({
      new: newContactsCount.length,
      recent: recentContactsCount.length,
      weekly: weeklyContactsCount.length,
    })
  } catch (error) {
    console.error('Error fetching contact notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact notifications' },
      { status: 500 }
    )
  }
}
