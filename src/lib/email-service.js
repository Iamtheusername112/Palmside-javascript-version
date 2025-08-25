// Email service for sending emails
// This is currently a simulation, but can be easily replaced with real email services

export class EmailService {
  constructor() {
    this.isConfigured = false
    this.configure()
  }

  configure() {
    // Check if email service is configured
    // In production, this would check for API keys, SMTP settings, etc.
    this.isConfigured =
      process.env.EMAIL_SERVICE_API_KEY || process.env.SMTP_HOST
  }

  async sendEmail(emailData) {
    const { to, subject, content, from = 'noreply@palmside.com' } = emailData

    if (!this.isConfigured) {
      // Simulate email sending for development
      return this.simulateEmailSending(emailData)
    }

    // Real email sending implementation would go here
    // Examples:
    // - SendGrid
    // - Resend
    // - Nodemailer with SMTP
    // - AWS SES

    return this.sendRealEmail(emailData)
  }

  async simulateEmailSending(emailData) {
    const { to, subject, content } = emailData

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Log the email for development purposes
    console.log('📧 Simulated Email Sent:')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Content:', content.substring(0, 100) + '...')

    return {
      success: true,
      messageId: `sim_${Date.now()}`,
      message: 'Email sent successfully (simulated)',
    }
  }

  async sendRealEmail(emailData) {
    // This would be implemented with a real email service
    // For now, we'll simulate it
    return this.simulateEmailSending(emailData)
  }

  // Method to send template-based emails
  async sendTemplateEmail(template, contact, variables = {}) {
    let subject = template.subject
    let content = template.content

    // Replace template variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      content = content.replace(regex, value)
    })

    return this.sendEmail({
      to: contact.email,
      subject,
      content,
    })
  }
}

// Export singleton instance
export const emailService = new EmailService()

