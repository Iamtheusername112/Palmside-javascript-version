import { NextResponse } from 'next/server'

// In-memory store for connected clients (in production, use Redis or similar)
let connectedClients = new Set()

export async function POST(request) {
  try {
    const { type, data } = await request.json()

    // Broadcast to all connected clients
    const message = JSON.stringify({
      type,
      data,
      timestamp: new Date().toISOString(),
    })

    // In a real implementation, you would use a pub/sub system like Redis
    // For now, we'll just return success
    console.log(`Broadcasting ${type}:`, data)

    return NextResponse.json({
      success: true,
      message: `Broadcasted ${type} to ${connectedClients.size} clients`,
      clientsCount: connectedClients.size,
    })
  } catch (error) {
    console.error('Broadcast error:', error)
    return NextResponse.json(
      { error: 'Failed to broadcast message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    connectedClients: connectedClients.size,
    message: 'Broadcast endpoint ready',
  })
}
