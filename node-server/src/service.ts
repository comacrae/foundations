import type {Author, AuthorCreateRequest, AuthorDeleteRequest, AuthorUpdateRequest, AuthorGetRequest} from "./types.js";
import AuthorRepository from "./repository.js";
export default class UserService{
    private repo:AuthorRepository;
    constructor(repository:AuthorRepository){
        this.repo = repository;
    }

    private checkValidInput(name?:string, birthDate?:Date):void{
        if(birthDate !=null && !(birthDate < new Date("01-01-1995")))
            throw new Error(`Invalid birthDate: ${birthDate}. Must be before Jan 01 1995`);
        if(name != null && name.trim().length === 0)
            throw new Error(`Invalid name: ${name}. Cannot be empty`);
    }

    public getAuthors = (): Author[] => {
        return this.repo.getAllAuthors();
    }
    public getAuthor = (id:number) : Author | undefined => {
        return this.repo.getAuthor(id);
    }
    
    public addAuthor = (name:string, birthDate:Date):Author => {
        this.checkValidInput(name,birthDate);
       return this.repo.addAuthor(name, birthDate);
    }
    
    public updateAuthor = (id:number,name?:string, birthDate?:Date):Author|undefined => {
        this.checkValidInput(name,birthDate);
        return this.repo.updateAuthor(id,name,birthDate);
    }
    
    public deleteUser = (id:number): boolean => {
        return this.repo.deleteAuthor(id);
    }
    
}
