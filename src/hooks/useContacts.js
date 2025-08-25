import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useContacts(page = 1, limit = 10, status = 'all', search = '') {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const { error: showError } = useToast()

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== 'all' && { status }),
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/contacts?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      const data = await response.json()
      setContacts(data.contacts)
      setPagination(data.pagination)
      setError(null)
    } catch (err) {
      setError(err.message)
      showError('Fetch Failed', 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }, [page, limit, status, search, showError])

  // Update contact status
  const updateContactStatus = useCallback(
    async (id, status) => {
      try {
        const response = await fetch('/api/admin/contacts', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, status }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update contact status')
        }

        // Update local state
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === id
              ? { ...contact, status, updatedAt: new Date() }
              : contact
          )
        )

        return true
      } catch (err) {
        showError('Update Failed', err.message)
        return false
      }
    },
    [showError]
  )

  // Load contacts on mount and when dependencies change
  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return {
    contacts,
    loading,
    error,
    pagination,
    updateContactStatus,
    refetch: fetchContacts,
  }
}

// Hook for single contact
export function useContact(id) {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { error: showError } = useToast()

  const fetchContact = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/contacts/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contact')
      }
      const data = await response.json()
      setContact(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      showError('Fetch Failed', 'Failed to load contact')
    } finally {
      setLoading(false)
    }
  }, [id, showError])

  useEffect(() => {
    fetchContact()
  }, [fetchContact])

  return {
    contact,
    loading,
    error,
    refetch: fetchContact,
  }
}

