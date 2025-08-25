import { NextResponse } from 'next/server'
import { sql } from '@/lib/db/connection'

// PATCH /api/properties/[id]/toggle-featured - Toggle featured status
export async function PATCH(request, { params }) {
  try {
    const { id } = params

    // Get current featured status
    const currentResult = await sql`
      SELECT title, is_featured FROM properties WHERE id = ${id}
    `

    if (currentResult.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const currentProperty = currentResult[0]
    const newFeaturedStatus = !currentProperty.is_featured

    // Update featured status
    const result = await sql`
      UPDATE properties 
      SET is_featured = ${newFeaturedStatus}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    const updatedProperty = result[0]

    // Log admin activity
    const action = newFeaturedStatus
      ? 'marked as featured'
      : 'removed from featured'
    await sql`
      INSERT INTO admin_activity_log (action, entity_type, entity_id, details)
      VALUES ('updated', 'property', ${id}, ${`${action}: ${currentProperty.title}`})
    `

    return NextResponse.json({
      ...updatedProperty,
      message: `Property ${
        newFeaturedStatus ? 'marked as' : 'removed from'
      } featured`,
    })
  } catch (error) {
    console.error('Error toggling featured status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle featured status' },
      { status: 500 }
    )
  }
}
