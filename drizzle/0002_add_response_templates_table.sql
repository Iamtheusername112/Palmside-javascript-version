-- Add response_templates table
CREATE TABLE IF NOT EXISTS response_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  is_default BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default templates
INSERT INTO response_templates (name, subject, content, category, is_default, use_count) VALUES
('General Inquiry Response', 'Thank you for your inquiry', 'Dear {{firstName}},

Thank you for reaching out to us. We have received your inquiry and our team will review it shortly.

We typically respond to inquiries within 24 hours during business days. If you have any urgent questions, please don''t hesitate to call us at {{phoneNumber}}.

Best regards,
{{companyName}} Team', 'general', true, 45),
('Property Information Request', 'Property Information - {{propertyName}}', 'Dear {{firstName}},

Thank you for your interest in {{propertyName}}. I''m happy to provide you with detailed information about this property.

{{propertyDetails}}

Please let me know if you would like to schedule a viewing or if you have any additional questions.

Best regards,
{{agentName}}
{{companyName}}', 'property', true, 32),
('Appointment Confirmation', 'Appointment Confirmation - {{appointmentDate}}', 'Dear {{firstName}},

This email confirms your appointment scheduled for {{appointmentDate}} at {{appointmentTime}}.

Location: {{appointmentLocation}}
Duration: {{appointmentDuration}}

Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Best regards,
{{companyName}} Team', 'appointment', true, 28);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_response_templates_category ON response_templates(category);
CREATE INDEX IF NOT EXISTS idx_response_templates_is_default ON response_templates(is_default);
