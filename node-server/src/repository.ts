import type {Author, AuthorCreateRequest} from "./types.js";

export default class AuthorRepository{
    private cache: Map<number, Author>;
    private idIterator:number = 0;

    constructor(){
        this.cache = new Map(); // use a map for toy
    }

    public getAllAuthors():Author[]{
        return[]
    }

    public getAuthor(id:number):Author|undefined{
        return this.cache.get(id);
    }

    public addAuthor(name:string, birthDate:Date):Author{
        const addAuthor:AuthorCreateRequest = {
            name:name,
            birthDate:birthDate,
        }
        
        return {id:1, name,birthDate};
    }

    public deleteAuthor(id:number): boolean{
        return true;
    }

    public updateAuthor(id:number, name?:string,birthDate?:Date):Author|undefined{
        return undefined;
    }
}