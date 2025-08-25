'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { ToastProviderPrimitive } from '@/components/ui/toast'

const ToastContext = createContext()

export function ToastProvider({ children }) {
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

  const value = {
    toasts,
    toast,
    dismiss,
    success,
    error,
  }

  return (
    <ToastProviderPrimitive>
      <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    </ToastProviderPrimitive>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
