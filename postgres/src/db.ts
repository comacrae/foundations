import pg from "pg";
import {loadEnvFile} from "node:process";

export function getClient(envPath=".env"): pg.Client{
    loadEnvFile(envPath);
    return new pg.Client({
        host: process.env.POSTGRES_HOST ?? "localhost",
        port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5678,
        user:process.env.POSTGRES_USER ?? "postgres",
        password:process.env.POSTGRES_PASSWORD ?? "password"
    });
}

export function getPool(envPath=".env"): pg.Pool{
    loadEnvFile(envPath);
    return new pg.Pool({
        host: process.env.POSTGRES_HOST ?? "localhost",
        port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5678,
        user:process.env.POSTGRES_USER ?? "postgres",
        password:process.env.POSTGRES_PASSWORD ?? "password"
    });
}

export async function withTransaction<T>(pool:pg.Pool,work:(client:pg.PoolClient)=>Promise<T>):Promise<T>{
    const client = await pool.connect();
    try{
        await client.query("BEGIN TRANSACTION;");
        const result = await work(client);
        await client.query("COMMIT;");
        return result;
    }catch(error){
        await client.query("ROLLBACK");
        throw error;
    }finally{
        await client.release();
    }
}