/*
* Migration runner using pg client.
* Automates applying migrations
* Looks at numbered sql files, determines which ones database hasn't seen yet, and applies
* unseen files in order.
*/
import pg from "pg";
import fs from "node:fs";
import { loadEnvFile} from "node:process";

// import env file
loadEnvFile("../.env");
const client = new pg.Client({
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT) ?? 5678,
    user:process.env.POSTGRES_USER ?? "postgres",
    password:process.env.POSTGRES_PASSWORD ?? "password"
});

//connect to postgres
await client.connect();

//create schema_migrations if it doesnt exist (filename key + applied_at timestamp)

const createMigrationSchemaQuery = new pg
.Query(
    `CREATE TABLE IF NOT EXISTS migrations (
        filename text PRIMARY KEY,
        applied_at date NOT NULL DEFAULT NOW()
    )
`);
//client.query(createMigrationSchemaQuery);

//read migrations directory
//const 
// keep only sql files

// sort files by name 

// get all filenames from schema migration

// for sql files in the mgiration dir NOT in migration table

// 1. begin a transaction
// 2. apply sql from the file
// 3. add the filename to the migration table
// 4. commit the transaction or rollback if failure

// close connection

// print log 