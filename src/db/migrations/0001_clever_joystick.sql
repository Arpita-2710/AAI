CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"generated_by" text,
	"terminal_id" text,
	"summary" text,
	"data" jsonb,
	"status" text DEFAULT 'GENERATED',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_app_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_terminal_id_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."terminals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_generated_by_idx" ON "reports" USING btree ("generated_by");--> statement-breakpoint
CREATE INDEX "reports_terminal_idx" ON "reports" USING btree ("terminal_id");--> statement-breakpoint
CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");