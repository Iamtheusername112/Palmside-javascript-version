import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'

import { Button } from '@/components/ui/button'

const allProperties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    location: 'Downtown, City Center',
    price: 450000,
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: 'Apartment',
    status: 'For Sale',
    rating: 4.8,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Luxury Family Home',
    location: 'Suburban Heights',
    price: 850000,
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    type: 'House',
    status: 'For Sale',
    rating: 4.9,
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Cozy Studio Loft',
    location: 'Arts District',
    price: 1800,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    type: 'Loft',
    status: 'For Rent',
    rating: 4.6,
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Waterfront Condo',
    location: 'Harbor View',
    price: 650000,
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=400&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: 'Condo',
    status: 'For Sale',
    rating: 4.7,
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Historic Townhouse',
    location: 'Old Town',
    price: 720000,
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=400&fit=crop',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2200,
    type: 'Townhouse',
    status: 'For Sale',
    rating: 4.5,
    isFavorite: false,
  },
  {
    id: 6,
    title: 'Garden Apartment',
    location: 'Park District',
    price: 2200,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    type: 'Apartment',
    status: 'For Rent',
    rating: 4.4,
    isFavorite: false,
  },
  {
    id: 7,
    title: 'Mountain View Villa',
    location: 'Highland Estates',
    price: 1200000,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=400&fit=crop',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3500,
    type: 'Villa',
    status: 'For Sale',
    rating: 4.9,
    isFavorite: false,
  },
  {
    id: 8,
    title: 'Urban Penthouse',
    location: 'Skyline Tower',
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    type: 'Penthouse',
    status: 'For Rent',
    rating: 4.8,
    isFavorite: false,
  },
]

export default function PropertiesPage() {
  return (
    <main className='min-h-screen'>
      <Header />

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-50 to-purple-50 py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Find Your Perfect <span className='text-primary'>Property</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Browse through our extensive collection of properties for sale and
            rent. From cozy apartments to luxury homes, we have something for
            everyone.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Available Properties ({allProperties.length})
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {allProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Load More */}
          <div className='text-center mt-12'>
            <Button size='lg' variant='outline'>
              Load More Properties
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-primary'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-white mb-6'>
            Can't Find What You're Looking For?
          </h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
            Let us know your requirements and we'll help you find the perfect
            property or notify you when something becomes available.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='/contact'
              className='bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block'
            >
              Contact Us
            </a>
            <a
              href='/services'
              className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block'
            >
              Our Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
