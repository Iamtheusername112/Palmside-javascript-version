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
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
}

export function ActivityFeed() {
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration - in real app, this would come from SSE or WebSocket
  const mockActivities = [
    {
      id: 1,
      type: 'new_contact',
      contactId: 123,
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      description: 'New contact submission received',
    },
    {
      id: 2,
      type: 'contact_viewed',
      contactId: 122,
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      description: 'Contact details viewed',
    },
    {
      id: 3,
      type: 'contact_marked_read',
      contactId: 121,
      contactName: 'Bob Johnson',
      contactEmail: 'bob@example.com',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      description: 'Contact marked as read',
    },
    {
      id: 4,
      type: 'contact_responded',
      contactId: 120,
      contactName: 'Alice Brown',
      contactEmail: 'alice@example.com',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      description: 'Response sent to contact',
    },
  ]

  useEffect(() => {
    setActivities(mockActivities)
  }, [])

  const addActivity = (activity) => {
    setActivities((prev) => [activity, ...prev.slice(0, 49)]) // Keep last 50 activities
  }

  const refreshActivities = () => {
    setLoading(true)
    // Simulate refresh
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true
    return activity.type === filter
  })

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getActivityIcon = (type) => {
    const IconComponent = activityTypes[type]?.icon || Clock
    return <IconComponent className='h-4 w-4' />
  }

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center space-x-2'>
            <Activity className='h-5 w-5 text-blue-600' />
            <span>Live Activity Feed</span>
          </CardTitle>
          <div className='flex items-center space-x-2'>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className='w-32 h-8'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Activities</SelectItem>
                <SelectItem value='new_contact'>New Contacts</SelectItem>
                <SelectItem value='contact_viewed'>Viewed</SelectItem>
                <SelectItem value='contact_marked_read'>Marked Read</SelectItem>
                <SelectItem value='contact_responded'>Responded</SelectItem>
                <SelectItem value='contact_archived'>Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size='sm'
              variant='outline'
              onClick={refreshActivities}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <ScrollArea className='h-[400px]'>
          <div className='space-y-3'>
            {filteredActivities.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <Activity className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                <p>No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className='flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors'
                >
                  <div className='flex-shrink-0 mt-1'>
                    <div
                      className={`p-2 rounded-full ${
                        activityTypes[activity.type]?.color || 'bg-gray-100'
                      }`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <span className='text-sm font-medium text-gray-900'>
                        {activity.contactName}
                      </span>
                      <Badge variant='outline' className='text-xs'>
                        {activityTypes[activity.type]?.label || 'Unknown'}
                      </Badge>
                    </div>
                    <p className='text-sm text-gray-600 mb-1'>
                      {activity.description}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs text-gray-500'>
                        {activity.contactEmail}
                      </span>
                      <span className='text-xs text-gray-400'>
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='flex-shrink-0'
                    onClick={() => {
                      // Navigate to contact details
                      window.location.href = `/admin/contacts?id=${activity.contactId}`
                    }}
                  >
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
