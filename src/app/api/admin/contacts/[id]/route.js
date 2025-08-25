import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single contact
export async function GET(request, { params }) {
  try {
    const { id } = params
    const contact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, parseInt(id)))
      .limit(1)

    if (contact.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact[0])
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

