'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { PropertyActions } from '@/components/admin/PropertyActions'

// Mock data - replace with real data from database
const mockProperties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    location: 'Downtown, City Center',
    price: 450000,
    type: 'Apartment',
    status: 'For Sale',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    isFeatured: true,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'Luxury Family Home',
    location: 'Suburban Heights',
    price: 850000,
    type: 'House',
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    isFeatured: true,
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    title: 'Cozy Studio Loft',
    location: 'Arts District',
    price: 1800,
    type: 'Loft',
    status: 'For Rent',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    isFeatured: false,
    createdAt: '2024-01-12',
  },
  {
    id: 4,
    title: 'Waterfront Condo',
    location: 'Harbor View',
    price: 650000,
    type: 'Condo',
    status: 'Sold',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    isFeatured: false,
    createdAt: '2024-01-08',
  },
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState(mockProperties)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price}`
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Properties</h1>
          <p className='text-gray-600'>
            Manage all your properties from one place.
          </p>
        </div>
        <Link href='/admin/properties/new'>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Search properties...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='For Sale'>For Sale</option>
              <option value='For Rent'>For Rent</option>
              <option value='Sold'>Sold</option>
              <option value='Rented'>Rented</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Property
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Type
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Price
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Details
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr
                    key={property.id}
                    className='border-b border-gray-100 hover:bg-gray-50'
                  >
                    <td className='py-4 px-4'>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {property.title}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {property.location}
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-4'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                        {property.type}
                      </span>
                    </td>
                    <td className='py-4 px-4 font-medium text-gray-900'>
                      {formatPrice(property.price)}
                    </td>
                    <td className='py-4 px-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className='py-4 px-4 text-sm text-gray-500'>
                      {property.bedrooms} bed, {property.bathrooms} bath,{' '}
                      {property.sqft} sqft
                    </td>
                    <td className='py-4 px-4'>
                      <PropertyActions property={property} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
