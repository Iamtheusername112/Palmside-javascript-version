'use client'

import { ContactAnalytics } from '@/components/admin/ContactAnalytics'

export default function AnalyticsPage() {
  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Analytics Dashboard
        </h1>
        <p className='text-gray-600 mt-2'>
          Comprehensive insights and performance metrics for your contact
          management system
        </p>
      </div>
      <ContactAnalytics />
    </div>
  )
}
