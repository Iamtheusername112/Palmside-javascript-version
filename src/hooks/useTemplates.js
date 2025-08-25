import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { success, error: showError } = useToast()

  // Fetch all templates
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/templates')
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }
      const data = await response.json()
      setTemplates(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      showError('Fetch Failed', 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }, [showError])

  // Create new template
  const createTemplate = useCallback(
    async (templateData) => {
      try {
        const response = await fetch('/api/admin/templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create template')
        }

        const newTemplate = await response.json()
        setTemplates((prev) => [...prev, newTemplate])
        success('Template Created', 'Response template created successfully')
        return newTemplate
      } catch (err) {
        showError('Creation Failed', err.message)
        throw err
      }
    },
    [success, showError]
  )

  // Update template
  const updateTemplate = useCallback(
    async (id, templateData) => {
      try {
        const response = await fetch(`/api/admin/templates/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update template')
        }

        const updatedTemplate = await response.json()
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? updatedTemplate : t))
        )
        success('Template Updated', 'Response template updated successfully')
        return updatedTemplate
      } catch (err) {
        showError('Update Failed', err.message)
        throw err
      }
    },
    [success, showError]
  )

  // Delete template
  const deleteTemplate = useCallback(
    async (id) => {
      try {
        const response = await fetch(`/api/admin/templates/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete template')
        }

        setTemplates((prev) => prev.filter((t) => t.id !== id))
        success('Template Deleted', 'Response template removed successfully')
      } catch (err) {
        showError('Deletion Failed', err.message)
        throw err
      }
    },
    [success, showError]
  )

  // Increment usage count
  const incrementUsage = useCallback(
    async (id) => {
      try {
        const template = templates.find((t) => t.id === id)
        if (!template) return

        const updatedTemplate = {
          ...template,
          useCount: template.useCount + 1,
        }

        await updateTemplate(id, updatedTemplate)
      } catch (err) {
        console.error('Failed to increment usage count:', err)
      }
    },
    [templates, updateTemplate]
  )

  // Load templates on mount
  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
    refetch: fetchTemplates,
  }
}
