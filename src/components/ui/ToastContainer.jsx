'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/contexts/ToastContext'

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {toasts && toasts.length > 0 && (
        <>
          {toasts.map(({ id, title, description, variant }) => (
            <Toast key={id} variant={variant}>
              <div className='grid gap-1'>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              <ToastClose onClick={() => dismiss(id)} />
            </Toast>
          ))}
        </>
      )}
      <ToastViewport />
    </>
  )
}
