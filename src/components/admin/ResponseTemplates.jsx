'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  Star,
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useTemplates } from '@/hooks/useTemplates'
import { useContacts } from '@/hooks/useContacts'
import { EmailComposer } from './EmailComposer'

export function ResponseTemplates() {
  const { success, error } = useToast()
  const {
    templates,
    loading: templatesLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
  } = useTemplates()

  const { contacts, loading: contactsLoading } = useContacts()

  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'general',
  })

  const categories = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    {
      value: 'property',
      label: 'Property',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      value: 'appointment',
      label: 'Appointment',
      color: 'bg-green-100 text-green-800',
    },
    {
      value: 'support',
      label: 'Support',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      value: 'custom',
      label: 'Custom',
      color: 'bg-orange-100 text-orange-800',
    },
  ]

  const addTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      error('Missing Fields', 'Please fill in all required fields')
      return
    }

    try {
      await createTemplate(newTemplate)
      setNewTemplate({
        name: '',
        subject: '',
        content: '',
        category: 'general',
      })
      setShowForm(false)
    } catch (err) {
      // Error is already handled by the hook
    }
  }

  const handleUpdateTemplate = async () => {
    if (
      !editingTemplate.name ||
      !editingTemplate.subject ||
      !editingTemplate.content
    ) {
      error('Missing Fields', 'Please fill in all required fields')
      return
    }

    try {
      await updateTemplate(editingTemplate.id, editingTemplate)
      setEditingTemplate(null)
    } catch (err) {
      // Error is already handled by the hook
    }
  }

  const handleDeleteTemplate = async (id) => {
    try {
      await deleteTemplate(id)
    } catch (err) {
      // Error is already handled by the hook
    }
  }

  const copyTemplate = (template) => {
    navigator.clipboard.writeText(template.content)
    success('Template Copied', 'Template content copied to clipboard')
  }

  const useTemplate = (template) => {
    // Use real contact data from the database
    if (contacts.length === 0) {
      error('No Contacts', 'Please add some contacts before using templates')
      return
    }

    // For now, use the first contact as an example
    // In a real app, you might want to show a contact selector
    const contact = contacts[0]

    setSelectedTemplate(template)
    setSelectedContact(contact)
    setShowEmailComposer(true)
  }

  const handleEmailSent = async (emailData) => {
    // Update template usage count
    if (selectedTemplate) {
      await incrementUsage(selectedTemplate.id)
    }

    // Reset state
    setSelectedTemplate(null)
    setSelectedContact(null)
    setShowEmailComposer(false)
  }

  const getCategoryColor = (category) => {
    return (
      categories.find((c) => c.value === category)?.color ||
      'bg-gray-100 text-gray-800'
    )
  }

  const getCategoryLabel = (category) => {
    return categories.find((c) => c.value === category)?.label || 'Unknown'
  }

  if (templatesLoading || contactsLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Response Templates
          </h2>
          <p className='text-gray-600'>
            Quick response templates for common inquiries
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Template
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Add New Template</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowForm(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Template Name
                </label>
                <Input
                  placeholder='Enter template name'
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Category
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Email Subject
              </label>
              <Input
                placeholder='Enter email subject'
                value={newTemplate.subject}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Email Content
              </label>
              <Textarea
                placeholder='Enter email content (use {{variable}} for dynamic content)'
                value={newTemplate.content}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={8}
              />
              <p className='text-xs text-gray-500 mt-1'>
                Use {{ firstName }}, {{ email }}, {{ companyName }} etc. for
                dynamic content
              </p>
            </div>
            <div className='flex space-x-2'>
              <Button onClick={addTemplate}>Save Template</Button>
              <Button variant='outline' onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      {editingTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Edit Template</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setEditingTemplate(null)}
              >
                <X className='h-4 w-4' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Template Name
                </label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Category
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={editingTemplate.category}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Email Subject
              </label>
              <Input
                value={editingTemplate.subject}
                onChange={(e) =>
                  setEditingTemplate((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Email Content
              </label>
              <Textarea
                value={editingTemplate.content}
                onChange={(e) =>
                  setEditingTemplate((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={8}
              />
            </div>
            <div className='flex space-x-2'>
              <Button onClick={handleUpdateTemplate}>Update Template</Button>
              <Button
                variant='outline'
                onClick={() => setEditingTemplate(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {templates.map((template) => (
          <Card key={template.id} className='relative'>
            {template.isDefault && (
              <div className='absolute top-2 right-2'>
                <Star className='h-4 w-4 text-yellow-500 fill-current' />
              </div>
            )}
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <CardTitle className='text-lg'>{template.name}</CardTitle>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Badge className={getCategoryColor(template.category)}>
                      {getCategoryLabel(template.category)}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      Used {template.useCount} times
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='space-y-3'>
                <div>
                  <label className='text-xs font-medium text-gray-500'>
                    Subject
                  </label>
                  <p className='text-sm text-gray-900'>{template.subject}</p>
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-500'>
                    Content Preview
                  </label>
                  <p className='text-sm text-gray-600 line-clamp-3'>
                    {template.content.replace(/\{\{.*?\}\}/g, '[Variable]')}
                  </p>
                </div>
                <div className='flex space-x-2 pt-2'>
                  <Button
                    size='sm'
                    onClick={() => useTemplate(template)}
                    className='flex-1'
                  >
                    <MessageSquare className='h-4 w-4 mr-1' />
                    Use
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => copyTemplate(template)}
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
                  {!template.isDefault && (
                    <>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Variables Help */}
      <Card>
        <CardHeader>
          <CardTitle>Available Template Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h4 className='font-medium mb-2'>Contact Information</h4>
              <div className='space-y-1 text-sm text-gray-600'>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>
                    {'{firstName}'}
                  </code>{' '}
                  - Contact's first name
                </p>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>
                    {'{lastName}'}
                  </code>{' '}
                  - Contact's last name
                </p>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>{'{email}'}</code>{' '}
                  - Contact's email
                </p>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>{'{phone}'}</code>{' '}
                  - Contact's phone
                </p>
              </div>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Company Information</h4>
              <div className='space-y-1 text-sm text-gray-600'>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>
                    {'{companyName}'}
                  </code>{' '}
                  - Your company name
                </p>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>
                    {'{phoneNumber}'}
                  </code>{' '}
                  - Company phone
                </p>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>
                    {'{agentName}'}
                  </code>{' '}
                  - Agent name
                </p>
                <p>
                  <code className='bg-gray-100 px-1 rounded'>
                    {'{appointmentDate}'}
                  </code>{' '}
                  - Appointment date
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Composer */}
      <EmailComposer
        isOpen={showEmailComposer}
        onClose={() => {
          setShowEmailComposer(false)
          setSelectedTemplate(null)
          setSelectedContact(null)
        }}
        template={selectedTemplate}
        contact={selectedContact}
        onSend={handleEmailSent}
      />
    </div>
  )
}
