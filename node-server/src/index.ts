import http from "node:http";
import { URL } from "node:url";
import {getUser, addUser, deleteUser, getUsers} from "./controller.js";

/*
* This server is a toy CRUD server allowing me to practice with raw HTTP requests
*/


const routes:Map<string, Function> = {
    "users": getUser
}

const server = http.createServer((req,res)=>{
    const url = new URL(req.url?? "", "http://localhost:3000");

});

server.listen(3000);