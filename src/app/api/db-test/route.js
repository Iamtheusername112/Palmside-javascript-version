import { testConnection } from '@/lib/db/connection'

export async function GET() {
  try {
    const isConnected = await testConnection()

    if (isConnected) {
      return Response.json({
        success: true,
        message: 'Database connection successful',
      })
    } else {
      return Response.json(
        {
          success: false,
          message: 'Database connection failed',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Database test failed',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
