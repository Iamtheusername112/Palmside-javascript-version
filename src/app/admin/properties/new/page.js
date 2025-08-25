'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'

export default function NewPropertyPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      // Validate required fields
      const requiredFields = [
        'title',
        'location',
        'price',
        'type',
        'status',
        'bedrooms',
        'bathrooms',
        'sqft',
      ]
      const missingFields = requiredFields.filter((field) => !formData[field])

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Validate numeric fields
      if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        throw new Error('Price must be a positive number')
      }
      if (isNaN(formData.bedrooms) || parseInt(formData.bedrooms) < 0) {
        throw new Error('Bedrooms must be a non-negative number')
      }
      if (isNaN(formData.bathrooms) || parseFloat(formData.bathrooms) < 0) {
        throw new Error('Bathrooms must be a non-negative number')
      }
      if (isNaN(formData.sqft) || parseInt(formData.sqft) <= 0) {
        throw new Error('Square feet must be a positive number')
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          sqft: parseInt(formData.sqft),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create property')
      }

      const newProperty = await response.json()

      // Show success toast
      success(
        'Property Created Successfully!',
        `${formData.title} has been added to your portfolio.`
      )

      // Redirect to properties list after a short delay
      setTimeout(() => {
        router.push('/admin/properties')
      }, 1500)
    } catch (error) {
      console.error('Error creating property:', error)
      showError(
        'Failed to Create Property',
        error.message || 'An unexpected error occurred. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className='text-3xl font-bold text-gray-900'>Add New Property</h1>
          <p className='text-gray-600'>
            Create a new property listing for your portfolio.
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
                  placeholder='e.g., Modern Downtown Apartment'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Property Type *</Label>
                <select
                  id='type'
                  name='type'
                  value={formData.type}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  required
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Describe the property, its features, and what makes it special...'
                rows={4}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='location'>Location *</Label>
              <Input
                id='location'
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                placeholder='e.g., Downtown, City Center'
                required
              />
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
                  placeholder='2'
                  min='0'
                  required
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
                  placeholder='2.5'
                  min='0'
                  required
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
                  placeholder='1200'
                  min='0'
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price *</Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder='450000'
                  min='0'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status *</Label>
                <select
                  id='status'
                  name='status'
                  value={formData.status}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  required
                >
                  {propertyStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='image'>Main Image URL *</Label>
              <Input
                id='image'
                name='image'
                value={formData.image}
                onChange={handleInputChange}
                placeholder='https://example.com/image.jpg'
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Button type='button' variant='outline' size='sm'>
                <Upload className='w-4 h-4 mr-2' />
                Upload Image
              </Button>
              <span className='text-sm text-gray-500'>
                Image upload functionality coming soon
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='isFeatured'>Featured Property</Label>
                <p className='text-sm text-gray-500'>
                  Featured properties appear prominently on the homepage
                </p>
              </div>
              <Switch
                id='isFeatured'
                name='isFeatured'
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFeatured: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className='flex justify-end space-x-4'>
          <Link href='/admin/properties'>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </Link>
          <Button type='submit' disabled={isSubmitting}>
            <Save className='w-4 h-4 mr-2' />
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </div>
  )
}
