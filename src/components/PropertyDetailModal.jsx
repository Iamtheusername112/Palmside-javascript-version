'use client'

import { useState, useEffect } from 'react'
import { MapPin, Bed, Bath, Square, Star, Heart, Share2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function PropertyDetailModal({ property, isOpen, onClose }) {
  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false)

  // Reset favorite state when property changes
  useEffect(() => {
    setIsFavorite(property?.isFavorite || false)
  }, [property])

  if (!property) return null

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implement favorite functionality with API
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this ${property.type} in ${property.location}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const formatPrice = (price, status) => {
    if (status === 'For Rent') {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  const imageUrl =
    property.image ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='max-w-4xl max-h-[90vh] overflow-y-auto p-0'
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className='p-6 pb-0'>
          <div className='flex items-start justify-between'>
            <DialogTitle className='text-2xl font-bold text-gray-900 pr-4'>
              {property.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className='p-6 pt-0'>
          {/* Image Section */}
          <div className='relative mb-6'>
            <img
              src={imageUrl}
              alt={property.title}
              className='w-full h-80 object-cover rounded-lg'
            />
            <div className='absolute top-4 left-4'>
              <Badge
                variant={
                  property.status === 'For Sale' ? 'default' : 'secondary'
                }
              >
                {property.status}
              </Badge>
            </div>
            <div className='absolute top-4 right-4 flex space-x-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleFavoriteToggle}
                className='h-10 w-10 bg-white/90 hover:bg-white rounded-full'
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleShare}
                className='h-10 w-10 bg-white/90 hover:bg-white rounded-full'
                aria-label='Share property'
              >
                <Share2 className='h-5 w-5 text-gray-600' />
              </Button>
            </div>
            <div className='absolute bottom-4 right-4'>
              <Badge
                variant='outline'
                className='bg-white/90 text-lg px-3 py-1'
              >
                {property.type}
              </Badge>
            </div>
          </div>

          {/* Price and Rating */}
          <div className='flex items-center justify-between mb-6'>
            <div className='text-3xl font-bold text-primary'>
              {formatPrice(property.price, property.status)}
            </div>
            <div className='flex items-center space-x-2'>
              <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
              <span className='text-lg font-semibold text-gray-700'>
                {property.rating || 4.5}
              </span>
              <span className='text-gray-500'>(4.2k reviews)</span>
            </div>
          </div>

          {/* Location */}
          <div className='flex items-center text-gray-600 mb-6'>
            <MapPin className='h-5 w-5 mr-2' />
            <span className='text-lg'>{property.location}</span>
          </div>

          {/* Property Details Grid */}
          <div className='grid grid-cols-3 gap-6 mb-6'>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <Bed className='h-8 w-8 mx-auto mb-2 text-gray-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {property.bedrooms}
              </div>
              <div className='text-sm text-gray-600'>Bedrooms</div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <Bath className='h-8 w-8 mx-auto mb-2 text-gray-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {property.bathrooms}
              </div>
              <div className='text-sm text-gray-600'>Bathrooms</div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <Square className='h-8 w-8 mx-auto mb-2 text-gray-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {property.sqft}
              </div>
              <div className='text-sm text-gray-600'>Square Feet</div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <>
              <Separator className='my-6' />
              <div className='mb-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  Description
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {property.description}
                </p>
              </div>
            </>
          )}

          {/* Additional Features */}
          <Separator className='my-6' />
          <div className='mb-6'>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Features
            </h3>
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-primary rounded-full'></div>
                <span className='text-gray-600'>Modern Appliances</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-primary rounded-full'></div>
                <span className='text-gray-600'>Central Air</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-primary rounded-full'></div>
                <span className='text-gray-600'>Hardwood Floors</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-primary rounded-full'></div>
                <span className='text-gray-600'>Balcony/Patio</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='pt-4'>
            <a href='/contact' className='block w-full'>
              <Button size='lg' className='w-full'>
                Contact Agent
              </Button>
            </a>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className='mt-6 pt-4 border-t border-gray-200'>
            <p className='text-xs text-gray-500 text-center'>
              Press{' '}
              <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>ESC</kbd>{' '}
              to close
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
