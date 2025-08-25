'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Star,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

const priorityLevels = [
  {
    value: 'low',
    label: 'Low',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
  },
  {
    value: 'normal',
    label: 'Normal',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
  {
    value: 'high',
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    icon: AlertTriangle,
  },
  {
    value: 'urgent',
    label: 'Urgent',
    color: 'bg-red-100 text-red-800',
    icon: Star,
  },
]

const mockPriorityContacts = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    priority: 'urgent',
    reason: 'VIP client - Property viewing request',
    assignedTo: 'Sarah Agent',
    dueDate: '2024-01-15',
    status: 'pending',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    priority: 'high',
    reason: 'Multiple property inquiries',
    assignedTo: 'Mike Agent',
    dueDate: '2024-01-16',
    status: 'in_progress',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    priority: 'normal',
    reason: 'General inquiry',
    assignedTo: 'Lisa Agent',
    dueDate: '2024-01-18',
    status: 'completed',
  },
]

export function ContactPriority() {
  const { success, error } = useToast()
  const [contacts, setContacts] = useState(mockPriorityContacts)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    priority: 'normal',
    reason: '',
    assignedTo: '',
    dueDate: '',
    status: 'pending',
  })

  const agents = [
    'Sarah Agent',
    'Mike Agent',
    'Lisa Agent',
    'Tom Agent',
    'Emma Agent',
  ]

  const addPriorityContact = () => {
    if (!newContact.firstName || !newContact.lastName || !newContact.email) {
      error('Missing Fields', 'Please fill in all required fields')
      return
    }

    const contact = {
      id: Date.now(),
      ...newContact,
    }

    setContacts((prev) => [...prev, contact])
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      priority: 'normal',
      reason: '',
      assignedTo: '',
      dueDate: '',
      status: 'pending',
    })
    setShowAddForm(false)
    success('Contact Added', 'Priority contact created successfully')
  }

  const updatePriorityContact = () => {
    if (
      !editingContact.firstName ||
      !editingContact.lastName ||
      !editingContact.email
    ) {
      error('Missing Fields', 'Please fill in all required fields')
      return
    }

    setContacts((prev) =>
      prev.map((c) => (c.id === editingContact.id ? editingContact : c))
    )
    setEditingContact(null)
    success('Contact Updated', 'Priority contact updated successfully')
  }

  const deletePriorityContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    success('Contact Removed', 'Priority contact removed successfully')
  }

  const updateStatus = (id, status) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    success('Status Updated', `Contact status changed to ${status}`)
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === 'all' || contact.priority === filter
    const matchesSearch =
      contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getPriorityIcon = (priority) => {
    const IconComponent =
      priorityLevels.find((p) => p.value === priority)?.icon || Clock
    return <IconComponent className='h-4 w-4' />
  }

  const getPriorityColor = (priority) => {
    return (
      priorityLevels.find((p) => p.value === priority)?.color ||
      'bg-gray-100 text-gray-800'
    )
  }

  const getPriorityLabel = (priority) => {
    return priorityLevels.find((p) => p.value === priority)?.label || 'Unknown'
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'default', label: 'Pending' },
      in_progress: { variant: 'secondary', label: 'In Progress' },
      completed: { variant: 'success', label: 'Completed' },
      overdue: { variant: 'destructive', label: 'Overdue' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed'
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Contact Priority Management
          </h2>
          <p className='text-gray-600'>
            Manage and track high-priority contacts
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Priority Contact
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <Filter className='h-4 w-4 text-gray-500' />
              <span className='text-sm font-medium text-gray-700'>
                Filter by Priority:
              </span>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Priorities</SelectItem>
                <SelectItem value='urgent'>Urgent</SelectItem>
                <SelectItem value='high'>High</SelectItem>
                <SelectItem value='normal'>Normal</SelectItem>
                <SelectItem value='low'>Low</SelectItem>
              </SelectContent>
            </Select>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search contacts...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Priority Contact</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  First Name
                </label>
                <Input
                  placeholder='Enter first name'
                  value={newContact.firstName}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Last Name
                </label>
                <Input
                  placeholder='Enter last name'
                  value={newContact.lastName}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Email</label>
              <Input
                placeholder='Enter email'
                value={newContact.email}
                onChange={(e) =>
                  setNewContact((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Priority
                </label>
                <Select
                  value={newContact.priority}
                  onValueChange={(value) =>
                    setNewContact((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Assigned To
                </label>
                <Select
                  value={newContact.assignedTo}
                  onValueChange={(value) =>
                    setNewContact((prev) => ({ ...prev, assignedTo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select agent' />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Due Date
                </label>
                <Input
                  type='date'
                  value={newContact.dueDate}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Reason for Priority
              </label>
              <Input
                placeholder='Enter reason for priority status'
                value={newContact.reason}
                onChange={(e) =>
                  setNewContact((prev) => ({ ...prev, reason: e.target.value }))
                }
              />
            </div>
            <div className='flex space-x-2'>
              <Button onClick={addPriorityContact}>Add Contact</Button>
              <Button variant='outline' onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      {editingContact && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Priority Contact</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  First Name
                </label>
                <Input
                  value={editingContact.firstName}
                  onChange={(e) =>
                    setEditingContact((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Last Name
                </label>
                <Input
                  value={editingContact.lastName}
                  onChange={(e) =>
                    setEditingContact((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Email</label>
              <Input
                value={editingContact.email}
                onChange={(e) =>
                  setEditingContact((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Priority
                </label>
                <Select
                  value={editingContact.priority}
                  onValueChange={(value) =>
                    setEditingContact((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Assigned To
                </label>
                <Select
                  value={editingContact.assignedTo}
                  onValueChange={(value) =>
                    setEditingContact((prev) => ({
                      ...prev,
                      assignedTo: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Due Date
                </label>
                <Input
                  type='date'
                  value={editingContact.dueDate}
                  onChange={(e) =>
                    setEditingContact((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Reason for Priority
              </label>
              <Input
                value={editingContact.reason}
                onChange={(e) =>
                  setEditingContact((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
              />
            </div>
            <div className='flex space-x-2'>
              <Button onClick={updatePriorityContact}>Update Contact</Button>
              <Button variant='outline' onClick={() => setEditingContact(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Priority Contacts List */}
      <div className='space-y-4'>
        {filteredContacts.map((contact) => (
          <Card
            key={contact.id}
            className={`${
              isOverdue(contact.dueDate, contact.status) ? 'border-red-200 bg-red-50' : ''
            }`}
          >
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`p-2 rounded-full ${getPriorityColor(
                      contact.priority
                    )}`}
                  >
                    {getPriorityIcon(contact.priority)}
                  </div>
                  <div>
                    <div className='flex items-center space-x-2'>
                      <h3 className='font-medium'>
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <Badge className={getPriorityColor(contact.priority)}>
                        {getPriorityLabel(contact.priority)}
                      </Badge>
                      {isOverdue(contact.dueDate, contact.status) && (
                        <Badge variant='destructive'>Overdue</Badge>
                      )}
                    </div>
                    <p className='text-sm text-gray-600'>{contact.email}</p>
                    <p className='text-sm text-gray-500'>{contact.reason}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>{contact.assignedTo}</p>
                    <p className='text-xs text-gray-500'>
                      Due: {contact.dueDate}
                    </p>
                    {getStatusBadge(contact.status)}
                  </div>
                  <div className='flex space-x-2'>
                    <Select
                      value={contact.status}
                      onValueChange={(value) => updateStatus(contact.id, value)}
                    >
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='in_progress'>In Progress</SelectItem>
                        <SelectItem value='completed'>Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setEditingContact(contact)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => deletePriorityContact(contact.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className='pt-6 text-center'>
            <p className='text-gray-500'>
              No priority contacts found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
