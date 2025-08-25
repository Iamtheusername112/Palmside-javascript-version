'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useContactNotifications } from '@/hooks/useContactNotifications'
import { ActivityFeed } from '@/components/admin/ActivityFeed'
import { ContactAnalytics } from '@/components/admin/ContactAnalytics'
import { ResponseTemplates } from '@/components/admin/ResponseTemplates'
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  Plus,
  Eye,
  ArrowRight,
} from 'lucide-react'

export default function AdminDashboard() {
  const { notifications } = useContactNotifications()
  const [activeTab, setActiveTab] = useState('overview')
  const [quickStats, setQuickStats] = useState({
    totalContacts: 1247,
    newContacts: 23,
    readContacts: 1189,
    respondedContacts: 156,
    avgResponseTime: '2.3h',
    responseRate: 87.2,
    todayContacts: 28,
    weeklyGrowth: 12.5,
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'activity', label: 'Activity Feed', icon: Eye },
    { id: 'templates', label: 'Response Templates', icon: FileText },
  ]

  const recentContacts = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'new',
      time: '2 min ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'read',
      time: '15 min ago',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'responded',
      time: '1 hour ago',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      status: 'new',
      time: '2 hours ago',
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: 'default', label: 'New' },
      read: { variant: 'secondary', label: 'Read' },
      responded: { variant: 'success', label: 'Responded' },
      archived: { variant: 'outline', label: 'Archived' },
    }
    const config = statusConfig[status] || statusConfig.new
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className='space-y-6'>
            {/* Quick Stats */}
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
                    {quickStats.totalContacts.toLocaleString()}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    +{quickStats.weeklyGrowth}% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    New Contacts
                  </CardTitle>
                  <MessageSquare className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-red-600'>
                    {quickStats.newContacts}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {quickStats.todayContacts} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Response Rate
                  </CardTitle>
                  <CheckCircle className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-green-600'>
                    {quickStats.responseRate}%
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Avg: {quickStats.avgResponseTime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Today's Activity
                  </CardTitle>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-blue-600'>
                    {quickStats.todayContacts}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    New contacts today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Recent Contacts</span>
                    <Button variant='ghost' size='sm'>
                      View All <ArrowRight className='h-4 w-4 ml-1' />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {recentContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className='flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50'
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                            <span className='text-sm font-medium text-gray-600'>
                              {contact.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className='text-sm font-medium'>
                              {contact.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {contact.email}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          {getStatusBadge(contact.status)}
                          <span className='text-xs text-gray-400'>
                            {contact.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Button className='w-full justify-start' variant='outline'>
                      <Plus className='h-4 w-4 mr-2' />
                      Add New Contact
                    </Button>
                    <Button className='w-full justify-start' variant='outline'>
                      <MessageSquare className='h-4 w-4 mr-2' />
                      Send Bulk Response
                    </Button>
                    <Button className='w-full justify-start' variant='outline'>
                      <FileText className='h-4 w-4 mr-2' />
                      Generate Report
                    </Button>
                    <Button className='w-full justify-start' variant='outline'>
                      <Settings className='h-4 w-4 mr-2' />
                      Manage Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='text-center p-4 bg-red-50 rounded-lg'>
                    <div className='text-2xl font-bold text-red-600 mb-2'>
                      {notifications.new}
                    </div>
                    <p className='text-sm text-red-600'>New Contacts</p>
                    <p className='text-xs text-red-500'>Require attention</p>
                  </div>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600 mb-2'>
                      {notifications.recent}
                    </div>
                    <p className='text-sm text-blue-600'>Recent Contacts</p>
                    <p className='text-xs text-blue-500'>Last 24 hours</p>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600 mb-2'>
                      {notifications.weekly}
                    </div>
                    <p className='text-sm text-green-600'>Weekly Total</p>
                    <p className='text-xs text-green-500'>Last 7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'analytics':
        return <ContactAnalytics />
      case 'activity':
        return <ActivityFeed />
      case 'templates':
        return <ResponseTemplates />
      default:
        return null
    }
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
        <p className='text-gray-600 mt-2'>
          Welcome back! Here's what's happening with your contacts today.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className='h-4 w-4' />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}
