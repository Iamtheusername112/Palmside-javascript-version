'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Activity,
  MessageSquare,
  Eye,
  CheckCircle,
  Archive,
  Clock,
  RefreshCw,
  Filter,
  User,
  Settings,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useActivityFeed } from '@/hooks/useActivityFeed'

const activityTypes = {
  contact_viewed: {
    icon: Eye,
    label: 'Viewed',
    color: 'bg-blue-100 text-blue-800',
  },
  contact_marked_read: {
    icon: CheckCircle,
    label: 'Marked Read',
    color: 'bg-green-100 text-green-800',
  },
  contact_responded: {
    icon: MessageSquare,
    label: 'Responded',
    color: 'bg-purple-100 text-purple-800',
  },
  contact_archived: {
    icon: Archive,
    label: 'Archived',
    color: 'bg-gray-100 text-gray-800',
  },
  new_contact: {
    icon: MessageSquare,
    label: 'New Contact',
    color: 'bg-red-100 text-red-800',
  },
  admin_action: {
    icon: Settings,
    label: 'Admin Action',
    color: 'bg-orange-100 text-orange-800',
  },
}

export function ActivityFeed() {
  const [filter, setFilter] = useState('all')
  const { activities, loading, error, refreshActivities } = useActivityFeed()

  const getActivityIcon = (type) => {
    const config = activityTypes[type] || activityTypes.admin_action
    const IconComponent = config.icon
    return <IconComponent className='h-4 w-4' />
  }

  const getActivityColor = (type) => {
    const config = activityTypes[type] || activityTypes.admin_action
    return config.color
  }

  const getActivityLabel = (type) => {
    const config = activityTypes[type] || activityTypes.admin_action
    return config.label
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true
    if (filter === 'contacts') return activity.entityType === 'contact'
    if (filter === 'admin') return activity.type === 'admin_action'
    return true
  })

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center h-32'>
          <div className='text-center'>
            <p className='text-red-600 mb-2'>Failed to load activity feed</p>
            <Button onClick={refreshActivities} variant='outline' size='sm'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Activity Feed</h2>
          <p className='text-gray-600 mt-1'>
            Real-time updates on contacts and admin activities
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Activities</SelectItem>
              <SelectItem value='contacts'>Contact Activities</SelectItem>
              <SelectItem value='admin'>Admin Actions</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='sm' onClick={refreshActivities}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Activity className='h-5 w-5' />
            <span>Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No activities found
            </div>
          ) : (
            <ScrollArea className='h-96'>
              <div className='space-y-4'>
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50'
                  >
                    <div
                      className={`p-2 rounded-full ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center space-x-2 mb-1'>
                        <Badge variant='outline' className='text-xs'>
                          {getActivityLabel(activity.type)}
                        </Badge>
                        <span className='text-xs text-gray-500'>
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className='text-sm font-medium text-gray-900'>
                        {activity.description}
                      </p>
                      {activity.contactName && (
                        <div className='flex items-center space-x-2 mt-1'>
                          <User className='h-3 w-3 text-gray-400' />
                          <span className='text-xs text-gray-600'>
                            {activity.contactName} ({activity.contactEmail})
                          </span>
                        </div>
                      )}
                      {activity.details && (
                        <p className='text-xs text-gray-500 mt-1'>
                          {activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <MessageSquare className='h-5 w-5 text-blue-600' />
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  Total Activities
                </p>
                <p className='text-2xl font-bold text-blue-600'>
                  {activities.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <User className='h-5 w-5 text-green-600' />
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  Contact Activities
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  {activities.filter((a) => a.entityType === 'contact').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <Settings className='h-5 w-5 text-orange-600' />
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  Admin Actions
                </p>
                <p className='text-2xl font-bold text-orange-600'>
                  {activities.filter((a) => a.type === 'admin_action').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
