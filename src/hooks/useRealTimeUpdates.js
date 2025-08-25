import { useEffect, useRef, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useRealTimeUpdates(onUpdate) {
  const eventSourceRef = useRef(null)
  const { success } = useToast()

  const setupSSE = useCallback(() => {
    if (typeof EventSource !== 'undefined') {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
        }

        // Create new SSE connection
        eventSourceRef.current = new EventSource(
          '/api/admin/contacts/notifications/stream'
        )

        eventSourceRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'notifications_update') {
              onUpdate(data)
            } else if (data.type === 'contact_update') {
              onUpdate(data)
              success('Contact Updated', 'Contact information has been updated')
            } else if (data.type === 'new_contact') {
              onUpdate(data)
              success('New Contact', 'A new contact has been submitted')
            }
          } catch (err) {
            console.error('Error parsing SSE data:', err)
          }
        }

        eventSourceRef.current.onerror = (event) => {
          console.error('SSE connection error:', event)
        }

        eventSourceRef.current.onopen = () => {
          console.log('Real-time connection established')
        }
      } catch (err) {
        console.error('Failed to setup SSE:', err)
      }
    }
  }, [onUpdate, success])

  useEffect(() => {
    setupSSE()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [setupSSE])

  const closeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }
  }, [])

  return { closeConnection }
}
