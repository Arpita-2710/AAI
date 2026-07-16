CREATE TABLE "app_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"clerk_id" text,
	"status" text DEFAULT 'ACTIVE',
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "app_users_email_unique" UNIQUE("email"),
	CONSTRAINT "app_users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"action" text NOT NULL,
	"user_id" text,
	"ip_address" text,
	"details" text,
	"severity" text DEFAULT 'INFO',
	"terminal_id" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "incident_timeline" (
	"id" serial PRIMARY KEY NOT NULL,
	"incident_id" integer NOT NULL,
	"actor" varchar(100) NOT NULL,
	"action" varchar(200) NOT NULL,
	"note" text,
	"happened_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" serial PRIMARY KEY NOT NULL,
	"incident_ref" varchar(20) NOT NULL,
	"device_id" varchar(30),
	"terminal_id" varchar(10) NOT NULL,
	"level_id" integer,
	"title" varchar(200) NOT NULL,
	"description" text,
	"issue_type" varchar(50) NOT NULL,
	"severity" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'OPEN' NOT NULL,
	"reported_by" varchar(100),
	"assigned_to" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	CONSTRAINT "incidents_incident_ref_unique" UNIQUE("incident_ref")
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"terminal_id" varchar(10) NOT NULL,
	"level_number" integer NOT NULL,
	"label" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "levels_terminal_id_level_number_unique" UNIQUE("terminal_id","level_number")
);
--> statement-breakpoint
CREATE TABLE "maintenance_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(30) NOT NULL,
	"issue_text" varchar(300) NOT NULL,
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"is_resolved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"event_type" text NOT NULL,
	"severity" text DEFAULT 'INFO',
	"user_id" text,
	"ip_address" text,
	"details" text,
	"source" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"ammonia_threshold" integer DEFAULT 50,
	"traffic_limit_per_hour" integer DEFAULT 200,
	"whi_alert_threshold" integer DEFAULT 60,
	"ping_interval_seconds" integer DEFAULT 30,
	"email_alerts" boolean DEFAULT true,
	"sms_alerts" boolean DEFAULT false,
	"auto_escalation" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "terminals" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	"type" varchar(20) NOT NULL,
	"total_levels" integer DEFAULT 6 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "washroom_state" (
	"device_id" varchar(30) PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"occupancy_status" varchar(20) NOT NULL,
	"occupancy_count" integer DEFAULT 0 NOT NULL,
	"door_status" varchar(10) NOT NULL,
	"cleanliness_score" real NOT NULL,
	"soap_pct" real NOT NULL,
	"paper_pct" real NOT NULL,
	"sanitizer_pct" real NOT NULL,
	"ammonia_ppm" real NOT NULL,
	"co2_ppm" real NOT NULL,
	"humidity_pct" real NOT NULL,
	"temp_celsius" real NOT NULL,
	"battery_level" real NOT NULL,
	"signal_strength" real NOT NULL,
	"whi_score" real NOT NULL,
	"last_cleaned_at" timestamp,
	"last_inspected_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "washroom_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(30) NOT NULL,
	"terminal_id" varchar(10) NOT NULL,
	"level_id" integer NOT NULL,
	"unit_type" varchar(5) NOT NULL,
	"unit_number" integer NOT NULL,
	"label" varchar(60) NOT NULL,
	"capacity" integer NOT NULL,
	"location_desc" varchar(200),
	"is_active" boolean DEFAULT true NOT NULL,
	"installed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "washroom_units_device_id_unique" UNIQUE("device_id"),
	CONSTRAINT "washroom_units_terminal_id_level_id_unit_type_unit_number_unique" UNIQUE("terminal_id","level_id","unit_type","unit_number")
);
--> statement-breakpoint
CREATE TABLE "whi_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(30) NOT NULL,
	"date" date NOT NULL,
	"avg_whi" real NOT NULL,
	"min_whi" real NOT NULL,
	"max_whi" real NOT NULL,
	"total_occupancy_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "whi_history_device_id_date_unique" UNIQUE("device_id","date")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_terminal_id_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."terminals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_timeline" ADD CONSTRAINT "incident_timeline_incident_id_incidents_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incidents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_device_id_washroom_units_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."washroom_units"("device_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_terminal_id_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_terminal_id_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."terminals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_issues" ADD CONSTRAINT "maintenance_issues_device_id_washroom_units_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."washroom_units"("device_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "washroom_state" ADD CONSTRAINT "washroom_state_device_id_washroom_units_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."washroom_units"("device_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "washroom_units" ADD CONSTRAINT "washroom_units_terminal_id_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "washroom_units" ADD CONSTRAINT "washroom_units_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whi_history" ADD CONSTRAINT "whi_history_device_id_washroom_units_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."washroom_units"("device_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "app_users_clerk_idx" ON "app_users" USING btree ("clerk_id");--> statement-breakpoint
CREATE INDEX "app_users_role_idx" ON "app_users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "system_logs_timestamp_idx" ON "system_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "system_logs_severity_idx" ON "system_logs" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "system_logs_event_idx" ON "system_logs" USING btree ("event_type");