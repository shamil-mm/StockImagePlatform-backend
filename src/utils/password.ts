import bcrypt from "bcryptjs";

export const hashPassword=(password:string)=>{
    return bcrypt.hash(password,10)
}

export const matchPassword=(inputPassword:string,dbPassword:string)=>{
    return bcrypt.compare(inputPassword,dbPassword)
}

