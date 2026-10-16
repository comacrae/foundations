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
await client.query(
    `CREATE TABLE IF NOT EXISTS migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT NOW()
    );`
);

//read migrations directory
let migrationFiles = fs.readdir(
    process.env.MIGRATION_DIR_PATH,
    {}, 
    (err,files)=>{
        if(err)
            throw new Error(err.message);
        files.forEach((file) => {
            console.log(file);
        })
});
//const 
// keep only sql files

// sort files by name 

// get all filenames from schema migration

// for sql files in the mgiration dir NOT in migration table

// 1. begin a transaction
// 2. apply sql from the file
// 3. add the filename to the migration table
// 4. commit the transaction or rollback if failure
}catch(err){
    console.error(err);
}finally{
    client.end();
    // close connection
    console.log("Connection closed");

}