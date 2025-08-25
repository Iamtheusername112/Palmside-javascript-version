import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { responseTemplates } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// GET - Fetch all templates
export async function GET() {
  try {
    const templates = await db
      .select()
      .from(responseTemplates)
      .orderBy(desc(responseTemplates.createdAt))

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST - Create new template
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, subject, content, category } = body

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const [newTemplate] = await db
      .insert(responseTemplates)
      .values({
        name,
        subject,
        content,
        category: category || 'general',
        isDefault: false,
        useCount: 0,
      })
      .returning()

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
