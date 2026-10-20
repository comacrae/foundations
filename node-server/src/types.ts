type Author = {
    id:number;
    name:string;
    birthDate:Date;
}

type AuthorGetRequest = {
    id:string;
}

type AuthorCreateRequest =  {
    name:string;
    birthDate:Date;
}

type AuthorUpdateRequest = {
    id:string;
    name?:string;
    birthDate?:string;
}

type AuthorDeleteRequest = {
    id:string;
}

export type {Author, AuthorGetRequest, AuthorDeleteRequest, AuthorUpdateRequest, AuthorCreateRequest};