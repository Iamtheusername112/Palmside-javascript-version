import { NextResponse } from 'next/server'

export async function GET() {
  const encoder = new TextEncoder()
  const abortController = new AbortController()

  const stream = new ReadableStream(
    {
      start(controller) {
        let isClosed = false
        let interval = null

        // Function to safely enqueue data
        const safeEnqueue = (data) => {
          try {
            if (!isClosed && controller.signal && !controller.signal.aborted) {
              controller.enqueue(data)
            }
          } catch (error) {
            console.error('Error enqueueing data:', error)
            isClosed = true
            if (interval) clearInterval(interval)
          }
        }

        // Function to safely close controller
        const safeClose = () => {
          if (!isClosed) {
            isClosed = true
            if (interval) clearInterval(interval)
            try {
              controller.close()
            } catch (closeError) {
              console.log('Controller already closed during cleanup')
            }
          }
        }

        // Send initial connection message
        const message = `data: ${JSON.stringify({
          type: 'connection_established',
          message: 'SSE connection established',
          timestamp: new Date().toISOString(),
        })}\n\n`

        safeEnqueue(encoder.encode(message))

        // Keep connection alive with periodic updates
        interval = setInterval(() => {
          if (isClosed || controller.signal?.aborted) {
            clearInterval(interval)
            return
          }

          const keepAlive = `data: ${JSON.stringify({
            type: 'keep_alive',
            timestamp: new Date().toISOString(),
          })}\n\n`

          safeEnqueue(encoder.encode(keepAlive))
        }, 30000) // Send keep-alive every 30 seconds

        // Listen for abort signal
        if (controller.signal) {
          controller.signal.addEventListener('abort', () => {
            safeClose()
          })
        }

        // Cleanup on close
        return () => {
          safeClose()
        }
      },
      cancel() {
        // This is called when the stream is cancelled
        abortController.abort()
      },
    },
    {
      signal: abortController.signal,
    }
  )

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
