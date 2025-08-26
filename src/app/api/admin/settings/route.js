import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/admin/settings - Retrieve all settings
export async function GET() {
  try {
    const allSettings = await db.select().from(settings)

    // Convert array to object for easier frontend consumption
    const settingsObject = allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request) {
  try {
    const body = await request.json()
    const { section, settings: sectionSettings } = body

    // Update each setting in the section
    const updatePromises = Object.entries(sectionSettings).map(
      ([key, value]) => {
        return db
          .insert(settings)
          .values({
            key: `${section}_${key}`,
            value: JSON.stringify(value),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value: JSON.stringify(value),
              updatedAt: new Date(),
            },
          })
      }
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
    })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
