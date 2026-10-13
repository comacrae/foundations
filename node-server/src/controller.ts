import UserRepository from "./repository.js"
import type { User } from "./types.js";
import {getUser, addUser, deleteUser, getUsers, updateUser} from "./service.js";


type HTTPMethod = (typeof Controller.supportedMethods)[number];
const Status = {
    NOT_FOUND:404,
    OK:200
} as const;
type Status = (typeof Status)[keyof typeof Status];

export default class Controller{
    private repository: UserRepository;
    static supportedMethods = ["GET", "DELETE", "PATCH", "POST"] as const;
    private routes;
    
    constructor(repo:UserRepository){
        this.repository = repo;
        this.routes = {
            "GET users": getUsers,
            "GET users/:id": getUser,
            "POST users": addUser,
            "DELETE users/:id": deleteUser,
            "PATCH users/:id": updateUser
        };
    }

    public handle(method:string, segments:string[], body:string):{status:Status, resBody:User | User[] | undefined} {
        const response = {
            status:200,
            resBody:undefined
        };
        return response;
    }
}