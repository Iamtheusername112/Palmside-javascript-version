import { Heart, MapPin, Bed, Bath, Square, Star } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import Link from 'next/link'

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    location,
    price,
    image,
    bedrooms,
    bathrooms,
    sqft,
    type,
    status,
    rating = 4.5, // Default rating if not provided
    isFavorite = false,
  } = property

  // Format price based on status
  const formatPrice = (price, status) => {
    if (status === 'For Rent') {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  // Handle missing image with placeholder
  const imageUrl =
    image ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop'

  return (
    <Card className='group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
      <CardHeader className='p-0 relative'>
        <div className='relative overflow-hidden'>
          <img
            src={imageUrl}
            alt={title}
            className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <div className='absolute top-4 left-4'>
            <Badge variant={status === 'For Sale' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          </div>
          <div className='absolute top-4 right-4'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 bg-white/90 hover:bg-white rounded-full'
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>
          </div>
          <div className='absolute bottom-4 right-4'>
            <Badge variant='outline' className='bg-white/90'>
              {type}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-2'>
          <h3 className='font-semibold text-lg text-gray-900 line-clamp-1'>
            {title}
          </h3>
          <div className='flex items-center space-x-1'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm text-gray-600'>{rating}</span>
          </div>
        </div>

        <div className='flex items-center text-gray-600 mb-3'>
          <MapPin className='h-4 w-4 mr-1' />
          <span className='text-sm'>{location}</span>
        </div>

        <div className='flex items-center justify-between text-sm text-gray-600 mb-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center'>
              <Bed className='h-4 w-4 mr-1' />
              <span>{bedrooms}</span>
            </div>
            <div className='flex items-center'>
              <Bath className='h-4 w-4 mr-1' />
              <span>{bathrooms}</span>
            </div>
            <div className='flex items-center'>
              <Square className='h-4 w-4 mr-1' />
              <span>{sqft} sqft</span>
            </div>
          </div>
        </div>

        <div className='text-2xl font-bold text-primary mb-3'>
          {formatPrice(price, status)}
        </div>
      </CardContent>

      <CardFooter className='p-4 pt-0'>
        <Link href={`/properties/${id}`} className='w-full'>
          <Button className='w-full'>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
