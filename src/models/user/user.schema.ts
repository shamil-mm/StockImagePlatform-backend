import { Schema } from "mongoose";
import { IUser } from "./user.interface";


export const userSchema=new Schema<IUser>({
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:true},
    name:{type:String,required:true},
    password:{type:String,required:true}
},{timestamps:true})