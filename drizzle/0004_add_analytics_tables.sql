-- Add analytics and performance tracking tables for comprehensive reporting

-- Contact analytics table for detailed tracking
CREATE TABLE IF NOT EXISTS "contact_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer REFERENCES "contacts"("id") ON DELETE CASCADE,
	"priority" varchar(20) DEFAULT 'medium',
	"source" varchar(100) DEFAULT 'website',
	"response_time_minutes" integer,
	"conversion_status" varchar(50) DEFAULT 'pending',
	"follow_up_count" integer DEFAULT 0,
	"last_follow_up" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Property performance analytics
CREATE TABLE IF NOT EXISTS "property_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer REFERENCES "properties"("id") ON DELETE CASCADE,
	"views" integer DEFAULT 0,
	"inquiries" integer DEFAULT 0,
	"conversion_rate" decimal(5,2) DEFAULT 0.00,
	"avg_time_on_page" integer DEFAULT 0,
	"bounce_rate" decimal(5,2) DEFAULT 0.00,
	"last_updated" timestamp DEFAULT now()
);

-- System performance metrics
CREATE TABLE IF NOT EXISTS "system_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"metric_value" text NOT NULL,
	"category" varchar(50) DEFAULT 'performance',
	"timestamp" timestamp DEFAULT now()
);

-- Monthly trends data
CREATE TABLE IF NOT EXISTS "monthly_trends" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" varchar(10) NOT NULL,
	"year" integer NOT NULL,
	"contacts_count" integer DEFAULT 0,
	"properties_count" integer DEFAULT 0,
	"responses_count" integer DEFAULT 0,
	"conversion_rate" decimal(5,2) DEFAULT 0.00,
	"created_at" timestamp DEFAULT now(),
	UNIQUE("month", "year")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "contact_analytics_contact_id_idx" ON "contact_analytics"("contact_id");
CREATE INDEX IF NOT EXISTS "contact_analytics_priority_idx" ON "contact_analytics"("priority");
CREATE INDEX IF NOT EXISTS "contact_analytics_conversion_status_idx" ON "contact_analytics"("conversion_status");
CREATE INDEX IF NOT EXISTS "property_analytics_property_id_idx" ON "property_analytics"("property_id");
CREATE INDEX IF NOT EXISTS "system_metrics_timestamp_idx" ON "system_metrics"("timestamp");
CREATE INDEX IF NOT EXISTS "monthly_trends_month_year_idx" ON "monthly_trends"("month", "year");
