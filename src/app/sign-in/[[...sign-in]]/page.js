// import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Sign in to Admin Dashboard
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Access your Palmside Properties admin panel
          </p>
        </div>
        {/* <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        /> */}
        <div className='bg-white p-8 rounded-lg shadow-xl'>
          <p className='text-center text-gray-500'>
            Authentication temporarily disabled
          </p>
          <p className='text-center text-sm text-gray-400 mt-2'>
            Please check back later
          </p>
        </div>
      </div>
    </div>
  )
}
