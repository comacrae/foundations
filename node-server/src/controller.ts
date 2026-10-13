import type {User} from "./types.js";
const getUsers = (): User[] => {
    return [];
}
const getUser = (id:string) : User | null => {
    return null;
}

const addUser = (input:{name:string, age:number}):void => {
    
}

export default {getUser, getUsers, addUser, updateUser, deleteUser};