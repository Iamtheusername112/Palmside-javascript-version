import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Test database connection
    const result = await db.execute(sql`SELECT version()`)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      version: result[0].version,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database connection error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
