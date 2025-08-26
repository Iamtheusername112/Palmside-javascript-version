import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

export async function POST(request) {
  try {
    const body = await request.json()
    const { emailSettings } = body

    // Test email configuration
    const testResult = await emailService.sendEmail({
      to: emailSettings.fromEmail,
      subject: 'Email Configuration Test',
      content: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your SMTP settings are working correctly.</p>
        <p><strong>SMTP Host:</strong> ${emailSettings.smtpHost}</p>
        <p><strong>SMTP Port:</strong> ${emailSettings.smtpPort}</p>
        <p><strong>From Email:</strong> ${emailSettings.fromEmail}</p>
        <p><strong>From Name:</strong> ${emailSettings.fromName}</p>
        <hr>
        <p>If you received this email, your email configuration is working properly!</p>
      `,
      from: emailSettings.fromEmail,
    })

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result: testResult,
    })
  } catch (error) {
    console.error('Failed to send test email:', error)
    return NextResponse.json(
      { error: 'Failed to send test email: ' + error.message },
      { status: 500 }
    )
  }
}
