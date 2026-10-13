import type {User} from "./types.js";
export default class UserDatabase{
    private cache: Map<number, User>;
    private idIterator:number = 0;

    constructor(){
        this.cache = new Map();
    }

    public getAllUsers():User[]{
        return Array.from(this.cache.values());
    }

    public getUser(id:number):User|undefined{
        return this.cache.get(id);
    }

    public addUser(name:string, age:number):User{
        const u:User = {
            id: this.idIterator,
            name:name,
            age:age,
        }
        this.cache.set(u.id, u);
        this.idIterator +=1;
        return u;
    }

    public deleteUser(id:number): boolean{
        return this.cache.delete(id);
    }

    public updateUser(id:number, name?:string,age?:number):User|undefined{
        const u = this.cache.get(id);
        if(u){
            u.name = name || u.name;
            u.age = age || u.age;
            this.cache.set(u.id, u);
        }
        return u;
    }
}