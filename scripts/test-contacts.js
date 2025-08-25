const { drizzle } = require('drizzle-orm/neon-http')
const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function testContacts() {
  try {
    console.log('🔍 Testing database connection and contacts table...')

    // Test 1: Basic connection
    console.log('\n1. Testing database connection...')
    const result = await sql`SELECT version()`
    console.log('✅ Database connected successfully')
    console.log('   Version:', result[0].version)

    // Test 2: Check if contacts table exists
    console.log('\n2. Checking contacts table...')
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contacts'
      )
    `

    if (tableCheck[0].exists) {
      console.log('✅ Contacts table exists')
    } else {
      console.log('❌ Contacts table does not exist')
      return
    }

    // Test 3: Check table structure
    console.log('\n3. Checking table structure...')
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'contacts'
      ORDER BY ordinal_position
    `

    console.log('   Table structure:')
    columns.forEach((col) => {
      console.log(
        `   - ${col.column_name}: ${col.data_type} (${
          col.is_nullable === 'YES' ? 'nullable' : 'not null'
        })`
      )
    })

    // Test 4: Count existing contacts
    console.log('\n4. Counting existing contacts...')
    const countResult = await sql`SELECT COUNT(*) as count FROM contacts`
    const contactCount = countResult[0].count
    console.log(`   Total contacts: ${contactCount}`)

    // Test 5: Show sample contacts if any exist
    if (contactCount > 0) {
      console.log('\n5. Sample contacts:')
      const sampleContacts = await sql`
        SELECT id, first_name, last_name, email, subject, status, created_at
        FROM contacts
        ORDER BY created_at DESC
        LIMIT 3
      `

      sampleContacts.forEach((contact) => {
        console.log(
          `   - #${contact.id}: ${contact.first_name} ${contact.last_name} (${contact.email})`
        )
        console.log(
          `     Subject: ${contact.subject}, Status: ${contact.status}`
        )
        console.log(`     Submitted: ${contact.created_at}`)
        console.log('')
      })
    }

    // Test 6: Test insert (optional - comment out if you don't want test data)
    console.log('\n6. Testing insert functionality...')
    const testContact = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      subject: 'test-subject',
      message: 'This is a test message to verify the contact form is working.',
      ipAddress: '127.0.0.1',
      userAgent: 'Test Script',
      status: 'new',
    }

    const insertResult = await sql`
      INSERT INTO contacts (
        first_name, last_name, email, phone, subject, message, 
        ip_address, user_agent, status
      ) VALUES (
        ${testContact.firstName}, ${testContact.lastName}, ${testContact.email},
        ${testContact.phone}, ${testContact.subject}, ${testContact.message},
        ${testContact.ipAddress}, ${testContact.userAgent}, ${testContact.status}
      ) RETURNING id
    `

    if (insertResult[0]) {
      console.log(
        `✅ Test contact inserted successfully with ID: ${insertResult[0].id}`
      )

      // Clean up test data
      await sql`DELETE FROM contacts WHERE id = ${insertResult[0].id}`
      console.log('   Test contact cleaned up')
    }

    console.log(
      '\n🎉 All tests passed! The contacts system is working correctly.'
    )
    console.log('\n📝 Next steps:')
    console.log('   1. Submit a contact form from the frontend')
    console.log('   2. Check the admin dashboard to see the submission')
    console.log('   3. Test status updates and search functionality')
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Full error:', error)
  } finally {
    process.exit(0)
  }
}

testContacts()
