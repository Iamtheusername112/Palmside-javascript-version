import PropertyCard from './PropertyCard'

const featuredProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Downtown, City Center",
    price: 450000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "Apartment",
    status: "For Sale",
    rating: 4.8,
    isFavorite: false
  },
  {
    id: 2,
    title: "Luxury Family Home",
    location: "Suburban Heights",
    price: 850000,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    type: "House",
    status: "For Sale",
    rating: 4.9,
    isFavorite: true
  },
  {
    id: 3,
    title: "Cozy Studio Loft",
    location: "Arts District",
    price: 1800,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    type: "Loft",
    status: "For Rent",
    rating: 4.6,
    isFavorite: false
  },
  {
    id: 4,
    title: "Waterfront Condo",
    location: "Harbor View",
    price: 650000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=400&fit=crop",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: "Condo",
    status: "For Sale",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: 5,
    title: "Historic Townhouse",
    location: "Old Town",
    price: 720000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=400&fit=crop",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2200,
    type: "Townhouse",
    status: "For Sale",
    rating: 4.5,
    isFavorite: false
  },
  {
    id: 6,
    title: "Garden Apartment",
    location: "Park District",
    price: 2200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    type: "Apartment",
    status: "For Rent",
    rating: 4.4,
    isFavorite: false
  }
]

export default function FeaturedProperties() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of the most desirable properties in prime locations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  )
}
