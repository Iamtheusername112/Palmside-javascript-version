# Comprehensive Analytics System Setup

This document explains how to set up and use the new comprehensive analytics system for the Palmside real estate application.

## 🚀 Overview

The new analytics system provides comprehensive reporting capabilities across all tabs in the admin dashboard Reports page:

- **Overview Tab**: Contact and property summaries with monthly trends
- **Contacts Tab**: Detailed contact analytics with priority distribution and conversion tracking
- **Properties Tab**: Property performance metrics and status distribution
- **Performance Tab**: Response performance and engagement metrics with goal tracking
- **Analytics Tab**: Advanced analytics with trend analysis and predictive insights
- **System Tab**: System health monitoring and performance metrics

## 📊 New Database Tables

The system introduces several new tables for comprehensive data tracking:

### 1. `contact_analytics`

- Tracks contact priority, source, response time, conversion status
- Monitors follow-up activities and engagement metrics
- Provides insights into contact quality and conversion rates

### 2. `property_analytics`

- Tracks property views, inquiries, and conversion rates
- Monitors user engagement (time on page, bounce rate)
- Enables performance comparison across properties

### 3. `system_metrics`

- Stores system performance indicators
- Tracks uptime, response times, and resource usage
- Provides real-time system health monitoring

### 4. `monthly_trends`

- Aggregates monthly performance data
- Tracks growth patterns over time
- Enables historical analysis and forecasting

## 🛠️ Setup Instructions

### Prerequisites

- Node.js and npm installed
- Access to your Neon PostgreSQL database
- Environment variables configured (`.env` file)

### Step 1: Run the Comprehensive Setup Script

```bash
cd scripts
node setup-comprehensive-analytics.js
```

This script will:

- Create all necessary analytics tables
- Populate contact analytics with real data from existing contacts
- Generate sample property analytics data
- Insert system metrics and monthly trends
- Create performance indexes for optimal query performance

### Step 2: Verify Database Schema

The script automatically updates your Drizzle schema files:

- `src/lib/db/schema.js` - Updated with new table definitions
- `drizzle/meta/_journal.json` - Updated migration journal
- `drizzle/meta/0004_snapshot.json` - New migration snapshot

### Step 3: Restart Development Server

```bash
npm run dev
```

## 📈 Using the Analytics System

### API Endpoints

The system provides a new comprehensive analytics API:

- **GET** `/api/admin/analytics?period=30d` - Fetches all analytics data
- Supports period parameters: `7d`, `30d`, `90d`, `1y`

### React Hooks

Use the new `useAnalytics` hook in your components:

```javascript
import { useAnalytics } from '@/hooks/useAnalytics'

function MyComponent() {
  const { analytics, loading, refreshAnalytics, changePeriod } = useAnalytics('30d')

  // Access analytics data
  const { contactStats, propertyStats, systemStats, trends } = analytics

  return (
    // Your component JSX
  )
}
```

### Data Structure

The analytics object contains:

```javascript
{
  period: '30d',
  contactStats: {
    totalContacts: 150,
    newContacts: 25,
    readContacts: 45,
    respondedContacts: 80,
    todayContacts: 5,
    weeklyGrowth: 12,
    responseRate: 53,
    avgResponseTime: '24h'
  },
  propertyStats: {
    totalProperties: 45,
    activeProperties: 38,
    pendingProperties: 7,
    featuredProperties: 12,
    newProperties: 3,
    utilizationRate: 84
  },
  systemStats: {
    metrics: [...],
    systemHealth: 98,
    uptime: '99.8%',
    avgResponseTime: '45ms',
    pageLoadTime: '2.1s'
  },
  trends: [...],
  priorityStats: { high: 12, medium: 28, low: 45 },
  conversionStats: { pending: 35, converted: 25, lost: 15, followUp: 25 },
  performanceStats: { ... }
}
```

## 🔄 Real-Time Updates

The system automatically:

- Fetches fresh data when periods change
- Refreshes analytics on demand
- Provides loading states during data fetching
- Handles errors gracefully with toast notifications

## 📊 Customization

### Adding New Metrics

1. **Database**: Add new columns to analytics tables
2. **API**: Update the analytics endpoint to include new data
3. **Hook**: Modify the `useAnalytics` hook state
4. **UI**: Update the Reports page to display new metrics

### Modifying Calculations

Edit the helper functions in `/api/admin/analytics/route.js`:

- `getContactAnalytics()` - Contact-related calculations
- `getPropertyAnalytics()` - Property performance metrics
- `getSystemMetrics()` - System health indicators
- `getMonthlyTrends()` - Historical trend data

## 🧪 Testing

### Test Data Generation

The setup script generates realistic sample data:

- Contact analytics based on actual contact statuses
- Property analytics with realistic view/inquiry ratios
- System metrics with typical performance values
- Monthly trends with seasonal variations

### Manual Testing

1. Navigate to `/admin/reports`
2. Test different time periods (7d, 30d, 90d, 1y)
3. Verify all tabs display dynamic data
4. Check that refresh functionality works
5. Test period switching and data updates

## 🚨 Troubleshooting

### Common Issues

1. **Tables not created**: Check database connection and permissions
2. **No data displayed**: Verify the setup script completed successfully
3. **API errors**: Check browser console and server logs
4. **Performance issues**: Ensure indexes were created properly

### Debug Commands

```bash
# Check table creation
node scripts/setup-analytics-tables.js

# Populate specific data
node scripts/populate-contact-analytics.js
node scripts/populate-property-analytics.js

# Verify database state
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM contact_analytics;"
```

## 🔮 Future Enhancements

Potential improvements for the analytics system:

1. **Real-time WebSocket updates** for live dashboard updates
2. **Advanced charting** with Chart.js or D3.js integration
3. **Export functionality** for PDF, CSV, and Excel reports
4. **Custom date ranges** beyond predefined periods
5. **User-specific analytics** based on admin roles
6. **Predictive analytics** using machine learning models
7. **Integration with external tools** like Google Analytics

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)

## 🤝 Support

If you encounter issues or have questions:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify database connectivity and permissions
4. Ensure all environment variables are properly set

---

**Note**: This analytics system is designed to work with your existing Neon Drizzle PostgreSQL setup and Clerk authentication system. All data is fetched dynamically from the database, providing real-time insights into your application's performance and user engagement.
