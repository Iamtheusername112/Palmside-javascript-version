import { NextResponse } from 'next/server'
import { sql } from '@/lib/db/connection'

// GET /api/properties - Get all properties
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const offset = (page - 1) * limit

    // Simple query for now - get all properties
    const result =
      await sql`SELECT * FROM properties ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

    // Get total count
    const countResult = await sql`SELECT COUNT(*) FROM properties`
    const total = parseInt(countResult[0].count)

    return NextResponse.json({
      properties: result,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties: ' + error.message },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property
export async function POST(request) {
  try {
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
      INSERT INTO properties (
        title, description, location, price, type, status, 
        bedrooms, bathrooms, sqft, image, is_featured, is_favorite
      ) VALUES (
        ${title}, ${description}, ${location}, ${price}, ${type}, ${status},
        ${bedrooms}, ${bathrooms}, ${sqft}, ${image}, ${isFeatured || false}, ${
      isFavorite || false
    }
      ) RETURNING *
    `

    const newProperty = result[0]

    // Log admin activity (with NULL admin_id for now since Clerk is disabled)
    try {
      await sql`
        INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
        VALUES (NULL, 'created', 'property', ${
          newProperty.id
        }, ${`Created property: ${title}`})
      `
    } catch (logError) {
      console.warn('Failed to log admin activity:', logError.message)
      // Don't fail the property creation if logging fails
    }

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property: ' + error.message },
      { status: 500 }
    )
  }
}
