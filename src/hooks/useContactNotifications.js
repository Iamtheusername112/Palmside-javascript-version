import { useState, useEffect } from 'react'

export function useContactNotifications() {
  const [notifications, setNotifications] = useState({
    new: 0,
    recent: 0,
    weekly: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotifications = async () => {
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
  }

  useEffect(() => {
    fetchNotifications()

    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const refreshNotifications = () => {
    fetchNotifications()
  }

  return {
    notifications,
    loading,
    error,
    refreshNotifications,
  }
}
