/*
* Migration runner using pg client.
* Automates applying migrations
* Looks at numbered sql files, determines which ones database hasn't seen yet, and applies
* unseen files in order.
*/
import pg from "pg";
import {readdir, readFile} from "node:fs/promises";
import { join } from "node:path";
import { loadEnvFile} from "node:process";

// import env file
loadEnvFile(".env");
const client = new pg.Client({
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5678,
    user:process.env.POSTGRES_USER ?? "postgres",
    password:process.env.POSTGRES_PASSWORD ?? "password"
});


//connect to postgres
await client.connect();

//create schema_migrations if it doesnt exist (filename key + applied_at timestamp)

try{

    if(process.env.MIGRATION_DIR_PATH === undefined)
        throw new Error(`MIGRATION_DIR_PATH is undefined`);

    //read migrations directory and filter for only .sql files
    let migrationFiles:string[] = await readdir(process.env.MIGRATION_DIR_PATH)
        .then(
            (filenames) => filenames
            .filter((filename) => filename.endsWith(".sql"))
            .sort() // ascending, utf-8 encoded order
        );

    // create migrations table if it doesnt exist
    await client.query(
        `CREATE TABLE IF NOT EXISTS migrations (
            filename text PRIMARY KEY,
            applied_at timestamptz NOT NULL DEFAULT NOW()
        );`
    );

    // get all filenames from schema migration
    const result = await client.query<{filename:string}>( `select filename from migrations`);

    const existingMigrations:string[] = result.rows
    .map((row) => row.filename);

    // for sql files in the mgiration dir NOT in migration table
    for(const filename of migrationFiles){
        if(!existingMigrations.includes(filename)){
            // get full filepath
            const filepath = join(process.env.MIGRATION_DIR_PATH, filename);
            // get command from file
            const fileQuery = await readFile(filepath);
            console.log(fileQuery);
            // 1. begin a transaction
            // 2. apply sql from the file
            // 3. add the filename to the migration table
            // 4. commit the transaction or rollback if failure
        }
    }


}catch(err){
    console.error(err);
}finally{
    await client.end();
    // close connection
    console.log("Connection closed");

}