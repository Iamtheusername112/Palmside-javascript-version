'use client'

import { ResponseTemplates } from '@/components/admin/ResponseTemplates'

export default function TemplatesPage() {
  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Response Templates</h1>
        <p className='text-gray-600 mt-2'>
          Create and manage email response templates for efficient communication
        </p>
      </div>
      <ResponseTemplates />
    </div>
  )
}
