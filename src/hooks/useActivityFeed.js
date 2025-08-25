import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useActivityFeed() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { error: showError } = useToast()

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/activity')
      if (!response.ok) {
        throw new Error('Failed to fetch activity feed')
      }
      const data = await response.json()
      setActivities(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      showError('Activity Failed', 'Failed to load activity feed')
    } finally {
      setLoading(false)
    }
  }, [showError])

  // Load activities on mount
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  // Refresh activities
  const refreshActivities = useCallback(() => {
    fetchActivities()
  }, [fetchActivities])

  // Add new activity (for real-time updates)
  const addActivity = useCallback((activity) => {
    setActivities((prev) => [activity, ...prev.slice(0, 29)]) // Keep only 30 most recent
  }, [])

  // Update activity
  const updateActivity = useCallback((id, updates) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    )
  }, [])

  // Remove activity
  const removeActivity = useCallback((id) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id))
  }, [])

  return {
    activities,
    loading,
    error,
    refreshActivities,
    addActivity,
    updateActivity,
    removeActivity,
  }
}
