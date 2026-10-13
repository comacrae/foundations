import http, { IncomingMessage } from "node:http";
import UserRepository from "./repository.js";
import UserService from "./service.js";
import Controller from "./controller.js";
import {Status} from "./controller.js";


/*
* This server is a toy CRUD server for practicing raw HTTP requests 
* to better appreciate the steps underlying abstractions when using fetch,
* React Router, Next.js page layouts, etc.
*/

const controller = new Controller(new UserService(new UserRepository()));

const readBody = async (req:IncomingMessage): Promise<string>  => {
    return new Promise<string>((resolve,reject)=>{
        let body:Buffer[] = [];
        req.on('error', (err)=>{
            reject(err);
        }).on('data', chunk =>{
            body.push(chunk);
        }).on('end',() => {
            resolve(Buffer.concat(body).toString());
        })
    });
}
const server = http
    .createServer(async (req,res)=>{

        //parse the segments
        const url = new URL(req.url?? "", "http://localhost:3000");
        const segments = url.pathname.split("/").filter((seg) => seg.trim() !== ""); // remove empty segments
        res.setHeader('Content-Type','application/json');

        //parse the body
        try{
            const reqBody = await readBody(req);
            const {status,resBody} = controller.handle(req.method ?? "", segments,reqBody);

            res.statusCode=status;
            res.end(JSON.stringify(resBody));
        }catch(error){
            console.error(error);
            res.statusCode=Status.BAD_REQUEST;
            res.end(JSON.stringify(error))
        }


});

server.listen(3000);