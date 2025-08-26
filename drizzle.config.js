import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  schema: './src/lib/db/schema.js',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
