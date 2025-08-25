import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  // Mock data - replace with real data from database
  const stats = [
    {
      title: 'Total Properties',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Building2,
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Monthly Revenue',
      value: '$45,678',
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Property Views',
      value: '8,901',
      change: '+15%',
      changeType: 'positive',
      icon: Eye,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'New property added',
      property: 'Modern Downtown Apartment',
      time: '2 hours ago',
      admin: 'John Doe',
    },
    {
      id: 2,
      action: 'Property status updated',
      property: 'Luxury Family Home',
      time: '4 hours ago',
      admin: 'Jane Smith',
    },
    {
      id: 3,
      action: 'New user registered',
      property: 'N/A',
      time: '6 hours ago',
      admin: 'System',
    },
  ]

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
          <Link href='/admin/properties/new'>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

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
                {stat.value}
              </div>
              <p
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change} from last month
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
          <CardContent className='space-y-3'>
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
            <div className='space-y-4'>
              {recentActivities.map((activity) => (
                <div key={activity.id} className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-primary rounded-full mt-2'></div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-900'>
                      {activity.action}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {activity.property !== 'N/A' ? activity.property : ''}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {activity.time} by {activity.admin}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
