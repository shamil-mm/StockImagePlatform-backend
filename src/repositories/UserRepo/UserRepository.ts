import BaseRepository from "../Base/BaseRepository";
import { IUser } from "../../models/user/user.interface";
import { User } from "../../models/user/user.model";
import { IUserRepository } from "./IUserRepository";
import { HydratedDocument } from "mongoose";


class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor(){
        super(User)
    }
    async findByEmail (email:string):Promise<HydratedDocument<IUser>|null>{
        return this.findOne({email})
    }
}

export default new UserRepository()