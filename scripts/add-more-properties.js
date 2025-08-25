const { neon } = require('@neondatabase/serverless')
require('dotenv').config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

const additionalProperties = [
  {
    title: 'Luxury Penthouse Suite',
    description:
      'Exclusive penthouse with panoramic city views, private terrace, and premium finishes throughout.',
    location: 'Skyline Tower, Downtown',
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    type: 'Penthouse',
    status: 'For Rent',
    isFeatured: true,
    isFavorite: false,
  },
  {
    title: 'Garden Family Villa',
    description:
      'Spacious family villa with private garden, swimming pool, and mountain views in a quiet neighborhood.',
    location: 'Mountain View Estates',
    price: 1200000,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=400&fit=crop',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3500,
    type: 'Villa',
    status: 'For Sale',
    isFeatured: true,
    isFavorite: false,
  },
  {
    title: 'Modern Industrial Loft',
    description:
      'Converted warehouse space with exposed brick, high ceilings, and contemporary design elements.',
    location: 'Warehouse District',
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1800,
    type: 'Loft',
    status: 'For Rent',
    isFeatured: false,
    isFavorite: false,
  },
]

async function addMoreProperties() {
  try {
    console.log('🚀 Adding more sample properties to database...')

    for (const property of additionalProperties) {
      const result = await sql`
        INSERT INTO properties (
          title, description, location, price, image, bedrooms, bathrooms, sqft, type, status, is_featured, is_favorite
        ) VALUES (
          ${property.title}, ${property.description}, ${property.location}, ${property.price}, ${property.image}, 
          ${property.bedrooms}, ${property.bathrooms}, ${property.sqft}, ${property.type}, ${property.status}, 
          ${property.isFeatured}, ${property.isFavorite}
        ) RETURNING id
      `

      console.log(`✅ Added: ${property.title} (ID: ${result[0].id})`)

      // Log admin activity
      await sql`
        INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
        VALUES (NULL, 'created', 'property', ${
          result[0].id
        }, ${`Added sample property: ${property.title}`})
      `
    }

    console.log('🎉 All additional properties added successfully!')
    console.log(
      '💡 You can now visit http://localhost:3000/properties to see them dynamically loaded!'
    )
  } catch (error) {
    console.error('❌ Error adding properties:', error)
  } finally {
    process.exit(0)
  }
}

addMoreProperties()
