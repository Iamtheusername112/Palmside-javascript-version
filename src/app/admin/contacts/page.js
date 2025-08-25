'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/contexts/ToastContext'
import { useContactNotifications } from '@/hooks/useContactNotifications'
import {
  Search,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Phone,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { EmailComposer } from '@/components/admin/EmailComposer'

export default function AdminContactsPage() {
  const { success, error } = useToast()
  const { notifications, markContactAsRead, updateCountsBulk } =
    useContactNotifications()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [emailContact, setEmailContact] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchContacts()
  }, [filters])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        status: filters.status,
        search: filters.search,
      })

      const response = await fetch(`/api/admin/contacts?${params}`)
      const data = await response.json()

      if (response.ok) {
        setContacts(data.contacts)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch contacts:', data.error)
        error(
          'Failed to fetch contacts',
          data.error || 'An error occurred while loading contacts'
        )
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      error('Network Error', 'Failed to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id, newStatus, previousStatus) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === id ? { ...contact, status: newStatus } : contact
          )
        )

        // Update selected contact if it's the one being viewed
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact((prev) => ({ ...prev, status: newStatus }))
        }

        // Immediately update notification counts if marking as read
        if (previousStatus === 'new' && newStatus !== 'new') {
          markContactAsRead(id, previousStatus)
        }

        success('Status Updated', `Contact status updated to ${newStatus}`)
      } else {
        const data = await response.json()
        error('Update Failed', data.error || 'Failed to update contact status')
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
      error('Network Error', 'Failed to connect to the server')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: 'default', label: 'New' },
      read: { variant: 'secondary', label: 'Read' },
      responded: { variant: 'success', label: 'Responded' },
      archived: { variant: 'outline', label: 'Archived' },
    }

    const config = statusConfig[status] || statusConfig.new
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleMarkContactAsRead = async (contactId) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: contactId, status: 'read' }),
      })

      if (response.ok) {
        // Update local state
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === contactId ? { ...contact, status: 'read' } : contact
          )
        )

        // Update selected contact if it's the one being viewed
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact((prev) => ({ ...prev, status: 'read' }))
        }

        // Immediately update notification counts
        markContactAsRead(contactId, 'new')
      }
    } catch (error) {
      console.error('Error marking contact as read:', error)
    }
  }

  const handleBulkMarkAsRead = async () => {
    if (selectedContacts.length === 0) return

    try {
      const promises = selectedContacts.map((contactId) =>
        fetch('/api/admin/contacts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: contactId, status: 'read' }),
        })
      )

      const responses = await Promise.all(promises)
      const allSuccessful = responses.every((response) => response.ok)

      if (allSuccessful) {
        // Update local state
        setContacts((prev) =>
          prev.map((contact) =>
            selectedContacts.includes(contact.id)
              ? { ...contact, status: 'read' }
              : contact
          )
        )

        // Update selected contact if it's being viewed
        if (selectedContact && selectedContacts.includes(selectedContact.id)) {
          setSelectedContact((prev) => ({ ...prev, status: 'read' }))
        }

        // Immediately update notification counts
        updateCountsBulk(selectedContacts, 'new')

        // Clear selection
        setSelectedContacts([])

        success(
          'Bulk Update',
          `${selectedContacts.length} contacts marked as read`
        )
      } else {
        error('Bulk Update Failed', 'Some contacts could not be updated')
      }
    } catch (error) {
      console.error('Error in bulk update:', error)
      error('Network Error', 'Failed to connect to the server')
    }
  }

  const handleSelectContact = (contactId, checked) => {
    if (checked) {
      setSelectedContacts((prev) => [...prev, contactId])
    } else {
      setSelectedContacts((prev) => prev.filter((id) => id !== contactId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      const newContactIds = contacts
        .filter((contact) => contact.status === 'new')
        .map((contact) => contact.id)
      setSelectedContacts(newContactIds)
    } else {
      setSelectedContacts([])
    }
  }

  const handleQuickEmail = (contact) => {
    setEmailContact(contact)
    setShowEmailComposer(true)
  }

  const handleEmailSent = (emailData) => {
    success('Email Sent', `Email sent to ${emailData.to}`)
    setShowEmailComposer(false)
    setEmailContact(null)
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Contact Submissions
          </h1>
          <p className='text-gray-600 mt-2'>
            Manage and respond to contact form submissions
          </p>
        </div>
        <div className='flex items-center space-x-4'>
          {notifications.new > 0 && (
            <Badge variant='destructive' className='text-sm'>
              {notifications.new} New
            </Badge>
          )}
          {notifications.recent > 0 &&
            notifications.recent !== notifications.new && (
              <Badge variant='secondary' className='text-sm'>
                +{notifications.recent} Recent
              </Badge>
            )}
          <Badge variant='outline' className='text-sm'>
            Total: {pagination.total}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg border p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <Filter className='h-4 w-4 text-gray-500' />
              <span className='text-sm font-medium text-gray-700'>
                Filters:
              </span>
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='new'>New</SelectItem>
                <SelectItem value='read'>Read</SelectItem>
                <SelectItem value='responded'>Responded</SelectItem>
                <SelectItem value='archived'>Archived</SelectItem>
              </SelectContent>
            </Select>

            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search contacts...'
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>
                {selectedContacts.length} selected
              </span>
              <Button
                size='sm'
                variant='outline'
                onClick={handleBulkMarkAsRead}
              >
                Mark as Read
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contacts Table */}
      <div className='bg-white rounded-lg border overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className='p-8 text-center'>
            <MessageSquare className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600'>No contacts found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-12'>
                  <input
                    type='checkbox'
                    checked={
                      contacts.filter((c) => c.status === 'new').length > 0 &&
                      selectedContacts.length ===
                        contacts.filter((c) => c.status === 'new').length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    {contact.status === 'new' && (
                      <input
                        type='checkbox'
                        checked={selectedContacts.includes(contact.id)}
                        onChange={(e) =>
                          handleSelectContact(contact.id, e.target.checked)
                        }
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    )}
                  </TableCell>
                  <TableCell className='font-mono text-sm'>
                    #{contact.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>
                        {contact.firstName} {contact.lastName}
                      </div>
                      {contact.phone && (
                        <div className='text-sm text-gray-500 flex items-center'>
                          <Phone className='h-3 w-3 mr-1' />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <Mail className='h-4 w-4 mr-2 text-gray-400' />
                      {contact.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='max-w-xs truncate' title={contact.subject}>
                      {contact.subject}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contact.status)}</TableCell>
                  <TableCell>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Calendar className='h-4 w-4 mr-2' />
                      {formatDate(contact.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          setSelectedContact(contact)
                          setShowDetails(true)
                          // Mark as read if it's a new contact
                          if (contact.status === 'new') {
                            handleMarkContactAsRead(contact.id)
                          }
                        }}
                      >
                        <Eye className='h-4 w-4 mr-1' />
                        View
                      </Button>

                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleQuickEmail(contact)}
                      >
                        <Mail className='h-4 w-4 mr-1' />
                        Email
                      </Button>

                      <Select
                        value={contact.status}
                        onValueChange={(value) =>
                          updateContactStatus(contact.id, value, contact.status)
                        }
                      >
                        <SelectTrigger className='w-24 h-8'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='new'>New</SelectItem>
                          <SelectItem value='read'>Read</SelectItem>
                          <SelectItem value='responded'>Responded</SelectItem>
                          <SelectItem value='archived'>Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-between bg-white rounded-lg border p-4'>
          <div className='text-sm text-gray-700'>
            Showing page {pagination.page} of {pagination.totalPages}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Contact Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <User className='h-5 w-5 mr-2' />
              Contact Details #{selectedContact?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className='space-y-6'>
              {/* Basic Info */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    First Name
                  </label>
                  <p className='text-gray-900'>{selectedContact.firstName}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Last Name
                  </label>
                  <p className='text-gray-900'>{selectedContact.lastName}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <p className='text-gray-900'>{selectedContact.email}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Phone
                  </label>
                  <p className='text-gray-900'>
                    {selectedContact.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Subject & Message */}
              <div>
                <label className='text-sm font-medium text-gray-700'>
                  Subject
                </label>
                <p className='text-gray-900 font-medium'>
                  {selectedContact.subject}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700'>
                  Message
                </label>
                <div className='mt-2 p-3 bg-gray-50 rounded-lg'>
                  <p className='text-gray-900 whitespace-pre-wrap'>
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <label className='font-medium text-gray-700'>Status</label>
                  <div className='mt-1'>
                    {getStatusBadge(selectedContact.status)}
                  </div>
                </div>
                <div>
                  <label className='font-medium text-gray-700'>Submitted</label>
                  <p className='text-gray-600'>
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
                <div>
                  <label className='font-medium text-gray-700'>
                    IP Address
                  </label>
                  <p className='text-gray-600 font-mono'>
                    {selectedContact.ipAddress || 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className='font-medium text-gray-700'>
                    User Agent
                  </label>
                  <p
                    className='text-gray-600 text-xs truncate'
                    title={selectedContact.userAgent}
                  >
                    {selectedContact.userAgent || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className='border-t pt-4'>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Update Status
                </label>
                <Select
                  value={selectedContact.status}
                  onValueChange={(value) =>
                    updateContactStatus(
                      selectedContact.id,
                      value,
                      selectedContact.status
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='new'>New</SelectItem>
                    <SelectItem value='read'>Read</SelectItem>
                    <SelectItem value='responded'>Responded</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Composer */}
      <EmailComposer
        isOpen={showEmailComposer}
        onClose={() => {
          setShowEmailComposer(false)
          setEmailContact(null)
        }}
        template={null} // No template pre-selected
        contact={emailContact}
        onSend={handleEmailSent}
      />
    </div>
  )
}
