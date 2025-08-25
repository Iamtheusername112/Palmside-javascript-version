'use client'

import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast = {
        id,
        title,
        description,
        variant,
        duration,
      }

      setToasts((prev) => [...prev, newToast])

      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)

      return id
    },
    []
  )

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title, description) => {
      return toast({ title, description, variant: 'success' })
    },
    [toast]
  )

  const error = useCallback(
    (title, description) => {
      return toast({ title, description, variant: 'destructive' })
    },
    [toast]
  )

  return {
    toasts,
    toast,
    dismiss,
    success,
    error,
  }
}
