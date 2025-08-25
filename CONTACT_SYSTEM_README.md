# Contact System Setup & Usage

This document explains how the contact form system works and how to set it up.

## Overview

The contact system consists of:

1. **Frontend Contact Form** (`/contact`) - Users submit contact requests
2. **Backend API** (`/api/contact`) - Processes form submissions and saves to database
3. **Admin Dashboard** (`/admin/contacts`) - Admins can view and manage submissions
4. **Database** - Neon PostgreSQL with Drizzle ORM

## Features

- ✅ Form validation (client-side)
- ✅ Toast notifications for success/error feedback
- ✅ Database storage with IP address and user agent tracking
- ✅ Admin dashboard with search, filtering, and pagination
- ✅ Status management (new, read, responded, archived)
- ✅ Responsive design

## Setup Instructions

### 1. Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```bash
DATABASE_URL="postgresql://username:password@host/database"
```

### 2. Database Setup

Run the database migrations to create the contacts table:

```bash
npm run db:push
```

Or manually run the migration:

```bash
npm run db:setup
```

### 3. Test Database Connection

Test if everything is working:

```bash
npm run test:contacts
```

This will:

- Test database connection
- Verify contacts table exists
- Check table structure
- Test insert functionality
- Show existing contacts

## Usage

### For Users

1. Navigate to `/contact`
2. Fill out the form with:
   - First Name (required)
   - Last Name (required)
   - Email (required)
   - Phone (optional)
   - Subject (required)
   - Message (required, min 10 characters)
3. Submit the form
4. See toast notification confirming submission

### For Admins

1. Navigate to `/admin/contacts`
2. View all contact submissions
3. Use filters to search by:
   - Status (new, read, responded, archived)
   - Text search (name, email, subject)
4. Click "View" to see full contact details
5. Update status using the dropdown
6. Use pagination for large numbers of contacts

## API Endpoints

### POST `/api/contact`

Submits a new contact form.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "property-inquiry",
  "message": "I'm interested in your properties..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you within 24 hours.",
  "contactId": 123
}
```

### GET `/api/admin/contacts`

Fetches contacts for admin dashboard.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (all, new, read, responded, archived)
- `search` - Search text in name, email, or subject

### PATCH `/api/admin/contacts`

Updates contact status.

**Request Body:**

```json
{
  "id": 123,
  "status": "read"
}
```

## Database Schema

The `contacts` table has these columns:

- `id` - Primary key (auto-increment)
- `first_name` - Contact's first name
- `last_name` - Contact's last name
- `email` - Contact's email address
- `phone` - Contact's phone number (optional)
- `subject` - Contact subject
- `message` - Contact message
- `status` - Current status (new, read, responded, archived)
- `ip_address` - IP address of submitter
- `user_agent` - Browser/user agent info
- `created_at` - Submission timestamp
- `updated_at` - Last update timestamp

## Troubleshooting

### Common Issues

1. **"Database connection failed"**

   - Check `DATABASE_URL` environment variable
   - Verify Neon database is running
   - Check network connectivity

2. **"Contacts table does not exist"**

   - Run `npm run db:push` to apply migrations
   - Check if migration files exist in `drizzle/` folder

3. **Form submissions not saving**

   - Check browser console for errors
   - Verify API endpoint is accessible
   - Check database permissions

4. **Admin dashboard not loading contacts**
   - Check if admin API route is working
   - Verify database has contacts
   - Check browser network tab for API calls

### Testing

Use the test script to verify everything works:

```bash
npm run test:contacts
```

This will test all components of the system and provide detailed feedback.

## Future Enhancements

- Email notifications to admins
- Email confirmations to users
- CRM integration
- Contact form analytics
- Spam protection
- File attachments
- Contact categories/tags

## Support

If you encounter issues:

1. Check the browser console for errors
2. Run the test script to verify database connectivity
3. Check the API routes are accessible
4. Verify environment variables are set correctly
