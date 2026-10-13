import type {User, UserCreateRequest, UserDeleteRequest, UserGetRequest, UserUpdateRequest} from "./types.js";
import UserRepository from "./repository.js";
export default class UserService{
    private repo:UserRepository;
    constructor(repository:UserRepository){
        this.repo = repository;
    }

    private checkValidInput(name?:string, age?:number):void{
        if(age !=null && age <1)
            throw new Error(`Invalid age: ${age}. Must be >=1`);
        if(name != null && name.trim().length === 0)
            throw new Error(`Invalid name: ${name}. Cannot be empty`);
    }

    public getUsers = (): User[] => {
        return this.repo.getAllUsers();
    }
    public getUser = (id:number) : User | undefined => {
        return this.repo.getUser(id);
    }
    
    public addUser = (name:string, age:number):User => {
        this.checkValidInput(name,age);
       return this.repo.addUser(name,age);
    }
    
    public updateUser = (id:number,name?:string, age?:number):User|undefined => {
        this.checkValidInput(name,age);
        return this.repo.updateUser(id,name,age);
    }
    
    public deleteUser = (id:number): boolean => {
        return this.repo.deleteUser(id);
    }
    
}
