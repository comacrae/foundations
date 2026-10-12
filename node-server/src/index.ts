import http from "node:http";
import { URL } from "node:url";

/*
* This server is a toy project allowing me to practice with raw HTTP requests
* A simple cache stores "users". You can return the users, get a specific one,
* delete one, or update one. 
* I don't bother with layers because it's an example more than anything.
*/
interface User {
    id:string;
    name:string;
    age:number;
}

const userCache: Map<string, User>  = new Map();
const routes:Map<string, Function> = {
    "users": getUser
}

const server = http.createServer((req,res)=>{
    const url = new URL(req.url?? "", "http://localhost:3000");

});

server.listen(3000);