import http from "node:http";

const server = http.createServer((req,res)=>{
    const body = "Hello world";
    res.writeHead(200,
        {
        "Content-Type":"text/plain",
        "Content-Length": Buffer.byteLength(body)
        }
    ).end(body);
});

server.listen(3000);