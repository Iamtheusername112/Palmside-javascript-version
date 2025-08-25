'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Building2,
  Users,
  BarChart3,
  Settings,
  Plus,
  FileText,
  MessageSquare,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Add Property', href: '/admin/properties/new', icon: Plus },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

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
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className='w-5 h-5' />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
