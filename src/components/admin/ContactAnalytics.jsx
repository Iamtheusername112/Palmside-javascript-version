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
} from 'lucide-react'

export function ContactAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalContacts: 1247,
    newContacts: 23,
    readContacts: 1189,
    respondedContacts: 156,
    archivedContacts: 35,
    avgResponseTime: '2.3h',
    responseRate: 87.2,
    trend: 'up',
    trendPercentage: 12.5,
  })

  const [chartData, setChartData] = useState({
    daily: [12, 19, 15, 25, 22, 30, 28],
    weekly: [89, 102, 95, 118, 125, 132, 128],
    monthly: [456, 489, 512, 534, 567, 589, 612, 634, 657, 678, 701, 724],
  })

  const refreshAnalytics = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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
      // Simple CSV export
      const csvContent = `Metric,Value\nTotal Contacts,${analytics.totalContacts}\nNew Contacts,${analytics.newContacts}\nRead Contacts,${analytics.readContacts}\nResponse Rate,${analytics.responseRate}%\n`
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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Contact Analytics
          </h2>
          <p className='text-gray-600'>
            Comprehensive insights into your contact management
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='24h'>Last 24h</SelectItem>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            onClick={refreshAnalytics}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant='outline' onClick={() => exportData('json')}>
            <Download className='h-4 w-4 mr-2' />
            Export JSON
          </Button>
          <Button variant='outline' onClick={() => exportData('csv')}>
            <Download className='h-4 w-4 mr-2' />
            Export CSV
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
            <div className='text-2xl font-bold'>
              {analytics.totalContacts.toLocaleString()}
            </div>
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
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {analytics.newContacts}
            </div>
            <p className='text-xs text-muted-foreground'>Unread submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Response Rate</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {analytics.responseRate}%
            </div>
            <p className='text-xs text-muted-foreground'>
              Contacts responded to
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg Response Time
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {analytics.avgResponseTime}
            </div>
            <p className='text-xs text-muted-foreground'>
              Time to first response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <BarChart3 className='h-5 w-5' />
              <span>Contact Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>New</span>
              <div className='flex items-center space-x-2'>
                <div className='w-20 bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-red-600 h-2 rounded-full'
                    style={{
                      width: `${
                        (analytics.newContacts / analytics.totalContacts) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className='text-sm font-medium'>
                  {analytics.newContacts}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Read</span>
              <div className='flex items-center space-x-2'>
                <div className='w-20 bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-600 h-2 rounded-full'
                    style={{
                      width: `${
                        (analytics.readContacts / analytics.totalContacts) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className='text-sm font-medium'>
                  {analytics.readContacts}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Responded</span>
              <div className='flex items-center space-x-2'>
                <div className='w-20 bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-green-600 h-2 rounded-full'
                    style={{
                      width: `${
                        (analytics.respondedContacts /
                          analytics.totalContacts) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className='text-sm font-medium'>
                  {analytics.respondedContacts}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Archived</span>
              <div className='flex items-center space-x-2'>
                <div className='w-20 bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-gray-600 h-2 rounded-full'
                    style={{
                      width: `${
                        (analytics.archivedContacts / analytics.totalContacts) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className='text-sm font-medium'>
                  {analytics.archivedContacts}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Calendar className='h-5 w-5' />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Today</span>
                <Badge variant='secondary'>{chartData.daily[6]} contacts</Badge>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Yesterday</span>
                <Badge variant='secondary'>{chartData.daily[5]} contacts</Badge>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>This Week</span>
                <Badge variant='secondary'>
                  {chartData.weekly[6]} contacts
                </Badge>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Last Week</span>
                <Badge variant='secondary'>
                  {chartData.weekly[5]} contacts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <TrendingUp className='h-5 w-5' />
              <span>Performance Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-3 bg-green-50 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <span className='text-sm font-medium text-green-800'>
                  Response rate improved
                </span>
              </div>
              <p className='text-xs text-green-600 mt-1'>
                Up 5.2% from last month
              </p>
            </div>
            <div className='p-3 bg-blue-50 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <Clock className='h-4 w-4 text-blue-600' />
                <span className='text-sm font-medium text-blue-800'>
                  Faster response times
                </span>
              </div>
              <p className='text-xs text-blue-600 mt-1'>
                Down 0.8h from last month
              </p>
            </div>
            <div className='p-3 bg-orange-50 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <MessageSquare className='h-4 w-4 text-orange-600' />
                <span className='text-sm font-medium text-orange-800'>
                  High engagement
                </span>
              </div>
              <p className='text-xs text-orange-600 mt-1'>
                23 new contacts today
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
