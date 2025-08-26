import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, contacts, responseTemplates } from '@/lib/db/schema'

export async function POST(request) {
  try {
    const body = await request.json()
    const { format, includeProperties, includeContacts, includeTemplates } =
      body

    const exportData = {}
    const timestamp = new Date().toISOString()

    if (includeProperties) {
      const propertiesData = await db.select().from(properties)
      exportData.properties = propertiesData
    }

    if (includeContacts) {
      const contactsData = await db.select().from(contacts)
      exportData.contacts = contactsData
    }

    if (includeTemplates) {
      const templatesData = await db.select().from(responseTemplates)
      exportData.templates = templatesData
    }

    exportData.metadata = {
      exportedAt: timestamp,
      format: format,
      version: '1.0',
    }

    let responseData
    let contentType
    let filename

    switch (format.toLowerCase()) {
      case 'json':
        responseData = JSON.stringify(exportData, null, 2)
        contentType = 'application/json'
        filename = `export_${timestamp.replace(/[:.]/g, '-')}.json`
        break

      case 'csv':
        responseData = convertToCSV(exportData)
        contentType = 'text/csv'
        filename = `export_${timestamp.replace(/[:.]/g, '-')}.csv`
        break

      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        )
    }

    const response = new NextResponse(responseData)
    response.headers.set('Content-Type', contentType)
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    )

    return response
  } catch (error) {
    console.error('Failed to export data:', error)
    return NextResponse.json(
      { error: 'Failed to export data: ' + error.message },
      { status: 500 }
    )
  }
}

function convertToCSV(data) {
  const csvRows = []

  // Add metadata
  csvRows.push(['Metadata'])
  csvRows.push(['Exported At', data.metadata.exportedAt])
  csvRows.push(['Format', data.metadata.format])
  csvRows.push(['Version', data.metadata.version])
  csvRows.push([])

  // Convert each table to CSV
  Object.entries(data).forEach(([tableName, tableData]) => {
    if (tableName === 'metadata') return

    if (tableData && tableData.length > 0) {
      csvRows.push([tableName.toUpperCase()])

      // Headers
      const headers = Object.keys(tableData[0])
      csvRows.push(headers)

      // Data rows
      tableData.forEach((row) => {
        const values = headers.map((header) => {
          const value = row[header]
          return typeof value === 'string'
            ? `"${value.replace(/"/g, '""')}"`
            : value
        })
        csvRows.push(values)
      })

      csvRows.push([])
    }
  })

  return csvRows.map((row) => row.join(',')).join('\n')
}
