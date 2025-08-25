import { useState, useEffect, useCallback, useRef } from 'react'

export function useContactNotifications() {
  const [notifications, setNotifications] = useState({
    new: 0,
    recent: 0,
    weekly: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const eventSourceRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contacts/notifications')
      const data = await response.json()

      if (response.ok) {
        setNotifications(data)
      } else {
        setError(data.error || 'Failed to fetch notifications')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  // Setup Server-Sent Events for real-time updates
  const setupSSE = useCallback(() => {
    if (typeof EventSource !== 'undefined') {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
        }

        // Create new SSE connection
        eventSourceRef.current = new EventSource(
          '/api/admin/contacts/notifications/stream'
        )

        eventSourceRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'notifications_update') {
              setNotifications(data.notifications)
            } else if (data.type === 'connection_established') {
              console.log('SSE connection established successfully')
            } else if (data.type === 'keep_alive') {
              // Just keep the connection alive, no action needed
            }
          } catch (err) {
            console.error('Error parsing SSE data:', err)
          }
        }

        eventSourceRef.current.onerror = (event) => {
          console.error('SSE connection error:', event)
          // Don't immediately fallback, let the connection retry
          // EventSource will automatically retry the connection
        }

        eventSourceRef.current.onopen = () => {
          console.log('SSE connection opened')
        }

        // Add a timeout to detect if connection is stuck
        const connectionTimeout = setTimeout(() => {
          if (
            eventSourceRef.current &&
            eventSourceRef.current.readyState === EventSource.CONNECTING
          ) {
            console.log('SSE connection timeout, falling back to polling')
            eventSourceRef.current.close()
            setTimeout(fetchNotifications, 1000)
          }
        }, 10000) // 10 second timeout

        return () => {
          clearTimeout(connectionTimeout)
        }
      } catch (err) {
        console.error('Failed to setup SSE:', err)
        // Fallback to polling
        setTimeout(fetchNotifications, 5000)
      }
    }
  }, [fetchNotifications])

  // Optimistically update counts when a contact is marked as read
  const markContactAsRead = useCallback((contactId, previousStatus) => {
    if (previousStatus === 'new') {
      setNotifications((prev) => ({
        ...prev,
        new: Math.max(0, prev.new - 1),
        recent: Math.max(0, prev.recent - 1),
        weekly: Math.max(0, prev.weekly - 1),
      }))
    }
  }, [])

  // Update counts when multiple contacts are updated
  const updateCountsBulk = useCallback((updatedContacts, previousStatus) => {
    if (previousStatus === 'new') {
      const count = updatedContacts.length
      setNotifications((prev) => ({
        ...prev,
        new: Math.max(0, prev.new - count),
        recent: Math.max(0, prev.recent - count),
        weekly: Math.max(0, prev.weekly - count),
      }))
    }
  }, [])

  // Force refresh notifications
  const refreshNotifications = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    fetchNotifications()

    // Try to setup SSE first
    setupSSE()

    // Fallback polling every 2 minutes if SSE is not available
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000)

    return () => {
      clearInterval(interval)
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [fetchNotifications, setupSSE])

  return {
    notifications,
    loading,
    error,
    refreshNotifications,
    markContactAsRead,
    updateCountsBulk,
  }
}
