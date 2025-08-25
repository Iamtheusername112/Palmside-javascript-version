'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, RefreshCw, Filter } from 'lucide-react'
import Link from 'next/link'
import { PropertyActions } from '@/components/admin/PropertyActions'
import { useProperties } from '@/hooks/useProperties'
import { useToast } from '@/hooks/useToast'

export default function PropertiesPage() {
  const {
    properties: allProperties,
    loading,
    error,
    pagination,
    fetchProperties,
    deleteProperty,
  } = useProperties()
  const { success, error: showError } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const params = {}
    if (statusFilter !== 'all') params.status = statusFilter
    if (debouncedSearchTerm) params.search = debouncedSearchTerm
    fetchProperties(params)
  }, [statusFilter, debouncedSearchTerm, fetchProperties])

  const handleRefresh = async () => {
    try {
      await fetchProperties()
      success(
        'Properties Refreshed',
        'Property list has been updated successfully.'
      )
    } catch (error) {
      showError(
        'Refresh Failed',
        'Failed to refresh properties. Please try again.'
      )
    }
  }

  const handleDelete = async (propertyId) => {
    try {
      await deleteProperty(propertyId)
      // The success message is handled in PropertyActions component
    } catch (error) {
      showError(
        'Delete Failed',
        'Failed to delete the property. Please try again.'
      )
    }
  }

  // Filter properties locally for immediate UI updates
  const filteredProperties = allProperties.filter((property) => {
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
        <div className='flex space-x-3'>
          <Button variant='outline' onClick={handleRefresh} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Link href='/admin/properties/new'>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-red-800'>
                Error: {error}
              </span>
              <Button variant='ghost' size='sm' onClick={handleRefresh}>
                <RefreshCw className='w-4 h-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                disabled={loading}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              disabled={loading}
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
          <CardTitle>
            All Properties ({loading ? '...' : filteredProperties.length})
            {pagination.total > 0 && (
              <span className='text-sm font-normal text-gray-500 ml-2'>
                of {pagination.total}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex items-center space-x-4 animate-pulse'
                >
                  <div className='h-16 bg-gray-200 rounded w-1/3'></div>
                  <div className='h-4 bg-gray-200 rounded w-20'></div>
                  <div className='h-4 bg-gray-200 rounded w-24'></div>
                  <div className='h-4 bg-gray-200 rounded w-20'></div>
                  <div className='h-4 bg-gray-200 rounded w-32'></div>
                  <div className='h-8 bg-gray-200 rounded w-16'></div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
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
                        <PropertyActions
                          property={property}
                          onDelete={handleDelete}
                          onToggleFeatured={() => fetchProperties()}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <p className='text-lg font-medium'>No properties found</p>
              <p className='text-sm'>Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
