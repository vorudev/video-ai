CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(500) NOT NULL,
	"bucket_name" varchar(100) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100),
	"file_size" integer,
	"description" text,
	"tags" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
