import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useSettings() {
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Palmside Real Estate',
      companyEmail: 'admin@palmside.com',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Main Street, City, State 12345',
      websiteUrl: 'https://palmside.com',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'noreply@palmside.com',
      smtpPassword: '',
      fromEmail: 'noreply@palmside.com',
      fromName: 'Palmside Real Estate',
      replyToEmail: 'support@palmside.com',
      emailSignature: 'Best regards,\nPalmside Real Estate Team',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      contactAlerts: true,
      propertyUpdates: true,
      systemAlerts: true,
      marketingEmails: false,
      dailyDigest: true,
      weeklyReport: true,
      instantAlerts: true,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      failedLoginAttempts: 5,
      ipWhitelist: '',
      auditLogging: true,
      dataEncryption: true,
      backupFrequency: 'daily',
    },
    display: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false,
      showWelcomeMessage: true,
      dashboardLayout: 'grid',
      itemsPerPage: 20,
      autoRefresh: true,
      refreshInterval: 30,
    },
    integrations: {
      googleAnalytics: true,
      googleMaps: true,
      socialMedia: true,
      crmIntegration: false,
      paymentGateway: 'stripe',
      calendarSync: true,
      fileStorage: 'local',
    },
    backup: {
      autoBackup: true,
      backupTime: '02:00',
      backupRetention: 30,
      includeFiles: true,
      includeDatabase: true,
      cloudBackup: false,
      exportFormat: 'json',
    },
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { success, error } = useToast()

  // Load settings from API
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')

      if (!response.ok) {
        throw new Error('Failed to load settings')
      }

      const apiSettings = await response.json()

      // Merge API settings with defaults
      const mergedSettings = { ...settings }
      Object.entries(apiSettings).forEach(([key, value]) => {
        const [section, settingKey] = key.split('_', 2)
        if (mergedSettings[section] && settingKey) {
          try {
            mergedSettings[section][settingKey] = JSON.parse(value)
          } catch {
            mergedSettings[section][settingKey] = value
          }
        }
      })

      setSettings(mergedSettings)
    } catch (err) {
      console.error('Failed to load settings:', err)
      error('Load Failed', 'Failed to load settings from server')
    } finally {
      setLoading(false)
    }
  }, [error])

  // Save settings to API
  const saveSettings = useCallback(
    async (section) => {
      try {
        setSaving(true)
        const response = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            section,
            settings: settings[section],
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to save settings')
        }

        const result = await response.json()
        success('Settings Saved', result.message)
        return true
      } catch (err) {
        console.error('Failed to save settings:', err)
        error(
          'Save Failed',
          `Failed to save ${section} settings: ${err.message}`
        )
        return false
      } finally {
        setSaving(false)
      }
    },
    [settings, success, error]
  )

  // Test email configuration
  const testEmail = useCallback(
    async (emailSettings) => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/settings/test-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailSettings }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to send test email')
        }

        const result = await response.json()
        success('Email Test', result.message)
        return true
      } catch (err) {
        console.error('Failed to send test email:', err)
        error('Email Test Failed', err.message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [success, error]
  )

  // Create backup
  const createBackup = useCallback(
    async (backupSettings) => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/settings/backup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backupSettings),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create backup')
        }

        const result = await response.json()
        success('Backup Complete', result.message)
        return result
      } catch (err) {
        console.error('Failed to create backup:', err)
        error('Backup Failed', err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [success, error]
  )

  // Export data
  const exportData = useCallback(
    async (format, options = {}) => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/settings/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            format,
            includeProperties: options.includeProperties ?? true,
            includeContacts: options.includeContacts ?? true,
            includeTemplates: options.includeTemplates ?? true,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to export data')
        }

        // Handle file download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download =
          response.headers
            .get('Content-Disposition')
            ?.split('filename=')[1]
            ?.replace(/"/g, '') || `export.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        success(
          'Export Complete',
          `Data exported successfully in ${format.toUpperCase()} format`
        )
        return true
      } catch (err) {
        console.error('Failed to export data:', err)
        error('Export Failed', err.message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [success, error]
  )

  // Update a specific setting
  const updateSetting = useCallback((section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }, [])

  // Reset settings to defaults
  const resetSettings = useCallback(
    (section) => {
      const defaultSettings = {
        general: {
          companyName: 'Palmside Real Estate',
          companyEmail: 'admin@palmside.com',
          companyPhone: '+1 (555) 123-4567',
          companyAddress: '123 Main Street, City, State 12345',
          websiteUrl: 'https://palmside.com',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          currency: 'USD',
          language: 'en',
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: '587',
          smtpUsername: 'noreply@palmside.com',
          smtpPassword: '',
          fromEmail: 'noreply@palmside.com',
          fromName: 'Palmside Real Estate',
          replyToEmail: 'support@palmside.com',
          emailSignature: 'Best regards,\nPalmside Real Estate Team',
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          contactAlerts: true,
          propertyUpdates: true,
          systemAlerts: true,
          marketingEmails: false,
          dailyDigest: true,
          weeklyReport: true,
          instantAlerts: true,
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 30,
          passwordExpiry: 90,
          failedLoginAttempts: 5,
          ipWhitelist: '',
          auditLogging: true,
          dataEncryption: true,
          backupFrequency: 'daily',
        },
        display: {
          theme: 'light',
          sidebarCollapsed: false,
          compactMode: false,
          showWelcomeMessage: true,
          dashboardLayout: 'grid',
          itemsPerPage: 20,
          autoRefresh: true,
          refreshInterval: 30,
        },
        integrations: {
          googleAnalytics: true,
          googleMaps: true,
          socialMedia: true,
          crmIntegration: false,
          paymentGateway: 'stripe',
          calendarSync: true,
          fileStorage: 'local',
        },
        backup: {
          autoBackup: true,
          backupTime: '02:00',
          backupRetention: 30,
          includeFiles: true,
          includeDatabase: true,
          cloudBackup: false,
          exportFormat: 'json',
        },
      }

      if (section === 'all') {
        setSettings(defaultSettings)
      } else {
        setSettings((prev) => ({
          ...prev,
          [section]: defaultSettings[section],
        }))
      }

      success(
        'Settings Reset',
        `${
          section === 'all' ? 'All' : section
        } settings have been reset to defaults!`
      )
    },
    [success]
  )

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    loading,
    saving,
    loadSettings,
    saveSettings,
    testEmail,
    createBackup,
    exportData,
    updateSetting,
    resetSettings,
  }
}
