type User = {
    id:string;
    name:string;
    age:number;
}

type UserGetRequest = {
    id:string;
}

type UserCreateRequest =  {
    name:string;
    age:string
}

type UserUpdateRequest = {
    id:string;
    name?:string;
    age?:string;
}

type UserDeleteRequest = {
    id:string;
}

export type {User, UserGetRequest, UserCreateRequest, UserDeleteRequest, UserUpdateRequest};