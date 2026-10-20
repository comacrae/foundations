import UserService from "./service.js";

type RouteHandler = (id?:string, body?:string) => {status:Status, resBody:unknown};
export const Status = {
    NOT_FOUND:404,
    OK:200,
    NOT_ALLOWED:405,
    BAD_REQUEST:400
} as const;
type Status = (typeof Status)[keyof typeof Status];

export default class Controller{
    private service: UserService;
    static supportedMethods = ["GET", "DELETE", "PATCH", "POST"];
    private routes: Record<string, RouteHandler>;
    
    constructor(service:UserService){
        this.service = service;
        this.routes = {
            "GET authors/:id": (id) => {
                const user = this.service.getAuthor(Number(id));
                if (!user) return {status:Status.NOT_FOUND, resBody:undefined}
                return {status:Status.OK, resBody:user};
            },
            "GET authors": () => {
                return {status:Status.OK, resBody:this.service.getAuthors()}
            },
            "POST authors": (_,body) => {
                const {name,birthDate}: {name?:string, birthDate?:string} = JSON.parse(body??"");
                if (name === undefined)
                    throw new Error ("Name must be defined");
                if (birthDate === undefined)
                    throw new Error ("Birthdate must be defined");

                const user = this.service.addAuthor(name, new Date(birthDate));
                return {status:Status.OK, resBody:user};
            },
            "DELETE author/:id": (id,_)=>{
                if(this.service.deleteUser(Number(id)))
                    return {status:Status.OK, resBody:undefined}
                else
                    return {status:Status.NOT_FOUND, resBody:undefined}
            },
            "PATCH users/:id": (id,body)=>{
                const {name, birthDate}:{name?:string, birthDate?:string} = JSON.parse(body ?? "");
                const date: Date | undefined = birthDate ? new Date(birthDate) : undefined;
                    
                const user = this.service.updateAuthor(Number(id),name,date);
                return {status: user? Status.OK : Status.NOT_FOUND, resBody: user};
            }
        };
    }

    public handle(method:string, segments:string[], body:string): ReturnType<RouteHandler> {
        //method is GET/POST/PATCH/DELETE
        //segments are resource / id

        if(Controller.supportedMethods.includes(method)){
            if(segments.length > 2)
                return {status: Status.NOT_FOUND, resBody:undefined}
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