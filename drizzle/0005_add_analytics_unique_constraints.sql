-- Add unique constraints to analytics tables for proper ON CONFLICT handling

-- Add unique constraint to contact_analytics.contact_id
ALTER TABLE "contact_analytics" ADD CONSTRAINT "contact_analytics_contact_id_unique" UNIQUE ("contact_id");

-- Add unique constraint to property_analytics.property_id  
ALTER TABLE "property_analytics" ADD CONSTRAINT "property_analytics_property_id_unique" UNIQUE ("property_id");
