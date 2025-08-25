'use client'

import { ContactPriority } from '@/components/admin/ContactPriority'

export default function PriorityPage() {
  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Priority Management
        </h1>
        <p className='text-gray-600 mt-2'>
          Manage high-priority contacts and track their progress
        </p>
      </div>
      <ContactPriority />
    </div>
  )
}
