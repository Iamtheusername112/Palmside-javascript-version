import { NextResponse } from 'next/server'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false

      // Send initial connection message
      const message = `data: ${JSON.stringify({
        type: 'connection_established',
        message: 'SSE connection established',
        timestamp: new Date().toISOString(),
      })}\n\n`

      try {
        controller.enqueue(encoder.encode(message))
      } catch (error) {
        console.error('Error sending initial message:', error)
        controller.close()
        return
      }

      // Keep connection alive with periodic updates
      const interval = setInterval(() => {
        try {
          // Check if controller is still open before sending
          if (isClosed) {
            clearInterval(interval)
            return
          }

          const keepAlive = `data: ${JSON.stringify({
            type: 'keep_alive',
            timestamp: new Date().toISOString(),
          })}\n\n`

          controller.enqueue(encoder.encode(keepAlive))
        } catch (error) {
          console.error('Error sending keep-alive:', error)
          clearInterval(interval)
          isClosed = true
          try {
            controller.close()
          } catch (closeError) {
            // Controller might already be closed, ignore this error
            console.log('Controller already closed during cleanup')
          }
        }
      }, 30000) // Send keep-alive every 30 seconds

      // Cleanup on close
      return () => {
        isClosed = true
        clearInterval(interval)
        try {
          if (!controller.signal?.aborted) {
            controller.close()
          }
        } catch (closeError) {
          // Controller might already be closed, ignore this error
          console.log('Controller already closed during final cleanup')
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}
