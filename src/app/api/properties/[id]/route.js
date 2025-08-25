import { NextResponse } from 'next/server'
import { sql } from '@/lib/db/connection'

// GET /api/properties/[id] - Get single property
export async function GET(request, { params }) {
  try {
    const { id } = params

    const result = await sql`
      SELECT 
        p.*,
        COUNT(pi.id) as image_count,
        COUNT(pv.id) as view_count
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_views pv ON p.id = pv.property_id
      WHERE p.id = ${id}
      GROUP BY p.id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Get property images
    const images = await sql`
      SELECT * FROM property_images 
      WHERE property_id = ${id} 
      ORDER BY is_primary DESC, created_at ASC
    `

    const property = {
      ...result[0],
      images,
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      title,
      description,
      location,
      price,
      type,
      status,
      bedrooms,
      bathrooms,
      sqft,
      image,
      isFeatured,
      isFavorite,
    } = body

    // Validate required fields
    if (
      !title ||
      !location ||
      !price ||
      !type ||
      !status ||
      !bedrooms ||
      !bathrooms ||
      !sqft
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE properties SET
        title = ${title},
        description = ${description},
        location = ${location},
        price = ${price},
        type = ${type},
        status = ${status},
        bedrooms = ${bedrooms},
        bathrooms = ${bathrooms},
        sqft = ${sqft},
        image = ${image},
        is_featured = ${isFeatured || false},
        is_favorite = ${isFavorite || false},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const updatedProperty = result[0]

    // Log admin activity
    await sql`
      INSERT INTO admin_activity_log (action, entity_type, entity_id, details)
      VALUES ('updated', 'property', ${id}, ${`Updated property: ${title}`})
    `

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Get property details for logging
    const propertyResult = await sql`
      SELECT title FROM properties WHERE id = ${id}
    `

    if (propertyResult.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Delete property (cascade will handle related records)
    await sql`DELETE FROM properties WHERE id = ${id}`

    // Log admin activity
    await sql`
      INSERT INTO admin_activity_log (action, entity_type, entity_id, details)
      VALUES ('deleted', 'property', ${id}, ${`Deleted property: ${propertyResult[0].title}`})
    `

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
