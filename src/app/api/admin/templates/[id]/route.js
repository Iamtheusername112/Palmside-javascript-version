import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { responseTemplates } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single template
export async function GET(request, { params }) {
  try {
    const { id } = params
    const template = await db
      .select()
      .from(responseTemplates)
      .where(eq(responseTemplates.id, parseInt(id)))
      .limit(1)

    if (template.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json(template[0])
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT - Update template
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, subject, content, category } = body

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const [updatedTemplate] = await db
      .update(responseTemplates)
      .set({
        name,
        subject,
        content,
        category: category || 'general',
        updatedAt: new Date(),
      })
      .where(eq(responseTemplates.id, parseInt(id)))
      .returning()

    if (!updatedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE - Delete template
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Check if template is default (cannot delete default templates)
    const template = await db
      .select()
      .from(responseTemplates)
      .where(eq(responseTemplates.id, parseInt(id)))
      .limit(1)

    if (template.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template[0].isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default templates' },
        { status: 400 }
      )
    }

    await db
      .delete(responseTemplates)
      .where(eq(responseTemplates.id, parseInt(id)))

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
