import type {User, UserCreateRequest, UserDeleteRequest, UserGetRequest, UserUpdateRequest} from "./types.js";
const getUsers = (): User[] => {
    return [];
}
const getUser = (req:UserGetRequest) : User | null => {
    return null;
}

const addUser = (req:UserCreateRequest):void => {
    return;
}

const updateUser = (req:UserUpdateRequest):void => {
    return;
}

const deleteUser = (req:UserDeleteRequest): void => {
    return;
}

export default {getUser, getUsers, addUser, updateUser, deleteUser};