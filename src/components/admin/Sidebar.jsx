'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContactNotifications } from '@/hooks/useContactNotifications'
import {
  Home,
  Building2,
  Users,
  BarChart3,
  Settings,
  Plus,
  FileText,
  MessageSquare,
  Contact,
  Zap,
  Star,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Add Property', href: '/admin/properties/new', icon: Plus },
  {
    name: 'Contacts',
    href: '/admin/contacts',
    icon: Contact,
    hasNotifications: true,
  },
  { name: 'Priority', href: '/admin/priority', icon: Star },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Test Realtime', href: '/admin/contacts/test-realtime', icon: Zap },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { notifications, loading } = useContactNotifications()

  return (
    <div className='w-64 bg-white border-r border-gray-200 min-h-screen'>
      <div className='p-6'>
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
            <Building2 className='w-5 h-5 text-white' />
          </div>
          <span className='text-lg font-semibold text-gray-900'>Admin</span>
        </div>
      </div>

      <nav className='px-3'>
        <ul className='space-y-1'>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const showNotification =
              item.hasNotifications && notifications.new > 0

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <item.icon className='w-5 h-5' />
                    <span>{item.name}</span>
                  </div>

                  {showNotification && (
                    <div className='flex items-center space-x-1'>
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full transition-all duration-200 ${
                          loading ? 'animate-pulse' : ''
                        }`}
                      >
                        {notifications.new}
                      </span>
                      {notifications.recent > 0 &&
                        notifications.recent !== notifications.new && (
                          <span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-orange-500 bg-orange-100 rounded-full'>
                            +{notifications.recent}
                          </span>
                        )}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
