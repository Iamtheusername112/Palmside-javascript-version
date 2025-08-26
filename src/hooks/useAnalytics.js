import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useAnalytics(period = '30d') {
  const [analytics, setAnalytics] = useState({
    period,
    contactStats: {
      totalContacts: 0,
      newContacts: 0,
      readContacts: 0,
      respondedContacts: 0,
      todayContacts: 0,
      weeklyGrowth: 0,
      responseRate: 0,
      avgResponseTime: '0h',
    },
    propertyStats: {
      totalProperties: 0,
      activeProperties: 0,
      pendingProperties: 0,
      featuredProperties: 0,
      newProperties: 0,
      utilizationRate: 0,
    },
    systemStats: {
      metrics: [],
      systemHealth: 98,
      uptime: '99.8%',
      avgResponseTime: '45ms',
      pageLoadTime: '2.1s',
    },
    trends: [],
    priorityStats: {
      high: 0,
      medium: 0,
      low: 0,
    },
    conversionStats: {
      pending: 0,
      converted: 0,
      lost: 0,
      followUp: 0,
    },
    performanceStats: {
      responseTimeTarget: '2h',
      responseTimeAchievement: 0,
      conversionTarget: 85,
      conversionAchievement: 0,
      totalActivities: 0,
      peakHours: '2-4 PM',
      bestDays: 'Tue, Wed',
      seasonalPeak: 'Spring',
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { error: showError } = useToast()

  // Fetch comprehensive analytics
  const fetchAnalytics = useCallback(
    async (selectedPeriod = period) => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/admin/analytics?period=${selectedPeriod}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalytics(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        showError('Analytics Failed', 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    },
    [period, showError]
  )

  // Load analytics on mount
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Refresh analytics
  const refreshAnalytics = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Change period and refetch
  const changePeriod = useCallback(
    (newPeriod) => {
      fetchAnalytics(newPeriod)
    },
    [fetchAnalytics]
  )

  return {
    analytics,
    loading,
    error,
    refreshAnalytics,
    changePeriod,
  }
}
