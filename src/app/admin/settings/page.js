'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/contexts/ToastContext'
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Mail,
  Globe,
  Database,
  User,
  Palette,
  Zap,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Monitor,
  FileText,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Building2,
} from 'lucide-react'

export default function SettingsPage() {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Palmside Real Estate',
    companyEmail: 'admin@palmside.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Main Street, City, State 12345',
    websiteUrl: 'https://palmside.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
  })

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@palmside.com',
    smtpPassword: '',
    fromEmail: 'noreply@palmside.com',
    fromName: 'Palmside Real Estate',
    replyToEmail: 'support@palmside.com',
    emailSignature: 'Best regards,\nPalmside Real Estate Team',
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
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
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    failedLoginAttempts: 5,
    ipWhitelist: '',
    auditLogging: true,
    dataEncryption: true,
    backupFrequency: 'daily',
  })

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false,
    showWelcomeMessage: true,
    dashboardLayout: 'grid',
    itemsPerPage: 20,
    autoRefresh: true,
    refreshInterval: 30,
  })

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalytics: true,
    googleMaps: true,
    socialMedia: true,
    crmIntegration: false,
    paymentGateway: 'stripe',
    calendarSync: true,
    fileStorage: 'local',
  })

  // Backup & Export Settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupTime: '02:00',
    backupRetention: 30,
    includeFiles: true,
    includeDatabase: true,
    cloudBackup: false,
    exportFormat: 'json',
  })

  const handleSave = async (section) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would make actual API calls to save settings
      console.log(`Saving ${section} settings...`)

      success(
        'Settings Saved',
        `${section} settings have been saved successfully!`
      )
    } catch (err) {
      error('Save Failed', `Failed to save ${section} settings: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = (section) => {
    // Reset settings to defaults
    console.log(`Resetting ${section} settings...`)
    success(
      'Settings Reset',
      `${section} settings have been reset to defaults!`
    )
  }

  const handleTestEmail = async () => {
    setLoading(true)
    try {
      // Simulate email test
      await new Promise((resolve) => setTimeout(resolve, 2000))
      success('Email Test', 'Test email sent successfully! Check your inbox.')
    } catch (err) {
      error(
        'Email Test Failed',
        'Failed to send test email. Please check your settings.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    setLoading(true)
    try {
      // Simulate backup process
      await new Promise((resolve) => setTimeout(resolve, 3000))
      success('Backup Complete', 'System backup completed successfully!')
    } catch (err) {
      error('Backup Failed', 'Failed to create backup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format) => {
    // Implement data export
    console.log(`Exporting data in ${format} format`)
    success(
      'Export Started',
      `Data export in ${format.toUpperCase()} format has started!`
    )
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Settings</h1>
          <p className='text-gray-600 mt-2'>
            Configure your application settings and preferences
          </p>
        </div>
        <div className='flex space-x-3'>
          <Button variant='outline' onClick={() => window.location.reload()}>
            <RefreshCw className='w-4 h-4 mr-2' />
            Reset All
          </Button>
          <Button onClick={() => handleSave('all')} disabled={saving}>
            <Save className='w-4 h-4 mr-2' />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue='general' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-7'>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='email'>Email</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='display'>Display</TabsTrigger>
          <TabsTrigger value='integrations'>Integrations</TabsTrigger>
          <TabsTrigger value='backup'>Backup</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value='general' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Building2 className='h-5 w-5' />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>
                Basic company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='companyName'>Company Name</Label>
                  <Input
                    id='companyName'
                    value={generalSettings.companyName}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    placeholder='Enter company name'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='companyEmail'>Company Email</Label>
                  <Input
                    id='companyEmail'
                    type='email'
                    value={generalSettings.companyEmail}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        companyEmail: e.target.value,
                      }))
                    }
                    placeholder='Enter company email'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='companyPhone'>Company Phone</Label>
                  <Input
                    id='companyPhone'
                    value={generalSettings.companyPhone}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        companyPhone: e.target.value,
                      }))
                    }
                    placeholder='Enter company phone'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='websiteUrl'>Website URL</Label>
                  <Input
                    id='websiteUrl'
                    value={generalSettings.websiteUrl}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        websiteUrl: e.target.value,
                      }))
                    }
                    placeholder='Enter website URL'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='companyAddress'>Company Address</Label>
                <Textarea
                  id='companyAddress'
                  value={generalSettings.companyAddress}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      companyAddress: e.target.value,
                    }))
                  }
                  placeholder='Enter company address'
                  rows={3}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='timezone'>Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        timezone: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='America/New_York'>
                        Eastern Time
                      </SelectItem>
                      <SelectItem value='America/Chicago'>
                        Central Time
                      </SelectItem>
                      <SelectItem value='America/Denver'>
                        Mountain Time
                      </SelectItem>
                      <SelectItem value='America/Los_Angeles'>
                        Pacific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='dateFormat'>Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        dateFormat: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MM/DD/YYYY'>MM/DD/YYYY</SelectItem>
                      <SelectItem value='DD/MM/YYYY'>DD/MM/YYYY</SelectItem>
                      <SelectItem value='YYYY-MM-DD'>YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='currency'>Currency</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        currency: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='USD'>USD ($)</SelectItem>
                      <SelectItem value='EUR'>EUR (€)</SelectItem>
                      <SelectItem value='GBP'>GBP (£)</SelectItem>
                      <SelectItem value='CAD'>CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => handleReset('general')}
                >
                  Reset
                </Button>
                <Button onClick={() => handleSave('general')} disabled={saving}>
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value='email' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Mail className='h-5 w-5' />
                <span>Email Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure SMTP settings and email preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='smtpHost'>SMTP Host</Label>
                  <Input
                    id='smtpHost'
                    value={emailSettings.smtpHost}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpHost: e.target.value,
                      }))
                    }
                    placeholder='smtp.gmail.com'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='smtpPort'>SMTP Port</Label>
                  <Input
                    id='smtpPort'
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpPort: e.target.value,
                      }))
                    }
                    placeholder='587'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='smtpUsername'>SMTP Username</Label>
                  <Input
                    id='smtpUsername'
                    value={emailSettings.smtpUsername}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpUsername: e.target.value,
                      }))
                    }
                    placeholder='Enter SMTP username'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='smtpPassword'>SMTP Password</Label>
                  <Input
                    id='smtpPassword'
                    type='password'
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpPassword: e.target.value,
                      }))
                    }
                    placeholder='Enter SMTP password'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='fromEmail'>From Email</Label>
                  <Input
                    id='fromEmail'
                    type='email'
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        fromEmail: e.target.value,
                      }))
                    }
                    placeholder='noreply@company.com'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='fromName'>From Name</Label>
                  <Input
                    id='fromName'
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        fromName: e.target.value,
                      }))
                    }
                    placeholder='Company Name'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='emailSignature'>Email Signature</Label>
                <Textarea
                  id='emailSignature'
                  value={emailSettings.emailSignature}
                  onChange={(e) =>
                    setEmailSettings((prev) => ({
                      ...prev,
                      emailSignature: e.target.value,
                    }))
                  }
                  placeholder='Enter email signature'
                  rows={4}
                />
              </div>

              <div className='flex justify-between items-center pt-4'>
                <Button
                  variant='outline'
                  onClick={handleTestEmail}
                  disabled={loading}
                >
                  <Mail className='w-4 h-4 mr-2' />
                  {loading ? 'Sending...' : 'Send Test Email'}
                </Button>

                <div className='flex space-x-3'>
                  <Button
                    variant='outline'
                    onClick={() => handleReset('email')}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => handleSave('email')} disabled={saving}>
                    <Save className='w-4 h-4 mr-2' />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value='notifications' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Bell className='h-5 w-5' />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <h4 className='font-medium'>Notification Channels</h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Mail className='h-4 w-4 text-gray-500' />
                      <span>Email Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Smartphone className='h-4 w-4 text-gray-500' />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          smsNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Bell className='h-4 w-4 text-gray-500' />
                      <span>Push Notifications</span>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          pushNotifications: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h4 className='font-medium'>Notification Types</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Contact Alerts</span>
                      <Switch
                        checked={notificationSettings.contactAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            contactAlerts: checked,
                          }))
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Property Updates</span>
                      <Switch
                        checked={notificationSettings.propertyUpdates}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            propertyUpdates: checked,
                          }))
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>System Alerts</span>
                      <Switch
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            systemAlerts: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Daily Digest</span>
                      <Switch
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            dailyDigest: checked,
                          }))
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Weekly Report</span>
                      <Switch
                        checked={notificationSettings.weeklyReport}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            weeklyReport: checked,
                          }))
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Instant Alerts</span>
                      <Switch
                        checked={notificationSettings.instantAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            instantAlerts: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => handleReset('notifications')}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave('notifications')}
                  disabled={saving}
                >
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Shield className='h-5 w-5' />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security preferences and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <h4 className='font-medium'>Authentication</h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Key className='h-4 w-4 text-gray-500' />
                      <span>Two-Factor Authentication</span>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          twoFactorAuth: checked,
                        }))
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Clock className='h-4 w-4 text-gray-500' />
                      <span>Session Timeout (minutes)</span>
                    </div>
                    <Select
                      value={securitySettings.sessionTimeout.toString()}
                      onValueChange={(value) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          sessionTimeout: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='15'>15</SelectItem>
                        <SelectItem value='30'>30</SelectItem>
                        <SelectItem value='60'>60</SelectItem>
                        <SelectItem value='120'>120</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h4 className='font-medium'>Password Policy</h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span>Password Expiry (days)</span>
                    <Select
                      value={securitySettings.passwordExpiry.toString()}
                      onValueChange={(value) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          passwordExpiry: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='30'>30</SelectItem>
                        <SelectItem value='60'>60</SelectItem>
                        <SelectItem value='90'>90</SelectItem>
                        <SelectItem value='180'>180</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span>Failed Login Attempts</span>
                    <Select
                      value={securitySettings.failedLoginAttempts.toString()}
                      onValueChange={(value) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          failedLoginAttempts: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='3'>3</SelectItem>
                        <SelectItem value='5'>5</SelectItem>
                        <SelectItem value='10'>10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h4 className='font-medium'>System Security</h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span>Audit Logging</span>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          auditLogging: checked,
                        }))
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <span>Data Encryption</span>
                    <Switch
                      checked={securitySettings.dataEncryption}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          dataEncryption: checked,
                        }))
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <span>Backup Frequency</span>
                    <Select
                      value={securitySettings.backupFrequency}
                      onValueChange={(value) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          backupFrequency: value,
                        }))
                      }
                    >
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => handleReset('security')}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave('security')}
                  disabled={saving}
                >
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value='display' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Palette className='h-5 w-5' />
                <span>Display & Interface</span>
              </CardTitle>
              <CardDescription>
                Customize the appearance and layout of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>Theme & Appearance</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Theme</span>
                      <Select
                        value={displaySettings.theme}
                        onValueChange={(value) =>
                          setDisplaySettings((prev) => ({
                            ...prev,
                            theme: value,
                          }))
                        }
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='light'>Light</SelectItem>
                          <SelectItem value='dark'>Dark</SelectItem>
                          <SelectItem value='auto'>Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Compact Mode</span>
                      <Switch
                        checked={displaySettings.compactMode}
                        onCheckedChange={(checked) =>
                          setDisplaySettings((prev) => ({
                            ...prev,
                            compactMode: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Show Welcome Message</span>
                      <Switch
                        checked={displaySettings.showWelcomeMessage}
                        onCheckedChange={(checked) =>
                          setDisplaySettings((prev) => ({
                            ...prev,
                            showWelcomeMessage: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Dashboard Layout</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Layout Style</span>
                      <Select
                        value={displaySettings.dashboardLayout}
                        onValueChange={(value) =>
                          setDisplaySettings((prev) => ({
                            ...prev,
                            dashboardLayout: value,
                          }))
                        }
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='grid'>Grid</SelectItem>
                          <SelectItem value='list'>List</SelectItem>
                          <SelectItem value='cards'>Cards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Items Per Page</span>
                      <Select
                        value={displaySettings.itemsPerPage.toString()}
                        onValueChange={(value) =>
                          setDisplaySettings((prev) => ({
                            ...prev,
                            itemsPerPage: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='10'>10</SelectItem>
                          <SelectItem value='20'>20</SelectItem>
                          <SelectItem value='50'>50</SelectItem>
                          <SelectItem value='100'>100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h4 className='font-medium'>Auto-Refresh Settings</h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span>Enable Auto-Refresh</span>
                    <Switch
                      checked={displaySettings.autoRefresh}
                      onCheckedChange={(checked) =>
                        setDisplaySettings((prev) => ({
                          ...prev,
                          autoRefresh: checked,
                        }))
                      }
                    />
                  </div>

                  {displaySettings.autoRefresh && (
                    <div className='flex items-center justify-between'>
                      <span>Refresh Interval (seconds)</span>
                      <Select
                        value={displaySettings.refreshInterval.toString()}
                        onValueChange={(value) =>
                          setDisplaySettings((prev) => ({
                            ...prev,
                            refreshInterval: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='15'>15</SelectItem>
                          <SelectItem value='30'>30</SelectItem>
                          <SelectItem value='60'>60</SelectItem>
                          <SelectItem value='300'>5 min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => handleReset('display')}
                >
                  Reset
                </Button>
                <Button onClick={() => handleSave('display')} disabled={saving}>
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value='integrations' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Zap className='h-5 w-5' />
                <span>Third-Party Integrations</span>
              </CardTitle>
              <CardDescription>
                Manage external service connections and API integrations
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>Analytics & Tracking</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Google Analytics</span>
                      <Switch
                        checked={integrationSettings.googleAnalytics}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            googleAnalytics: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Google Maps</span>
                      <Switch
                        checked={integrationSettings.googleMaps}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            googleMaps: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Social Media</span>
                      <Switch
                        checked={integrationSettings.socialMedia}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            socialMedia: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Business Tools</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>CRM Integration</span>
                      <Switch
                        checked={integrationSettings.crmIntegration}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            crmIntegration: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Calendar Sync</span>
                      <Switch
                        checked={integrationSettings.calendarSync}
                        onCheckedChange={(checked) =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            calendarSync: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Payment Gateway</span>
                      <Select
                        value={integrationSettings.paymentGateway}
                        onValueChange={(value) =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            paymentGateway: value,
                          }))
                        }
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='stripe'>Stripe</SelectItem>
                          <SelectItem value='paypal'>PayPal</SelectItem>
                          <SelectItem value='square'>Square</SelectItem>
                          <SelectItem value='none'>None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => handleReset('integrations')}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave('integrations')}
                  disabled={saving}
                >
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value='backup' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Database className='h-5 w-5' />
                <span>Backup & Export</span>
              </CardTitle>
              <CardDescription>
                Manage system backups and data export options
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>Automatic Backups</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Enable Auto-Backup</span>
                      <Switch
                        checked={backupSettings.autoBackup}
                        onCheckedChange={(checked) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            autoBackup: checked,
                          }))
                        }
                      />
                    </div>

                    {backupSettings.autoBackup && (
                      <>
                        <div className='flex items-center justify-between'>
                          <span>Backup Time</span>
                          <Input
                            type='time'
                            value={backupSettings.backupTime}
                            onChange={(e) =>
                              setBackupSettings((prev) => ({
                                ...prev,
                                backupTime: e.target.value,
                              }))
                            }
                            className='w-32'
                          />
                        </div>

                        <div className='flex items-center justify-between'>
                          <span>Retention (days)</span>
                          <Select
                            value={backupSettings.backupRetention.toString()}
                            onValueChange={(value) =>
                              setBackupSettings((prev) => ({
                                ...prev,
                                backupRetention: parseInt(value),
                              }))
                            }
                          >
                            <SelectTrigger className='w-32'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='7'>7 days</SelectItem>
                              <SelectItem value='30'>30 days</SelectItem>
                              <SelectItem value='90'>90 days</SelectItem>
                              <SelectItem value='365'>1 year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Backup Content</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Include Files</span>
                      <Switch
                        checked={backupSettings.includeFiles}
                        onCheckedChange={(checked) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            includeFiles: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Include Database</span>
                      <Switch
                        checked={backupSettings.includeDatabase}
                        onCheckedChange={(checked) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            includeDatabase: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Cloud Backup</span>
                      <Switch
                        checked={backupSettings.cloudBackup}
                        onCheckedChange={(checked) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            cloudBackup: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h4 className='font-medium'>Manual Operations</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Button
                    onClick={handleBackup}
                    disabled={loading}
                    className='w-full'
                  >
                    <Database className='w-4 h-4 mr-2' />
                    {loading ? 'Creating...' : 'Create Backup'}
                  </Button>

                  <Button
                    variant='outline'
                    onClick={() => handleExport('json')}
                    className='w-full'
                  >
                    <Download className='w-4 h-4 mr-2' />
                    Export JSON
                  </Button>

                  <Button
                    variant='outline'
                    onClick={() => handleExport('csv')}
                    className='w-full'
                  >
                    <Download className='w-4 h-4 mr-2' />
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button variant='outline' onClick={() => handleReset('backup')}>
                  Reset
                </Button>
                <Button onClick={() => handleSave('backup')} disabled={saving}>
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
