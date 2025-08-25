import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    readContacts: 0,
    respondedContacts: 0,
    avgResponseTime: '0h',
    responseRate: 0,
    todayContacts: 0,
    weeklyGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { error: showError } = useToast()

  // Fetch admin statistics
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats')
      }
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      showError('Stats Failed', 'Failed to load admin statistics')
    } finally {
      setLoading(false)
    }
  }, [showError])

  // Load stats on mount
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Refresh stats
  const refreshStats = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}
