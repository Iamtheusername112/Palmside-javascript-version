'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  Eye,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useToast } from '@/contexts/ToastContext'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const {
    stats: dashboardStats,
    loading,
    error,
    refreshStats,
  } = useAdminStats()
  const { success, error: showError } = useToast()

  // Add effect to show success toast when dashboard loads
  useEffect(() => {
    if (!loading && dashboardStats) {
      success(
        'Dashboard Loaded',
        'Welcome back! Your dashboard data has been loaded successfully.'
      )
    }
  }, [loading, dashboardStats, success])

  const handleRefresh = async () => {
    try {
      await refreshStats()
      success(
        'Dashboard Refreshed',
        'Dashboard data has been updated successfully.'
      )
    } catch (error) {
      showError(
        'Refresh Failed',
        'Failed to refresh dashboard data. Please try again.'
      )
    }
  }

  // Default stats structure
  const stats = [
    {
      title: 'Total Properties',
      value: dashboardStats?.stats?.totalProperties?.value || '0',
      change: dashboardStats?.stats?.totalProperties?.change || '+0%',
      changeType:
        dashboardStats?.stats?.totalProperties?.changeType || 'positive',
      icon: Building2,
    },
    {
      title: 'Active Properties',
      value: dashboardStats?.stats?.activeProperties?.value || '0',
      change: dashboardStats?.stats?.activeProperties?.change || '+0%',
      changeType:
        dashboardStats?.stats?.activeProperties?.changeType || 'positive',
      icon: Users,
    },
    {
      title: 'Featured Properties',
      value: dashboardStats?.stats?.featuredProperties?.value || '0',
      change: dashboardStats?.stats?.featuredProperties?.change || '+0%',
      changeType:
        dashboardStats?.stats?.featuredProperties?.changeType || 'positive',
      icon: TrendingUp,
    },
    {
      title: 'Total Views',
      value: dashboardStats?.stats?.totalViews?.value || '0',
      change: dashboardStats?.stats?.totalViews?.change || '+0%',
      changeType: dashboardStats?.stats?.totalViews?.changeType || 'positive',
      icon: Eye,
    },
  ]

  const recentActivities = dashboardStats?.recentActivities || []

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600'>
            Welcome back! Here's what's happening with your properties.
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
            <div className='flex items-center space-x-2 text-red-800'>
              <span className='text-sm font-medium'>Error: {error}</span>
              <Button variant='ghost' size='sm' onClick={refreshStats}>
                <RefreshCw className='w-4 h-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                {stat.title}
              </CardTitle>
              <stat.icon className='h-4 w-4 text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {loading ? '...' : stat.value}
              </div>
              <p
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {loading ? '...' : stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-8'>
            <Link href='/admin/properties/new'>
              <Button variant='outline' className='w-full justify-start'>
                <Plus className='w-4 h-4 mr-2' />
                Add New Property
              </Button>
            </Link>
            <Link href='/admin/properties'>
              <Button variant='outline' className='w-full justify-start'>
                <Building2 className='w-4 h-4 mr-2' />
                Manage Properties
              </Button>
            </Link>
            <Link href='/admin/users'>
              <Button variant='outline' className='w-full justify-start'>
                <Users className='w-4 h-4 mr-2' />
                View Users
              </Button>
            </Link>
            <Link href='/admin/analytics'>
              <Button variant='outline' className='w-full justify-start'>
                <TrendingUp className='w-4 h-4 mr-2' />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='flex items-start space-x-3 animate-pulse'
                  >
                    <div className='w-2 h-2 bg-gray-300 rounded-full mt-2'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                      <div className='h-3 bg-gray-300 rounded w-1/2'></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className='max-h-80 overflow-y-auto space-y-3 pr-2'>
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0'
                  >
                    <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {activity.action}
                      </p>
                      <p className='text-sm text-gray-600 truncate'>
                        {activity.property !== 'N/A' ? activity.property : ''}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {new Date(activity.time).toLocaleDateString()} at{' '}
                        {new Date(activity.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}{' '}
                        by {activity.admin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
