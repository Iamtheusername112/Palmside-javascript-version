import { db } from '../src/lib/db/index.js'
import { sql } from 'drizzle-orm'

async function setupSettingsTable() {
  try {
    console.log('Creating settings table...')

    // Create settings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" serial PRIMARY KEY NOT NULL,
        "key" text NOT NULL,
        "value" text NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `)

    // Create unique index on key
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_idx" ON "settings" ("key")
    `)

    console.log('Settings table created successfully!')

    // Insert some default settings
    const defaultSettings = [
      { key: 'general_companyName', value: 'Palmside Real Estate' },
      { key: 'general_companyEmail', value: 'admin@palmside.com' },
      { key: 'general_companyPhone', value: '+1 (555) 123-4567' },
      {
        key: 'general_companyAddress',
        value: '123 Main Street, City, State 12345',
      },
      { key: 'general_websiteUrl', value: 'https://palmside.com' },
      { key: 'general_timezone', value: 'America/New_York' },
      { key: 'general_dateFormat', value: 'MM/DD/YYYY' },
      { key: 'general_currency', value: 'USD' },
      { key: 'general_language', value: 'en' },
      { key: 'email_smtpHost', value: 'smtp.gmail.com' },
      { key: 'email_smtpPort', value: '587' },
      { key: 'email_smtpUsername', value: 'noreply@palmside.com' },
      { key: 'email_fromEmail', value: 'noreply@palmside.com' },
      { key: 'email_fromName', value: 'Palmside Real Estate' },
      { key: 'email_replyToEmail', value: 'support@palmside.com' },
      {
        key: 'email_emailSignature',
        value: 'Best regards,\nPalmside Real Estate Team',
      },
      { key: 'notifications_emailNotifications', value: 'true' },
      { key: 'notifications_pushNotifications', value: 'true' },
      { key: 'notifications_contactAlerts', value: 'true' },
      { key: 'notifications_propertyUpdates', value: 'true' },
      { key: 'notifications_systemAlerts', value: 'true' },
      { key: 'notifications_dailyDigest', value: 'true' },
      { key: 'notifications_weeklyReport', value: 'true' },
      { key: 'notifications_instantAlerts', value: 'true' },
      { key: 'security_twoFactorAuth', value: 'true' },
      { key: 'security_sessionTimeout', value: '30' },
      { key: 'security_passwordExpiry', value: '90' },
      { key: 'security_failedLoginAttempts', value: '5' },
      { key: 'security_auditLogging', value: 'true' },
      { key: 'security_dataEncryption', value: 'true' },
      { key: 'security_backupFrequency', value: 'daily' },
      { key: 'display_theme', value: 'light' },
      { key: 'display_sidebarCollapsed', value: 'false' },
      { key: 'display_compactMode', value: 'false' },
      { key: 'display_showWelcomeMessage', value: 'true' },
      { key: 'display_dashboardLayout', value: 'grid' },
      { key: 'display_itemsPerPage', value: '20' },
      { key: 'display_autoRefresh', value: 'true' },
      { key: 'display_refreshInterval', value: '30' },
      { key: 'integrations_googleAnalytics', value: 'true' },
      { key: 'integrations_googleMaps', value: 'true' },
      { key: 'integrations_socialMedia', value: 'true' },
      { key: 'integrations_crmIntegration', value: 'false' },
      { key: 'integrations_paymentGateway', value: 'stripe' },
      { key: 'integrations_calendarSync', value: 'true' },
      { key: 'integrations_fileStorage', value: 'local' },
      { key: 'backup_autoBackup', value: 'true' },
      { key: 'backup_backupTime', value: '02:00' },
      { key: 'backup_backupRetention', value: '30' },
      { key: 'backup_includeFiles', value: 'true' },
      { key: 'backup_includeDatabase', value: 'true' },
      { key: 'backup_cloudBackup', value: 'false' },
      { key: 'backup_exportFormat', value: 'json' },
    ]

    for (const setting of defaultSettings) {
      await db.execute(sql`
        INSERT INTO "settings" ("key", "value") 
        VALUES (${setting.key}, ${setting.value})
        ON CONFLICT ("key") DO UPDATE SET 
          "value" = EXCLUDED."value",
          "updated_at" = now()
      `)
    }

    console.log('Default settings inserted successfully!')
    console.log('Settings table setup complete!')
  } catch (error) {
    console.error('Error setting up settings table:', error)
  } finally {
    process.exit(0)
  }
}

setupSettingsTable()
