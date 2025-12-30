import { HydratedDocument } from "mongoose";
import { IUser } from "../../models/user/user.interface";
import { IBaseRepository } from "../Base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<HydratedDocument<IUser> | null>;
//   create(data: Partial<IUser>): Promise<IUser>;
//   comparePassword(user: IUser, password: string): Promise<boolean>;
  
}
