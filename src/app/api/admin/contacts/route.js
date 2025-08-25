import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { desc, eq, like, and, or } from 'drizzle-orm'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    // Build where conditions
    let whereConditions = []

    if (status && status !== 'all') {
      whereConditions.push(eq(contacts.status, status))
    }

    if (search) {
      whereConditions.push(
        or(
          like(contacts.firstName, `%${search}%`),
          like(contacts.lastName, `%${search}%`),
          like(contacts.email, `%${search}%`),
          like(contacts.subject, `%${search}%`)
        )
      )
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get total count for pagination
    const totalCount = await db
      .select({ count: contacts.id })
      .from(contacts)
      .where(whereClause)

    // Get contacts with pagination
    const contactList = await db
      .select()
      .from(contacts)
      .where(whereClause)
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      contacts: contactList,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update contact status
    const [updatedContact] = await db
      .update(contacts)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, id))
      .returning()

    return NextResponse.json({
      success: true,
      contact: updatedContact,
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}
