'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useContactNotifications } from '@/hooks/useContactNotifications'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Zap, Clock } from 'lucide-react'

export default function TestRealtimePage() {
  const { notifications, loading, refreshNotifications } =
    useContactNotifications()
  const [testResults, setTestResults] = useState([])

  const addTestResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults((prev) => [...prev, { message, type, timestamp }])
  }

  const testImmediateUpdate = async () => {
    addTestResult('Testing immediate notification update...', 'info')

    try {
      // Simulate marking a contact as read
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1, status: 'read' }),
      })

      if (response.ok) {
        addTestResult('✅ Contact status updated successfully', 'success')
        addTestResult(
          '📊 Notification counts should update immediately',
          'success'
        )
      } else {
        addTestResult('❌ Failed to update contact status', 'error')
      }
    } catch (error) {
      addTestResult('❌ Network error during test', 'error')
    }
  }

  const testBulkUpdate = async () => {
    addTestResult('Testing bulk notification update...', 'info')

    try {
      // Simulate marking multiple contacts as read
      const promises = [1, 2, 3].map((id) =>
        fetch('/api/admin/contacts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'read' }),
        })
      )

      const responses = await Promise.all(promises)
      const allSuccessful = responses.every((response) => response.ok)

      if (allSuccessful) {
        addTestResult('✅ Bulk update completed successfully', 'success')
        addTestResult(
          '📊 Multiple notification counts should update',
          'success'
        )
      } else {
        addTestResult('❌ Some bulk updates failed', 'error')
      }
    } catch (error) {
      addTestResult('❌ Network error during bulk test', 'error')
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>
          Real-time Notification Testing
        </h1>
        <p className='text-gray-600 mt-2'>
          Test the real-time notification system and see immediate updates
        </p>
      </div>

      {/* Current Notification Status */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Zap className='h-5 w-5 text-blue-600' />
            <span>Current Notification Counts</span>
            {loading && (
              <RefreshCw className='h-4 w-4 animate-spin text-gray-500' />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <Badge variant='destructive' className='text-lg px-4 py-2'>
                {notifications.new} New
              </Badge>
              <p className='text-sm text-gray-600 mt-1'>Unread contacts</p>
            </div>
            <div className='text-center'>
              <Badge variant='secondary' className='text-lg px-4 py-2'>
                {notifications.recent} Recent
              </Badge>
              <p className='text-sm text-gray-600 mt-1'>Last 24 hours</p>
            </div>
            <div className='text-center'>
              <Badge variant='outline' className='text-lg px-4 py-2'>
                {notifications.weekly} Weekly
              </Badge>
              <p className='text-sm text-gray-600 mt-1'>Last 7 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex space-x-4'>
            <Button onClick={testImmediateUpdate} variant='outline'>
              Test Single Update
            </Button>
            <Button onClick={testBulkUpdate} variant='outline'>
              Test Bulk Update
            </Button>
            <Button onClick={refreshNotifications} variant='outline'>
              Manual Refresh
            </Button>
            <Button onClick={clearResults} variant='outline'>
              Clear Results
            </Button>
          </div>

          <div className='text-sm text-gray-600'>
            <p>
              • Single Update: Tests immediate count changes when one contact is
              marked as read
            </p>
            <p>
              • Bulk Update: Tests count changes when multiple contacts are
              updated
            </p>
            <p>• Manual Refresh: Forces a refresh of notification counts</p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Clock className='h-5 w-5 text-gray-600' />
            <span>Test Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>
              No test results yet. Run some tests to see the results here.
            </p>
          ) : (
            <div className='space-y-2 max-h-96 overflow-y-auto'>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : result.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span>{result.message}</span>
                    <span className='text-xs opacity-75'>
                      {result.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Real-time Updates Work</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600 mb-2'>1</div>
              <h3 className='font-semibold mb-2'>Immediate Updates</h3>
              <p className='text-sm text-gray-600'>
                When you mark a contact as read, notification counts update
                instantly without page refresh
              </p>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600 mb-2'>2</div>
              <h3 className='font-semibold mb-2'>Optimistic Updates</h3>
              <p className='text-sm text-gray-600'>
                Counts are updated optimistically in the UI before the server
                confirms the change
              </p>
            </div>
            <div className='text-center p-4 bg-purple-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600 mb-2'>3</div>
              <h3 className='font-semibold mb-2'>Fallback Polling</h3>
              <p className='text-sm text-gray-600'>
                If real-time updates fail, the system falls back to periodic
                polling every 2 minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
