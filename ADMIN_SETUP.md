# Palmside Properties Admin Dashboard Setup

This guide will help you set up the admin dashboard for your Palmside Properties application.

## Prerequisites

- Node.js 18+ and npm/yarn
- A Clerk account for authentication
- A Neon PostgreSQL database

## Installation

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up Environment Variables**
   - Copy `env.example` to `.env.local`
   - Fill in your actual API keys and database URL

## Environment Variables Setup

### Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy your database connection string
4. Add it to `.env.local`:
   ```
   DATABASE_URL=postgresql://username:password@host/database
   ```

## Database Setup

1. **Generate Database Schema**

   ```bash
   npm run db:generate
   # or
   yarn db:generate
   ```

2. **Run Database Migrations**

   ```bash
   npm run db:migrate
   # or
   yarn db:migrate
   ```

3. **Optional: Open Database Studio**
   ```bash
   npm run db:studio
   # or
   yarn db:studio
   ```

## Running the Application

1. **Development Mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Access Admin Dashboard**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Sign In: http://localhost:3000/sign-in

## Admin Dashboard Features

### ✅ Implemented

- **Authentication**: Clerk-based sign-in/sign-up
- **Dashboard Overview**: Statistics and quick actions
- **Properties Management**: View, search, and filter properties
- **Property Actions**: Edit, delete, toggle featured status
- **Add New Property**: Comprehensive property creation form
- **Responsive Design**: Mobile-friendly admin interface

### 🚧 Coming Soon

- **Property Editing**: Edit existing properties
- **Image Upload**: File upload functionality
- **User Management**: Admin user roles and permissions
- **Analytics**: Property views and performance metrics
- **Reports**: Generate property and user reports
- **API Integration**: Connect frontend to database

## Database Schema

The application includes the following database tables:

- `properties`: Main property listings
- `admin_users`: Admin user management
- `property_images`: Multiple images per property
- `property_views`: Analytics and tracking
- `admin_activity_log`: Audit trail for admin actions

## Security Features

- **Route Protection**: Admin routes require authentication
- **Middleware**: Clerk middleware for secure routing
- **Environment Variables**: Secure API key management
- **Database Security**: Prepared statements via Drizzle ORM

## Troubleshooting

### Common Issues

1. **Clerk Authentication Errors**

   - Verify your Clerk keys are correct
   - Check that your Clerk app is properly configured

2. **Database Connection Issues**

   - Verify your Neon database URL is correct
   - Ensure your database is accessible from your IP

3. **Build Errors**
   - Clear `.next` folder and node_modules
   - Reinstall dependencies

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed

## Next Steps

1. **Connect Frontend to Database**: Replace mock data with real API calls
2. **Implement Property Editing**: Add edit functionality for existing properties
3. **Add Image Upload**: Integrate with a file storage service
4. **User Roles**: Implement different admin permission levels
5. **Analytics**: Add real-time property performance metrics

## Support

For additional support or questions, please refer to the project documentation or create an issue in the repository.
