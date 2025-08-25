'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useContacts } from '@/hooks/useContacts'

export function ContactAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)

  const { stats, loading: statsLoading, refreshStats } = useAdminStats()
  const { contacts, loading: contactsLoading } = useContacts(1, 100) // Get more contacts for analytics

  const [analytics, setAnalytics] = useState({
    totalContacts: 0,
    newContacts: 0,
    readContacts: 0,
    respondedContacts: 0,
    archivedContacts: 0,
    avgResponseTime: '0h',
    responseRate: 0,
    trend: 'up',
    trendPercentage: 0,
  })

  const [chartData, setChartData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  })

  // Update analytics when stats change
  useEffect(() => {
    if (stats && !statsLoading) {
      setAnalytics({
        totalContacts: stats.totalContacts || 0,
        newContacts: stats.newContacts || 0,
        readContacts: stats.readContacts || 0,
        respondedContacts: stats.respondedContacts || 0,
        archivedContacts: 0, // Not currently tracked in schema
        avgResponseTime: stats.avgResponseTime || '0h',
        responseRate: stats.responseRate || 0,
        trend: stats.weeklyGrowth >= 0 ? 'up' : 'down',
        trendPercentage: Math.abs(stats.weeklyGrowth || 0),
      })
    }
  }, [stats, statsLoading])

  // Generate chart data from real contact data
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      generateChartData()
    }
  }, [contacts, timeRange])

  const generateChartData = () => {
    if (!contacts || contacts.length === 0) return

    const now = new Date()
    const dailyData = []
    const weeklyData = []
    const monthlyData = []

    // Generate daily data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayContacts = contacts.filter((contact) => {
        const contactDate = new Date(contact.createdAt)
        return contactDate >= dayStart && contactDate <= dayEnd
      }).length

      dailyData.push(dayContacts)
    }

    // Generate weekly data for last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - i * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const weekContacts = contacts.filter((contact) => {
        const contactDate = new Date(contact.createdAt)
        return contactDate >= weekStart && contactDate <= weekEnd
      }).length

      weeklyData.push(weekContacts)
    }

    // Generate monthly data for last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
        999
      )

      const monthContacts = contacts.filter((contact) => {
        const contactDate = new Date(contact.createdAt)
        return contactDate >= monthStart && contactDate <= monthEnd
      }).length

      monthlyData.push(monthContacts)
    }

    setChartData({
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
    })
  }

  const refreshAnalytics = async () => {
    setLoading(true)
    try {
      await refreshStats()
      generateChartData()
    } catch (error) {
      console.error('Failed to refresh analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = (format) => {
    const data = {
      timeRange,
      analytics,
      chartData,
      exportedAt: new Date().toISOString(),
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contact-analytics-${timeRange}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      // Enhanced CSV export with real data
      const csvContent = `Metric,Value\nTotal Contacts,${analytics.totalContacts}\nNew Contacts,${analytics.newContacts}\nRead Contacts,${analytics.readContacts}\nResponded Contacts,${analytics.respondedContacts}\nResponse Rate,${analytics.responseRate}%\nAverage Response Time,${analytics.avgResponseTime}\nWeekly Growth,${analytics.trendPercentage}%\n`
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contact-analytics-${timeRange}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className='h-4 w-4 text-green-600' />
    }
    return <TrendingDown className='h-4 w-4 text-red-600' />
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  const getCurrentChartData = () => {
    switch (timeRange) {
      case '7d':
        return chartData.daily
      case '4w':
        return chartData.weekly
      case '12m':
        return chartData.monthly
      default:
        return chartData.daily
    }
  }

  const getChartLabels = () => {
    switch (timeRange) {
      case '7d':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      case '4w':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      case '12m':
        return [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
      default:
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  }

  if (statsLoading || contactsLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Contact Analytics
          </h2>
          <p className='text-gray-600 mt-1'>
            Track your contact performance and response metrics
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='4w'>Last 4 weeks</SelectItem>
              <SelectItem value='12m'>Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            size='sm'
            onClick={refreshAnalytics}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Contacts
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analytics.totalContacts}</div>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              {getTrendIcon(analytics.trend)}
              <span className={getTrendColor(analytics.trend)}>
                {analytics.trendPercentage}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>New Contacts</CardTitle>
            <AlertCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analytics.newContacts}</div>
            <p className='text-xs text-muted-foreground'>Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Response Rate</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analytics.responseRate}%</div>
            <p className='text-xs text-muted-foreground'>
              Avg response time: {analytics.avgResponseTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Read Contacts</CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analytics.readContacts}</div>
            <p className='text-xs text-muted-foreground'>
              {analytics.totalContacts > 0
                ? Math.round(
                    (analytics.readContacts / analytics.totalContacts) * 100
                  )
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-80 flex items-end justify-center space-x-2'>
            {getCurrentChartData().map((value, index) => (
              <div key={index} className='flex flex-col items-center space-y-2'>
                <div
                  className='w-8 bg-blue-500 rounded-t'
                  style={{
                    height: `${Math.max(
                      (value / Math.max(...getCurrentChartData())) * 200,
                      20
                    )}px`,
                  }}
                />
                <span className='text-xs text-gray-500'>
                  {getChartLabels()[index]}
                </span>
                <span className='text-xs font-medium'>{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-3'>
            <Button
              variant='outline'
              onClick={() => exportData('json')}
              className='flex items-center space-x-2'
            >
              <Download className='h-4 w-4' />
              <span>Export JSON</span>
            </Button>
            <Button
              variant='outline'
              onClick={() => exportData('csv')}
              className='flex items-center space-x-2'
            >
              <Download className='h-4 w-4' />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
