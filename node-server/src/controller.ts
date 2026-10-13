import UserService from "./service.js";
import type { User } from "./types.js";

type RouteHandler = (id?:string, body?:string) => {status:Status, resBody:unknown};
const Status = {
    NOT_FOUND:404,
    OK:200,
    NOT_ALLOWED:405
} as const;
type Status = (typeof Status)[keyof typeof Status];

export default class Controller{
    private service: UserService;
    static supportedMethods = ["GET", "DELETE", "PATCH", "POST"];
    private routes: Record<string, RouteHandler>;
    
    constructor(service:UserService){
        this.service = service;
        this.routes = {
            "GET users/:id": (id) => {
                const user = this.service.getUser(Number(id));
                if (!user) return {status:Status.NOT_FOUND, resBody:undefined}
                return {status:Status.OK, resBody:user};
            },
            "GET users": () => {
                return {status:Status.OK, resBody:this.service.getUsers()}
            },
            "POST users": (_,body) => {
                const {name,age}: {name:string, age:string} = JSON.parse(body??"");
                const user = this.service.addUser(name, Number(age));
                return {status:Status.OK, resBody:user};
            },
            "DELETE users/:id": (id,_)=>{
                if(this.service.deleteUser(Number(id)))
                    return {status:Status.OK, resBody:undefined}
                else
                    return {status:Status.NOT_FOUND, resBody:undefined}
            },
            "PATCH users/:id": (id,body)=>{
                const {name, age}:{name:string, age:string} = JSON.parse(body ?? "");
                const user = this.service.updateUser(Number(id),name,Number(age));
                return {status: user? Status.OK : Status.NOT_FOUND, resBody: user};
            }
        };
    }

    public handle(method:string, segments:string[], body:string): ReturnType<RouteHandler> {
        //method is GET/POST/PATCH/DELETE
        //segments are resourc
        if(Controller.supportedMethods.includes(method)){
            //make sure resource segment exists
            const resource:string | undefined = segments[0];
            if(!resource) return {status:Status.NOT_FOUND, resBody:undefined};

            //parse id if its present
            const id: string | undefined = segments[1];
            const route = `${method} ${resource}${id ? "/:id" : ""}`
            
            // get and call handler
            const handler = this.routes[route];
            if(!handler) return {status:Status.NOT_FOUND, resBody:undefined}
            return handler(id, body);
        }else{
            return {status: Status.NOT_ALLOWED, resBody:undefined}
        }
    }
}