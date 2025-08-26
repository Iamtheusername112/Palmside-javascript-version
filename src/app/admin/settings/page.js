'use client'

import { useState } from 'react'
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
import { useSettings } from '@/hooks/useSettings'
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
  const {
    settings,
    loading,
    saving,
    saveSettings,
    testEmail,
    createBackup,
    exportData,
    updateSetting,
    resetSettings,
  } = useSettings()

  const handleSave = async (section) => {
    const success = await saveSettings(section)
    if (success) {
      console.log(`${section} settings saved successfully`)
    }
  }

  const handleTestEmail = async () => {
    await testEmail(settings.email)
  }

  const handleBackup = async () => {
    const result = await createBackup(settings.backup)
    if (result) {
      console.log('Backup created:', result)
    }
  }

  const handleExport = async (format) => {
    await exportData(format, {
      includeProperties: true,
      includeContacts: true,
      includeTemplates: true,
    })
  }

  const handleReset = (section) => {
    resetSettings(section)
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
          <Button variant='outline' onClick={() => handleReset('all')}>
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
                    value={settings.general.companyName}
                    onChange={(e) =>
                      updateSetting('general', 'companyName', e.target.value)
                    }
                    placeholder='Enter company name'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='companyEmail'>Company Email</Label>
                  <Input
                    id='companyEmail'
                    type='email'
                    value={settings.general.companyEmail}
                    onChange={(e) =>
                      updateSetting('general', 'companyEmail', e.target.value)
                    }
                    placeholder='Enter company email'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='companyPhone'>Company Phone</Label>
                  <Input
                    id='companyPhone'
                    value={settings.general.companyPhone}
                    onChange={(e) =>
                      updateSetting('general', 'companyPhone', e.target.value)
                    }
                    placeholder='Enter company phone'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='websiteUrl'>Website URL</Label>
                  <Input
                    id='websiteUrl'
                    value={settings.general.websiteUrl}
                    onChange={(e) =>
                      updateSetting('general', 'websiteUrl', e.target.value)
                    }
                    placeholder='Enter website URL'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='companyAddress'>Company Address</Label>
                <Textarea
                  id='companyAddress'
                  value={settings.general.companyAddress}
                  onChange={(e) =>
                    updateSetting('general', 'companyAddress', e.target.value)
                  }
                  placeholder='Enter company address'
                  rows={3}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='timezone'>Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      updateSetting('general', 'timezone', value)
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
                    value={settings.general.dateFormat}
                    onValueChange={(value) =>
                      updateSetting('general', 'dateFormat', value)
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
                    value={settings.general.currency}
                    onValueChange={(value) =>
                      updateSetting('general', 'currency', value)
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
                    value={settings.email.smtpHost}
                    onChange={(e) =>
                      updateSetting('email', 'smtpHost', e.target.value)
                    }
                    placeholder='smtp.gmail.com'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='smtpPort'>SMTP Port</Label>
                  <Input
                    id='smtpPort'
                    value={settings.email.smtpPort}
                    onChange={(e) =>
                      updateSetting('email', 'smtpPort', e.target.value)
                    }
                    placeholder='587'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='smtpUsername'>SMTP Username</Label>
                  <Input
                    id='smtpUsername'
                    value={settings.email.smtpUsername}
                    onChange={(e) =>
                      updateSetting('email', 'smtpUsername', e.target.value)
                    }
                    placeholder='Enter SMTP username'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='smtpPassword'>SMTP Password</Label>
                  <Input
                    id='smtpPassword'
                    type='password'
                    value={settings.email.smtpPassword}
                    onChange={(e) =>
                      updateSetting('email', 'smtpPassword', e.target.value)
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
                    value={settings.email.fromEmail}
                    onChange={(e) =>
                      updateSetting('email', 'fromEmail', e.target.value)
                    }
                    placeholder='noreply@company.com'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='fromName'>From Name</Label>
                  <Input
                    id='fromName'
                    value={settings.email.fromName}
                    onChange={(e) =>
                      updateSetting('email', 'fromName', e.target.value)
                    }
                    placeholder='Company Name'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='emailSignature'>Email Signature</Label>
                <Textarea
                  id='emailSignature'
                  value={settings.email.emailSignature}
                  onChange={(e) =>
                    updateSetting('email', 'emailSignature', e.target.value)
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
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting('notifications', 'emailNotifications', checked)
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Smartphone className='h-4 w-4 text-gray-500' />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting('notifications', 'smsNotifications', checked)
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Bell className='h-4 w-4 text-gray-500' />
                      <span>Push Notifications</span>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting('notifications', 'pushNotifications', checked)
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
                        checked={settings.notifications.contactAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting('notifications', 'contactAlerts', checked)
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Property Updates</span>
                      <Switch
                        checked={settings.notifications.propertyUpdates}
                        onCheckedChange={(checked) =>
                          updateSetting('notifications', 'propertyUpdates', checked)
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>System Alerts</span>
                      <Switch
                        checked={settings.notifications.systemAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting('notifications', 'systemAlerts', checked)
                        }
                      />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span>Daily Digest</span>
                      <Switch
                        checked={settings.notifications.dailyDigest}
                        onCheckedChange={(checked) =>
                          updateSetting('notifications', 'dailyDigest', checked)
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Weekly Report</span>
                      <Switch
                        checked={settings.notifications.weeklyReport}
                        onCheckedChange={(checked) =>
                          updateSetting('notifications', 'weeklyReport', checked)
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Instant Alerts</span>
                      <Switch
                        checked={settings.notifications.instantAlerts}
                        onCheckedChange={(checked) =>
                          updateSetting('notifications', 'instantAlerts', checked)
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
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        updateSetting('security', 'twoFactorAuth', checked)
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <Clock className='h-4 w-4 text-gray-500' />
                      <span>Session Timeout (minutes)</span>
                    </div>
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onValueChange={(value) =>
                        updateSetting('security', 'sessionTimeout', parseInt(value))
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
                      value={settings.security.passwordExpiry.toString()}
                      onValueChange={(value) =>
                        updateSetting('security', 'passwordExpiry', parseInt(value))
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
                      value={settings.security.failedLoginAttempts.toString()}
                      onValueChange={(value) =>
                        updateSetting('security', 'failedLoginAttempts', parseInt(value))
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
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) =>
                        updateSetting('security', 'auditLogging', checked)
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <span>Data Encryption</span>
                    <Switch
                      checked={settings.security.dataEncryption}
                      onCheckedChange={(checked) =>
                        updateSetting('security', 'dataEncryption', checked)
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <span>Backup Frequency</span>
                    <Select
                      value={settings.security.backupFrequency}
                      onValueChange={(value) =>
                        updateSetting('security', 'backupFrequency', value)
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
                        value={settings.display.theme}
                        onValueChange={(value) =>
                          updateSetting('display', 'theme', value)
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
                        checked={settings.display.compactMode}
                        onCheckedChange={(checked) =>
                          updateSetting('display', 'compactMode', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Show Welcome Message</span>
                      <Switch
                        checked={settings.display.showWelcomeMessage}
                        onCheckedChange={(checked) =>
                          updateSetting('display', 'showWelcomeMessage', checked)
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
                        value={settings.display.dashboardLayout}
                        onValueChange={(value) =>
                          updateSetting('display', 'dashboardLayout', value)
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
                        value={settings.display.itemsPerPage.toString()}
                        onValueChange={(value) =>
                          updateSetting('display', 'itemsPerPage', parseInt(value))
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
                      checked={settings.display.autoRefresh}
                      onCheckedChange={(checked) =>
                        updateSetting('display', 'autoRefresh', checked)
                      }
                    />
                  </div>

                  {settings.display.autoRefresh && (
                    <div className='flex items-center justify-between'>
                      <span>Refresh Interval (seconds)</span>
                      <Select
                        value={settings.display.refreshInterval.toString()}
                        onValueChange={(value) =>
                          updateSetting('display', 'refreshInterval', parseInt(value))
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
                        checked={settings.integrations.googleAnalytics}
                        onCheckedChange={(checked) =>
                          updateSetting('integrations', 'googleAnalytics', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Google Maps</span>
                      <Switch
                        checked={settings.integrations.googleMaps}
                        onCheckedChange={(checked) =>
                          updateSetting('integrations', 'googleMaps', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Social Media</span>
                      <Switch
                        checked={settings.integrations.socialMedia}
                        onCheckedChange={(checked) =>
                          updateSetting('integrations', 'socialMedia', checked)
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
                        checked={settings.integrations.crmIntegration}
                        onCheckedChange={(checked) =>
                          updateSetting('integrations', 'crmIntegration', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Calendar Sync</span>
                      <Switch
                        checked={settings.integrations.calendarSync}
                        onCheckedChange={(checked) =>
                          updateSetting('integrations', 'calendarSync', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Payment Gateway</span>
                      <Select
                        value={settings.integrations.paymentGateway}
                        onValueChange={(value) =>
                          updateSetting('integrations', 'paymentGateway', value)
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
                        checked={settings.backup.autoBackup}
                        onCheckedChange={(checked) =>
                          updateSetting('backup', 'autoBackup', checked)
                        }
                      />
                    </div>

                    {settings.backup.autoBackup && (
                      <>
                        <div className='flex items-center justify-between'>
                          <span>Backup Time</span>
                          <Input
                            type='time'
                            value={settings.backup.backupTime}
                            onChange={(e) =>
                              updateSetting('backup', 'backupTime', e.target.value)
                            }
                            className='w-32'
                          />
                        </div>

                        <div className='flex items-center justify-between'>
                          <span>Retention (days)</span>
                          <Select
                            value={settings.backup.backupRetention.toString()}
                            onValueChange={(value) =>
                              updateSetting('backup', 'backupRetention', parseInt(value))
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
                        checked={settings.backup.includeFiles}
                        onCheckedChange={(checked) =>
                          updateSetting('backup', 'includeFiles', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Include Database</span>
                      <Switch
                        checked={settings.backup.includeDatabase}
                        onCheckedChange={(checked) =>
                          updateSetting('backup', 'includeDatabase', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span>Cloud Backup</span>
                      <Switch
                        checked={settings.backup.cloudBackup}
                        onCheckedChange={(checked) =>
                          updateSetting('backup', 'cloudBackup', checked)
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
