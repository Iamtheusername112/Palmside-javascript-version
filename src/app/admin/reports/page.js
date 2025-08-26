'use client'

import { useState, useEffect } from 'react'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useProperties } from '@/hooks/useProperties'
import { useContacts } from '@/hooks/useContacts'
import { useTemplates } from '@/hooks/useTemplates'
import { useActivityFeed } from '@/hooks/useActivityFeed'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  Building2,
  Contact,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Activity,
  Star,
  Eye,
  MessageSquare,
  Calendar,
  Target,
  Award,
  Zap,
  PieChart,
  LineChart,
  BarChart,
  Filter,
  Search,
  DownloadCloud,
  Share2,
  Printer,
  Mail,
} from 'lucide-react'

export default function ReportsPage() {
  const { stats, loading: statsLoading, refreshStats } = useAdminStats()
  const { properties, loading: propertiesLoading } = useProperties()
  const { contacts, loading: contactsLoading } = useContacts()
  const { templates, loading: templatesLoading } = useTemplates()
  const { activities, loading: activitiesLoading } = useActivityFeed()

  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [generatingReport, setGeneratingReport] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('contacts')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')

  // Calculate additional metrics
  const totalProperties = properties.length
  const featuredProperties = properties.filter((p) => p.featured).length
  const activeProperties = properties.filter(
    (p) => p.status === 'active'
  ).length
  const pendingProperties = properties.filter(
    (p) => p.status === 'pending'
  ).length

  const totalTemplates = templates.length
  const totalActivities = activities.length

  // Performance metrics
  const avgResponseTime = stats.avgResponseTime
  const responseRate = stats.responseRate
  const weeklyGrowth = stats.weeklyGrowth

  // Enhanced metrics calculations
  const contactConversionRate =
    stats.totalContacts > 0
      ? Math.round((stats.respondedContacts / stats.totalContacts) * 100)
      : 0
  const propertyUtilizationRate =
    totalProperties > 0
      ? Math.round((activeProperties / totalProperties) * 100)
      : 0
  const templateEfficiency =
    totalTemplates > 0
      ? Math.round((stats.respondedContacts / totalTemplates) * 100)
      : 0

  // Mock data for charts (replace with real data from your API)
  const monthlyData = [
    { month: 'Jan', contacts: 45, properties: 12, responses: 38 },
    { month: 'Feb', contacts: 52, properties: 15, responses: 44 },
    { month: 'Mar', contacts: 48, properties: 18, responses: 41 },
    { month: 'Apr', contacts: 61, properties: 22, responses: 52 },
    { month: 'May', contacts: 55, properties: 25, responses: 47 },
    { month: 'Jun', contacts: 67, properties: 28, responses: 58 },
  ]

  const topPerformingProperties = properties
    .filter((p) => p.status === 'active')
    .slice(0, 5)
    .map((p) => ({
      name: p.title || 'Property',
      views: Math.floor(Math.random() * 1000) + 100,
      inquiries: Math.floor(Math.random() * 50) + 5,
      conversion: Math.floor(Math.random() * 20) + 5,
    }))

  const generateReport = async () => {
    setGeneratingReport(true)
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Here you could implement actual report generation and download
      console.log('Report generated successfully')
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setGeneratingReport(false)
    }
  }

  const exportData = (format) => {
    // Implement data export functionality
    console.log(`Exporting data in ${format} format`)
  }

  const shareReport = () => {
    // Implement report sharing functionality
    console.log('Sharing report...')
  }

  const printReport = () => {
    // Implement print functionality
    window.print()
  }

  if (statsLoading || propertiesLoading || contactsLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Application Reports
          </h1>
          <p className='text-gray-600 mt-2'>
            Comprehensive insights and analytics for your real estate
            application
          </p>
        </div>
        <div className='flex space-x-3'>
          <Button
            variant='outline'
            onClick={() => refreshStats()}
            disabled={statsLoading}
          >
            <RefreshCw className='w-4 h-4 mr-2' />
            Refresh
          </Button>
          <Button onClick={generateReport} disabled={generatingReport}>
            <Download className='w-4 h-4 mr-2' />
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Time Period
          </label>
          <div className='flex space-x-2'>
            {['7d', '30d', '90d', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Primary Metric
          </label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='contacts'>Contacts</SelectItem>
              <SelectItem value='properties'>Properties</SelectItem>
              <SelectItem value='performance'>Performance</SelectItem>
              <SelectItem value='revenue'>Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Export Format
          </label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='pdf'>PDF</SelectItem>
              <SelectItem value='csv'>CSV</SelectItem>
              <SelectItem value='json'>JSON</SelectItem>
              <SelectItem value='excel'>Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Actions</label>
          <div className='flex space-x-2'>
            <Button variant='outline' size='sm' onClick={shareReport}>
              <Share2 className='w-4 h-4' />
            </Button>
            <Button variant='outline' size='sm' onClick={printReport}>
              <Printer className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Contacts
            </CardTitle>
            <Contact className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalContacts}</div>
            <p className='text-xs text-muted-foreground'>
              +{stats.todayContacts} today
            </p>
            <Progress value={contactConversionRate} className='mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              {contactConversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Properties
            </CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalProperties}</div>
            <p className='text-xs text-muted-foreground'>
              {featuredProperties} featured
            </p>
            <Progress value={propertyUtilizationRate} className='mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              {propertyUtilizationRate}% utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Response Rate</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{responseRate}%</div>
            <p className='text-xs text-muted-foreground'>
              Avg: {avgResponseTime}
            </p>
            <Progress value={responseRate} className='mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>Target: 90%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Weekly Growth</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{weeklyGrowth}%</div>
            <p className='text-xs text-muted-foreground'>
              {weeklyGrowth >= 0 ? 'Positive' : 'Negative'} trend
            </p>
            <div className='flex items-center mt-2'>
              {weeklyGrowth >= 0 ? (
                <TrendingUp className='w-4 h-4 text-green-500 mr-1' />
              ) : (
                <TrendingDown className='w-4 h-4 text-red-500 mr-1' />
              )}
              <span className='text-xs text-muted-foreground'>
                vs last week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Advanced Metrics Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <Target className='w-4 h-4 mr-2' />
              Template Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {templateEfficiency}%
            </div>
            <p className='text-xs text-muted-foreground'>
              Response templates effectiveness
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <Award className='w-4 h-4 mr-2' />
              Top Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {topPerformingProperties.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              High-performing properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <Zap className='w-4 h-4 mr-2' />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-600'>98%</div>
            <p className='text-xs text-muted-foreground'>
              Overall system uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-6'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='contacts'>Contacts</TabsTrigger>
          <TabsTrigger value='properties'>Properties</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          <TabsTrigger value='system'>System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Contact Summary */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Contact className='h-5 w-5' />
                  <span>Contact Summary</span>
                </CardTitle>
                <CardDescription>
                  Contact activity and response metrics
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span>New Contacts</span>
                  <Badge variant='secondary'>{stats.newContacts}</Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Read Contacts</span>
                  <Badge variant='outline'>{stats.readContacts}</Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Responded</span>
                  <Badge variant='default'>{stats.respondedContacts}</Badge>
                </div>
                <Separator />
                <div className='flex justify-between items-center font-medium'>
                  <span>Response Rate</span>
                  <span className='text-primary'>{responseRate}%</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Conversion Rate</span>
                  <span className='text-green-600 font-medium'>
                    {contactConversionRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Building2 className='h-5 w-5' />
                  <span>Property Summary</span>
                </CardTitle>
                <CardDescription>
                  Property status and performance
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span>Active Properties</span>
                  <Badge variant='default'>{activeProperties}</Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Pending Properties</span>
                  <Badge variant='secondary'>{pendingProperties}</Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Featured Properties</span>
                  <Badge variant='outline'>{featuredProperties}</Badge>
                </div>
                <Separator />
                <div className='flex justify-between items-center font-medium'>
                  <span>Total Properties</span>
                  <span className='text-primary'>{totalProperties}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Utilization Rate</span>
                  <span className='text-blue-600 font-medium'>
                    {propertyUtilizationRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <LineChart className='h-5 w-5' />
                <span>Monthly Trends</span>
              </CardTitle>
              <CardDescription>
                Performance trends over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-6 gap-4'>
                {monthlyData.map((data, index) => (
                  <div key={index} className='text-center'>
                    <div className='text-sm font-medium text-gray-600'>
                      {data.month}
                    </div>
                    <div className='text-lg font-bold text-blue-600'>
                      {data.contacts}
                    </div>
                    <div className='text-xs text-gray-500'>Contacts</div>
                    <div className='text-sm font-medium text-green-600'>
                      {data.responses}
                    </div>
                    <div className='text-xs text-gray-500'>Responses</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value='contacts' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Contact Analytics</CardTitle>
              <CardDescription>
                Detailed contact behavior and response patterns
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {stats.newContacts}
                  </div>
                  <div className='text-sm text-gray-600'>New This Period</div>
                </div>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.readContacts}
                  </div>
                  <div className='text-sm text-gray-600'>Read</div>
                </div>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {stats.respondedContacts}
                  </div>
                  <div className='text-sm text-gray-600'>Responded</div>
                </div>
              </div>

              <div className='space-y-3'>
                <h4 className='font-medium'>Response Time Analysis</h4>
                <div className='flex items-center space-x-2'>
                  <Clock className='h-4 w-4 text-gray-500' />
                  <span>Average Response Time: {avgResponseTime}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <span>Response Rate: {responseRate}%</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Target className='h-4 w-4 text-blue-500' />
                  <span>Conversion Rate: {contactConversionRate}%</span>
                </div>
              </div>

              {/* Contact Quality Metrics */}
              <div className='space-y-3'>
                <h4 className='font-medium'>Contact Quality Metrics</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>High Priority</span>
                      <Badge variant='destructive'>12</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Medium Priority</span>
                      <Badge variant='secondary'>28</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Low Priority</span>
                      <Badge variant='outline'>45</Badge>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>First Time</span>
                      <Badge variant='default'>67</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Returning</span>
                      <Badge variant='secondary'>23</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>VIP</span>
                      <Badge variant='outline'>8</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value='properties' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
              <CardDescription>
                Property listing performance and status distribution
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>Status Distribution</h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>Active</span>
                      <Badge variant='default'>{activeProperties}</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Pending</span>
                      <Badge variant='secondary'>{pendingProperties}</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Featured</span>
                      <Badge variant='outline'>{featuredProperties}</Badge>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Quick Actions</h4>
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full justify-start'
                    >
                      <Eye className='h-4 w-4 mr-2' />
                      View All Properties
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full justify-start'
                    >
                      <Star className='h-4 w-4 mr-2' />
                      Manage Featured
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full justify-start'
                    >
                      <Building2 className='h-4 w-4 mr-2' />
                      Add New Property
                    </Button>
                  </div>
                </div>
              </div>

              {/* Top Performing Properties */}
              <div className='space-y-4'>
                <h4 className='font-medium'>Top Performing Properties</h4>
                <div className='space-y-3'>
                  {topPerformingProperties.map((property, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold'>
                          {index + 1}
                        </div>
                        <div>
                          <div className='font-medium'>{property.name}</div>
                          <div className='text-sm text-gray-500'>
                            {property.views} views • {property.inquiries}{' '}
                            inquiries
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium text-green-600'>
                          {property.conversion}%
                        </div>
                        <div className='text-sm text-gray-500'>conversion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value='performance' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                System performance and user engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>Response Performance</h4>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Response Rate</span>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium'>{responseRate}%</span>
                        {responseRate >= 80 ? (
                          <TrendingUp className='h-4 w-4 text-green-500' />
                        ) : (
                          <TrendingDown className='h-4 w-4 text-red-500' />
                        )}
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Avg Response Time</span>
                      <span className='font-medium'>{avgResponseTime}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Weekly Growth</span>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium'>{weeklyGrowth}%</span>
                        {weeklyGrowth >= 0 ? (
                          <TrendingUp className='h-4 w-4 text-green-500' />
                        ) : (
                          <TrendingDown className='h-4 w-4 text-red-500' />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Engagement Metrics</h4>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Today's Contacts</span>
                      <Badge variant='secondary'>{stats.todayContacts}</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Total Activities</span>
                      <Badge variant='outline'>{totalActivities}</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Response Templates</span>
                      <Badge variant='default'>{totalTemplates}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Goals */}
              <div className='space-y-4'>
                <h4 className='font-medium'>Performance Goals & Targets</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='text-center p-4 border rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600'>90%</div>
                    <div className='text-sm text-gray-600'>
                      Target Response Rate
                    </div>
                    <Progress value={responseRate} className='mt-2' />
                  </div>
                  <div className='text-center p-4 border rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>2h</div>
                    <div className='text-sm text-gray-600'>
                      Target Response Time
                    </div>
                    <Progress value={60} className='mt-2' />
                  </div>
                  <div className='text-center p-4 border rounded-lg'>
                    <div className='text-2xl font-bold text-purple-600'>
                      85%
                    </div>
                    <div className='text-sm text-gray-600'>
                      Target Conversion
                    </div>
                    <Progress value={contactConversionRate} className='mt-2' />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Analytics Tab */}
        <TabsContent value='analytics' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <BarChart3 className='h-5 w-5' />
                <span>Advanced Analytics</span>
              </CardTitle>
              <CardDescription>
                Deep insights and predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Trend Analysis */}
              <div className='space-y-4'>
                <h4 className='font-medium'>Trend Analysis</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Contact Growth</span>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium text-green-600'>+15%</span>
                        <TrendingUp className='h-4 w-4 text-green-500' />
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Property Views</span>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium text-blue-600'>+8%</span>
                        <TrendingUp className='h-4 w-4 text-blue-500' />
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Response Quality</span>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium text-purple-600'>
                          +12%
                        </span>
                        <TrendingUp className='h-4 w-4 text-purple-500' />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Peak Hours</span>
                      <span className='font-medium'>2-4 PM</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Best Days</span>
                      <span className='font-medium'>Tue, Wed</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Seasonal Peak</span>
                      <span className='font-medium'>Spring</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Predictive Insights */}
              <div className='space-y-4'>
                <h4 className='font-medium'>Predictive Insights</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='p-4 border rounded-lg bg-blue-50'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Calendar className='h-4 w-4 text-blue-600' />
                      <span className='font-medium text-blue-800'>
                        Next Month
                      </span>
                    </div>
                    <div className='text-sm text-blue-700'>
                      Expected 20% increase in property inquiries
                    </div>
                  </div>

                  <div className='p-4 border rounded-lg bg-green-50'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Target className='h-4 w-4 text-green-600' />
                      <span className='font-medium text-green-800'>
                        Conversion
                      </span>
                    </div>
                    <div className='text-sm text-green-700'>
                      High-value properties showing 30% better conversion
                    </div>
                  </div>

                  <div className='p-4 border rounded-lg bg-purple-50'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <TrendingUp className='h-4 w-4 text-purple-600' />
                      <span className='font-medium text-purple-800'>
                        Growth
                      </span>
                    </div>
                    <div className='text-sm text-purple-700'>
                      Contact volume expected to grow by 25%
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparative Analysis */}
              <div className='space-y-4'>
                <h4 className='font-medium'>Comparative Analysis</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <h5 className='font-medium text-gray-700'>
                      This Period vs Last Period
                    </h5>
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <span>Contacts</span>
                        <div className='flex items-center space-x-2'>
                          <span className='text-sm'>{stats.totalContacts}</span>
                          <span className='text-green-600 text-sm'>+12%</span>
                        </div>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Properties</span>
                        <div className='flex items-center space-x-2'>
                          <span className='text-sm'>{totalProperties}</span>
                          <span className='text-blue-600 text-sm'>+8%</span>
                        </div>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Response Rate</span>
                        <div className='flex items-center space-x-2'>
                          <span className='text-sm'>{responseRate}%</span>
                          <span className='text-green-600 text-sm'>+5%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h5 className='font-medium text-gray-700'>
                      Industry Benchmark
                    </h5>
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <span>Your Response Rate</span>
                        <span className='font-medium'>{responseRate}%</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Industry Average</span>
                        <span className='text-gray-600'>75%</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Performance</span>
                        <Badge
                          variant={responseRate >= 75 ? 'default' : 'secondary'}
                        >
                          {responseRate >= 75
                            ? 'Above Average'
                            : 'Below Average'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value='system' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Application status and system information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>System Status</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span>Database Connection</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span>Email Service</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span>Authentication</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span>File Storage</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Data Export</h4>
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full justify-start'
                      onClick={() => exportData('csv')}
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Export as CSV
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full justify-start'
                      onClick={() => exportData('json')}
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Export as JSON
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full justify-start'
                      onClick={() => exportData('pdf')}
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <h4 className='font-medium mb-3'>Recent System Activity</h4>
                <div className='space-y-2'>
                  {activities.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-2 text-sm text-gray-600'
                    >
                      <Activity className='h-4 w-4' />
                      <span>
                        {activity.description || 'System activity recorded'}
                      </span>
                      <span className='text-gray-400'>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Performance Metrics */}
              <div className='pt-4 border-t'>
                <h4 className='font-medium mb-3'>System Performance</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='text-center p-3 border rounded-lg'>
                    <div className='text-lg font-bold text-green-600'>
                      99.8%
                    </div>
                    <div className='text-sm text-gray-600'>Uptime</div>
                  </div>
                  <div className='text-center p-3 border rounded-lg'>
                    <div className='text-lg font-bold text-blue-600'>45ms</div>
                    <div className='text-sm text-gray-600'>Avg Response</div>
                  </div>
                  <div className='text-center p-3 border rounded-lg'>
                    <div className='text-lg font-bold text-purple-600'>
                      2.1s
                    </div>
                    <div className='text-sm text-gray-600'>Page Load</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
