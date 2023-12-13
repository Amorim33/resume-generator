import { sql } from 'slonik';

export default sql.unsafe`
    CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "about" text NOT NULL,
        "contact" varchar(255) NOT NULL,
        "name" varchar(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "resumes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "html" text NOT NULL
    );
`;
