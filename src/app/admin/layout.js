// import { UserButton } from '@clerk/nextjs'
import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Navigation */}
      <div className='bg-white border-b border-gray-200 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-xl font-semibold text-gray-900'>
              Palmside Admin
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            {/* <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              /> */}
            <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
              <span className='text-sm font-medium text-gray-600'>A</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  )
}
