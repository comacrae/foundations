type User = {
    id:string;
    name:string;
    age:number;
}

type UserCreateRequest =  {
    name:string;
    age:string
}

type UserUpdateRequest = {
    name?:string;
    age?:string;
}

type UserDeleteRequest = {
    id:string;
}

export type {User, UserCreateRequest, UserDeleteRequest, UserUpdateRequest};