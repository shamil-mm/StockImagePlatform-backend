import mongoose from "mongoose";
import { IUser } from "./user.interface";
import { userSchema } from "./user.schema";

export const User=mongoose.model<IUser>("User",userSchema)