import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, contacts, responseTemplates } from '@/lib/db/schema'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request) {
  try {
    const body = await request.json()
    const { includeDatabase, includeFiles, backupType } = body

    const backupData = {}
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

    if (includeDatabase) {
      // Backup database tables
      const [propertiesData, contactsData, templatesData] = await Promise.all([
        db.select().from(properties),
        db.select().from(contacts),
        db.select().from(responseTemplates),
      ])

      backupData.database = {
        properties: propertiesData,
        contacts: contactsData,
        responseTemplates: templatesData,
        timestamp: new Date().toISOString(),
      }
    }

    if (includeFiles) {
      // Backup file information (you can extend this to include actual file backups)
      backupData.files = {
        message: 'File backup information collected',
        timestamp: new Date().toISOString(),
      }
    }

    // Create backup directory if it doesn't exist
    const backupDir = join(process.cwd(), 'backups')
    await mkdir(backupDir, { recursive: true })

    // Save backup file
    const backupFileName = `backup_${timestamp}.json`
    const backupPath = join(backupDir, backupFileName)

    await writeFile(backupPath, JSON.stringify(backupData, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Backup created successfully',
      backupFile: backupFileName,
      backupPath: backupPath,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to create backup:', error)
    return NextResponse.json(
      { error: 'Failed to create backup: ' + error.message },
      { status: 500 }
    )
  }
}
