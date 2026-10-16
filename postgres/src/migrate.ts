/*
* Migration runner using pg client.
* Automates applying migrations
* Looks at numbered sql files, determines which ones database hasn't seen yet, and applies
* unseen files in order.
*/
import pg from "pg";

const client = new pg.Client({
    host: "localhost",
    port: 5678,
    user:"postgres",
    password:"password"
});

//connect to postgres
await client.connect();

//create schema_migrations if it doesnt exist

//read migrations directory