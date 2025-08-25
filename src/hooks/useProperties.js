import { useState, useEffect, useCallback } from 'react'

export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  // Fetch properties
  const fetchProperties = useCallback(
    async (params = {}) => {
      try {
        setLoading(true)
        setError(null)

        const searchParams = new URLSearchParams({
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          ...(params.status && { status: params.status }),
          ...(params.search && { search: params.search }),
        })

        const response = await fetch(`/api/properties?${searchParams}`)
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }

        const data = await response.json()
        setProperties(data.properties)
        setPagination(data.pagination)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [pagination.page, pagination.limit]
  )

  // Create property
  const createProperty = useCallback(async (propertyData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create property')
      }

      const newProperty = await response.json()
      setProperties((prev) => [newProperty, ...prev])
      return newProperty
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update property
  const updateProperty = useCallback(async (id, propertyData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update property')
      }

      const updatedProperty = await response.json()
      setProperties((prev) =>
        prev.map((prop) => (prop.id === id ? updatedProperty : prop))
      )
      return updatedProperty
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete property
  const deleteProperty = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete property')
      }

      setProperties((prev) => prev.filter((prop) => prop.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Toggle featured status
  const toggleFeatured = useCallback(async (id) => {
    try {
      setError(null)

      const response = await fetch(`/api/properties/${id}/toggle-featured`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle featured status')
      }

      const updatedProperty = await response.json()
      setProperties((prev) =>
        prev.map((prop) => (prop.id === id ? updatedProperty : prop))
      )
      return updatedProperty
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Get single property
  const getProperty = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/properties/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch property')
      }

      const property = await response.json()
      return property
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return {
    properties,
    loading,
    error,
    pagination,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    toggleFeatured,
    getProperty,
    setError,
  }
}
