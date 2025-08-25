'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  StarOff,
  Eye,
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
} from 'lucide-react'
import Link from 'next/link'
import { PropertyActions } from '@/components/admin/PropertyActions'

export default function PropertyViewPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`)
        if (!response.ok) {
          throw new Error('Property not found')
        }
        const data = await response.json()
        setProperty(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProperty()
    }
  }, [id])

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'For Sale':
        return 'bg-blue-100 text-blue-800'
      case 'For Rent':
        return 'bg-green-100 text-green-800'
      case 'Sold':
        return 'bg-gray-100 text-gray-800'
      case 'Rented':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold text-red-600'>Error</h1>
          <p className='text-gray-600 mt-2'>{error || 'Property not found'}</p>
          <Link href='/admin/properties' className='mt-4 inline-block'>
            <Button variant='outline'>Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin/properties'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Properties
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              {property.title}
            </h1>
            <p className='text-gray-600 flex items-center mt-1'>
              <MapPin className='w-4 h-4 mr-1' />
              {property.location}
            </p>
          </div>
        </div>
        <div className='flex space-x-3'>
          <Link href={`/admin/properties/${id}/edit`}>
            <Button>
              <Edit className='w-4 h-4 mr-2' />
              Edit Property
            </Button>
          </Link>
          <PropertyActions
            property={property}
            onDelete={() => router.push('/admin/properties')}
            onToggleFeatured={() => window.location.reload()}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Property Image */}
          <Card>
            <CardContent className='p-0'>
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className='w-full h-64 object-cover rounded-t-lg'
                />
              ) : (
                <div className='w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center'>
                  <Building2 className='w-16 h-16 text-gray-400' />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex items-center space-x-2'>
                  <Bed className='w-5 h-5 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    {property.bedrooms} Bedrooms
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Bath className='w-5 h-5 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    {property.bathrooms} Bathrooms
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Square className='w-5 h-5 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    {property.sqft} sqft
                  </span>
                </div>
              </div>

              {property.description && (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Description
                  </h4>
                  <p className='text-gray-600'>{property.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Price</span>
                <span className='text-lg font-bold text-primary'>
                  {formatPrice(property.price)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Type</span>
                <Badge variant='secondary'>{property.type}</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Status</span>
                <Badge className={getStatusColor(property.status)}>
                  {property.status}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Featured</span>
                <div className='flex items-center space-x-1'>
                  {property.is_featured ? (
                    <Star className='w-4 h-4 text-yellow-500 fill-current' />
                  ) : (
                    <StarOff className='w-4 h-4 text-gray-400' />
                  )}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Favorite</span>
                <div className='flex items-center space-x-1'>
                  {property.is_favorite ? (
                    <Star className='w-4 h-4 text-red-500 fill-current' />
                  ) : (
                    <StarOff className='w-4 h-4 text-gray-400' />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Images</span>
                <span className='font-medium'>{property.image_count || 0}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Views</span>
                <span className='font-medium'>{property.view_count || 0}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Created</span>
                <span className='font-medium'>
                  {new Date(property.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Updated</span>
                <span className='font-medium'>
                  {new Date(property.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Link href={`/admin/properties/${id}/edit`} className='w-full'>
                <Button variant='outline' className='w-full justify-start'>
                  <Edit className='w-4 h-4 mr-2' />
                  Edit Property
                </Button>
              </Link>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => window.location.reload()}
              >
                <Eye className='w-4 h-4 mr-2' />
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
