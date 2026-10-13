import UserRepository from "./repository.js"
import type { User } from "./types.js";

type HTTPMethod = (typeof Controller.supportedMethods)[number];
const Status = {
    NOT_FOUND:404,
    OK:200
}
type Status = (typeof Status)[keyof typeof Status];

export default class Controller{
    private repository: UserRepository;
    static supportedMethods = ["GET", "DELETE", "PATCH", "POST"] as const;
    
    constructor(repo:UserRepository){
        this.repository = repo;
    }

    public handle(method:HTTPMethod, segments:string[], body:string):{status:Status, body:User | User[] | undefined} {
        const response = {
            status:200,
            body:undefined
        }
        return response;
    }
}