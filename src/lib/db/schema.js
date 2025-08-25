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
