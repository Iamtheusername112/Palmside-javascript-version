'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  StarOff,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/useToast'

export function PropertyActions({ property, onDelete, onToggleFeatured }) {
  const { success, error: showError } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (onDelete) {
        await onDelete(property.id)
        success(
          'Property Deleted',
          `${property.title} has been successfully deleted.`
        )
      }
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error deleting property:', error)
      showError(
        'Delete Failed',
        'Failed to delete the property. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleFeatured = async () => {
    try {
      setIsTogglingFeatured(true)
      const response = await fetch(
        `/api/properties/${property.id}/toggle-featured`,
        {
          method: 'PATCH',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to toggle featured status')
      }

      if (onToggleFeatured) {
        onToggleFeatured()
      }

      success(
        'Featured Status Updated',
        `${property.title} has been ${
          property.isFeatured ? 'removed from' : 'marked as'
        } featured.`
      )
    } catch (error) {
      console.error('Error toggling featured:', error)
      showError(
        'Update Failed',
        'Failed to update featured status. Please try again.'
      )
    } finally {
      setIsTogglingFeatured(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/properties/${property.id}`}
              className='flex items-center'
            >
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/properties/${property.id}/edit`}
              className='flex items-center'
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit Property
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={toggleFeatured}
            className='flex items-center'
            disabled={isTogglingFeatured}
          >
            {isTogglingFeatured ? (
              <>
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                {property.isFeatured ? 'Removing...' : 'Marking...'}
              </>
            ) : property.isFeatured ? (
              <>
                <StarOff className='mr-2 h-4 w-4' />
                Remove from Featured
              </>
            ) : (
              <>
                <Star className='mr-2 h-4 w-4' />
                Mark as Featured
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className='flex items-center text-red-600 focus:text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Property
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property "{property.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              {isDeleting ? 'Deleting...' : 'Delete Property'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
