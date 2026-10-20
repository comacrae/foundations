import pg from "pg";
import {loadEnvFile} from "node:process";


export function getClient(envPath=".env"): pg.Client{
    loadEnvFile(envPath);
    if(process.env.DATABASE_URL === undefined)
        throw new Error("Database url not defined in env vars");
    return new pg.Client({connectionString:process.env.DATABASE_URL});
}

export function getPool(envPath=".env"): pg.Pool{
    loadEnvFile(envPath);
    if(process.env.DATABASE_URL === undefined)
        throw new Error("Database url not defined in env vars");
    return new pg.Pool({connectionString:process.env.DATABASE_URL});
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