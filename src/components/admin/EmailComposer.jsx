'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  X,
  User,
  Mail,
  Phone,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { emailService } from '@/lib/email-service'

export function EmailComposer({ isOpen, onClose, template, contact, onSend }) {
  const { success, error } = useToast()
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: '',
    preview: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (template && contact) {
      // Populate with template and contact data
      let populatedSubject = template.subject
      let populatedContent = template.content

      // Replace template variables with actual contact data
      const variables = {
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        companyName: 'Palmside Real Estate',
        phoneNumber: '+1 (555) 123-4567',
        agentName: 'Your Agent Name',
        appointmentDate: new Date().toLocaleDateString(),
        appointmentTime: '10:00 AM',
        appointmentLocation: 'Office',
        appointmentDuration: '1 hour',
        propertyName: 'Sample Property',
        propertyDetails: 'Beautiful 3-bedroom home with modern amenities...',
      }

      // Replace all variables in subject and content
      Object.entries(variables).forEach(([variable, value]) => {
        const regex = new RegExp(`{{${variable}}}`, 'g')
        populatedSubject = populatedSubject.replace(regex, value)
        populatedContent = populatedContent.replace(regex, regex, value)
      })

      setEmailData({
        to: contact.email || '',
        subject: populatedSubject,
        content: populatedContent,
        preview: false,
      })
    }
  }, [template, contact])

  const handleSend = async () => {
    if (!emailData.to || !emailData.subject || !emailData.content) {
      error('Missing Fields', 'Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Send email using the email service
      const result = await emailService.sendEmail(emailData)

      if (result.success) {
        success('Email Sent', result.message)

        // Call the onSend callback if provided
        if (onSend) {
          onSend(emailData)
        }

        onClose()
      } else {
        throw new Error(result.message || 'Failed to send email')
      }
    } catch (err) {
      error(
        'Send Failed',
        err.message || 'Failed to send email. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const togglePreview = () => {
    setEmailData((prev) => ({ ...prev, preview: !prev.preview }))
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-4xl max-h-[90vh] overflow-hidden'>
        <CardHeader className='flex items-center justify-between'>
          <CardTitle className='flex items-center space-x-2'>
            <Mail className='h-5 w-5' />
            <span>Compose Email</span>
            {template && (
              <Badge variant='outline'>Using: {template.name}</Badge>
            )}
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>
        <CardContent className='space-y-4 overflow-y-auto max-h-[70vh]'>
          {/* Contact Info */}
          {contact && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h4 className='font-medium mb-2 flex items-center'>
                <User className='h-4 w-4 mr-2' />
                Contact Information
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-600'>Name:</span>
                  <span className='ml-2 font-medium'>
                    {contact.firstName} {contact.lastName}
                  </span>
                </div>
                <div>
                  <span className='text-gray-600'>Email:</span>
                  <span className='ml-2 font-medium'>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div>
                    <span className='text-gray-600'>Phone:</span>
                    <span className='ml-2 font-medium'>{contact.phone}</span>
                  </div>
                )}
                <div>
                  <span className='text-gray-600'>Company:</span>
                  <span className='ml-2 font-medium'>Palmside Real Estate</span>
                </div>
              </div>
            </div>
          )}

          {/* Email Form */}
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>To:</label>
              <Input
                value={emailData.to}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, to: e.target.value }))
                }
                placeholder='Recipient email'
              />
            </div>

            <div>
              <label className='text-sm font-medium mb-2 block'>Subject:</label>
              <Input
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder='Email subject'
              />
            </div>

            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-sm font-medium'>Content:</label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={togglePreview}
                >
                  {emailData.preview ? (
                    <>
                      <EyeOff className='h-4 w-4 mr-1' />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className='h-4 w-4 mr-1' />
                      Preview
                    </>
                  )}
                </Button>
              </div>

              {emailData.preview ? (
                <div className='border rounded-lg p-4 bg-white min-h-[200px] whitespace-pre-wrap'>
                  {emailData.content}
                </div>
              ) : (
                <Textarea
                  value={emailData.content}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder='Email content'
                  rows={12}
                  className='font-mono text-sm'
                />
              )}
            </div>
          </div>

          {/* Template Variables Help */}
          {!emailData.preview && (
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-medium mb-2 text-blue-800'>
                Available Variables:
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700'>
                <div>
                  <code className='bg-blue-100 px-1 rounded'>
                    {'{firstName}'}
                  </code>{' '}
                  - First name
                </div>
                <div>
                  <code className='bg-blue-100 px-1 rounded'>
                    {'{lastName}'}
                  </code>{' '}
                  - Last name
                </div>
                <div>
                  <code className='bg-blue-100 px-1 rounded'>{'{email}'}</code>{' '}
                  - Email
                </div>
                <div>
                  <code className='bg-blue-100 px-1 rounded'>{'{phone}'}</code>{' '}
                  - Phone
                </div>
                <div>
                  <code className='bg-blue-100 px-1 rounded'>
                    {'{companyName}'}
                  </code>{' '}
                  - Company
                </div>
                <div>
                  <code className='bg-blue-100 px-1 rounded'>
                    {'{agentName}'}
                  </code>{' '}
                  - Agent name
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className='flex justify-end space-x-2 pt-4 border-t'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={loading}
              className='min-w-[100px]'
            >
              {loading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              ) : (
                <>
                  <Send className='h-4 w-4 mr-2' />
                  Send
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
