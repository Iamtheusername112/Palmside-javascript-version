'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/useToast'
import { use } from 'react'

export default function EditPropertyPage({ params }) {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { id } = use(params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: 'House',
    status: 'For Sale',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    image: '',
    isFeatured: false,
    isFavorite: false,
  })

  const propertyTypes = [
    'House',
    'Apartment',
    'Condo',
    'Townhouse',
    'Villa',
    'Loft',
    'Penthouse',
  ]

  const propertyStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented']

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`)
        if (!response.ok) {
          throw new Error('Property not found')
        }
        const property = await response.json()

        setFormData({
          title: property.title || '',
          description: property.description || '',
          location: property.location || '',
          price: property.price || '',
          type: property.type || 'House',
          status: property.status || 'For Sale',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          sqft: property.sqft || '',
          image: property.image || '',
          isFeatured: property.is_featured || false,
          isFavorite: property.is_favorite || false,
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadProperty()
    }
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update property')
      }

      // Redirect to properties list
      router.push('/admin/properties')
      success('Property updated successfully!')
    } catch (error) {
      console.error('Error updating property:', error)
      showError(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold text-red-600'>Error</h1>
          <p className='text-gray-600 mt-2'>{error}</p>
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
      <div className='flex items-center space-x-4'>
        <Link href='/admin/properties'>
          <Button variant='ghost' size='sm'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Properties
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Property</h1>
          <p className='text-gray-600'>
            Update property information and details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Property Title *</Label>
                <Input
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter property title'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='location'>Location *</Label>
                <Input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter property location'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Enter property description'
                rows={4}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='type'>Property Type *</Label>
                <select
                  id='type'
                  name='type'
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status *</Label>
                <select
                  id='status'
                  name='status'
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                >
                  {propertyStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price *</Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter price'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='bedrooms'>Bedrooms *</Label>
                <Input
                  id='bedrooms'
                  name='bedrooms'
                  type='number'
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                  placeholder='Number of bedrooms'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='bathrooms'>Bathrooms *</Label>
                <Input
                  id='bathrooms'
                  name='bathrooms'
                  type='number'
                  step='0.5'
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                  placeholder='Number of bathrooms'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sqft'>Square Feet *</Label>
                <Input
                  id='sqft'
                  name='sqft'
                  type='number'
                  value={formData.sqft}
                  onChange={handleInputChange}
                  required
                  placeholder='Square footage'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='image'>Image URL</Label>
              <Input
                id='image'
                name='image'
                value={formData.image}
                onChange={handleInputChange}
                placeholder='Enter image URL'
              />
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='isFeatured'
                name='isFeatured'
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFeatured: checked }))
                }
              />
              <Label htmlFor='isFeatured'>Featured Property</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='isFavorite'
                name='isFavorite'
                checked={formData.isFavorite}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFavorite: checked }))
                }
              />
              <Label htmlFor='isFavorite'>Mark as Favorite</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex justify-end space-x-4'>
          <Link href='/admin/properties'>
            <Button variant='outline' type='button'>
              Cancel
            </Button>
          </Link>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Updating...
              </>
            ) : (
              <>
                <Save className='w-4 h-4 mr-2' />
                Update Property
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
