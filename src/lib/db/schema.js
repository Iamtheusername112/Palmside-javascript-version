import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

// Properties table
export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  image: text('image').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }).notNull(),
  sqft: integer('sqft').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('For Sale'), // For Sale, For Rent, Sold, Rented
  rating: decimal('rating', { precision: 3, scale: 1 }).default('0.0'),
  isFavorite: boolean('is_favorite').default(false),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Admin users table (for additional admin management)
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: varchar('role', { length: 20 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Property images table (for multiple images per property)
export const propertyImages = pgTable('property_images', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id, {
    onDelete: 'cascade',
  }),
  imageUrl: text('image_url').notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Property views/analytics table
export const propertyViews = pgTable('property_views', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id, {
    onDelete: 'cascade',
  }),
  viewedAt: timestamp('viewed_at').defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
})

// Admin activity log
export const adminActivityLog = pgTable('admin_activity_log', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => adminUsers.id),
  action: text('action').notNull(), // create, update, delete, status_change
  entityType: text('entity_type').notNull(), // property, user, etc.
  entityId: integer('entity_id'),
  details: text('details'), // JSON string with additional details
  createdAt: timestamp('created_at').defaultNow(),
})

// Contact form submissions table
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).default('new'), // new, read, responded, archived
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Response templates table
export const responseTemplates = pgTable('response_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull().default('general'),
  isDefault: boolean('is_default').default(false),
  useCount: integer('use_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// New analytics tables for comprehensive reporting

// Contact analytics table for detailed tracking
export const contactAnalytics = pgTable('contact_analytics', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').references(() => contacts.id, {
    onDelete: 'cascade',
  }),
  priority: varchar('priority', { length: 20 }).default('medium'),
  source: varchar('source', { length: 100 }).default('website'),
  responseTimeMinutes: integer('response_time_minutes'),
  conversionStatus: varchar('conversion_status', { length: 50 }).default(
    'pending'
  ),
  followUpCount: integer('follow_up_count').default(0),
  lastFollowUp: timestamp('last_follow_up'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Property performance analytics
export const propertyAnalytics = pgTable('property_analytics', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id, {
    onDelete: 'cascade',
  }),
  views: integer('views').default(0),
  inquiries: integer('inquiries').default(0),
  conversionRate: decimal('conversion_rate', {
    precision: 5,
    scale: 2,
  }).default('0.00'),
  avgTimeOnPage: integer('avg_time_on_page').default(0),
  bounceRate: decimal('bounce_rate', { precision: 5, scale: 2 }).default(
    '0.00'
  ),
  lastUpdated: timestamp('last_updated').defaultNow(),
})

// System performance metrics
export const systemMetrics = pgTable('system_metrics', {
  id: serial('id').primaryKey(),
  metricName: text('metric_name').notNull(),
  metricValue: text('metric_value').notNull(),
  category: varchar('category', { length: 50 }).default('performance'),
  timestamp: timestamp('timestamp').defaultNow(),
})

// Monthly trends data
export const monthlyTrends = pgTable('monthly_trends', {
  id: serial('id').primaryKey(),
  month: varchar('month', { length: 10 }).notNull(),
  year: integer('year').notNull(),
  contactsCount: integer('contacts_count').default(0),
  propertiesCount: integer('properties_count').default(0),
  responsesCount: integer('responses_count').default(0),
  conversionRate: decimal('conversion_rate', {
    precision: 5,
    scale: 2,
  }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
})
