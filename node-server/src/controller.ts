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

    public handle(method:string, segments:string[], body:string):{status:Status, resBody:User | User[] | undefined} {
        //method is GET/POST/PATCH/DELETE
        //segments are resourc
        if(Controller.supportedMethods.includes(method)){
            const route:string = segments[0];
            
            return this.routes[`${method} ${segments[0]}`]()
        }else{
            return {status: Status.NOT_ALLOWED, resBody:undefined}
        }
    }
}