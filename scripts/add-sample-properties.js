const { neon } = require('@neondatabase/serverless')
require('dotenv').config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

const sampleProperties = [
  {
    title: 'Modern Downtown Apartment',
    description:
      'Beautiful modern apartment in the heart of downtown with stunning city views.',
    location: 'Downtown, City Center',
    price: 450000,
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: 'Apartment',
    status: 'For Sale',
    isFeatured: true,
    isFavorite: false,
  },
  {
    title: 'Luxury Family Home',
    description:
      'Spacious family home in a quiet suburban neighborhood with excellent schools.',
    location: 'Suburban Heights',
    price: 850000,
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    type: 'House',
    status: 'For Sale',
    isFeatured: true,
    isFavorite: false,
  },
  {
    title: 'Cozy Studio Loft',
    description:
      'Modern studio loft in the trendy arts district, perfect for young professionals.',
    location: 'Arts District',
    price: 1800,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    type: 'Loft',
    status: 'For Rent',
    isFeatured: false,
    isFavorite: false,
  },
  {
    title: 'Waterfront Condo',
    description:
      'Luxurious waterfront condo with breathtaking harbor views and modern amenities.',
    location: 'Harbor View',
    price: 650000,
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=400&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: 'Condo',
    status: 'For Sale',
    isFeatured: true,
    isFavorite: false,
  },
  {
    title: 'Historic Townhouse',
    description:
      'Beautifully restored historic townhouse with modern updates and classic charm.',
    location: 'Old Town',
    price: 720000,
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=400&fit=crop',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2200,
    type: 'Townhouse',
    status: 'For Sale',
    isFeatured: false,
    isFavorite: false,
  },
]

async function addSampleProperties() {
  try {
    console.log('🚀 Adding sample properties to database...')

    for (const property of sampleProperties) {
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

    console.log('🎉 All sample properties added successfully!')
    console.log(
      '💡 You can now visit http://localhost:3000/properties to see them dynamically loaded!'
    )
  } catch (error) {
    console.error('❌ Error adding sample properties:', error)
  } finally {
    process.exit(0)
  }
}

addSampleProperties()
