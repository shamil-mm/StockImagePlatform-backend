import jwt,{  SignOptions } from "jsonwebtoken";
import { JWTPayload,TokenPair } from "./interface.JwtService";
class JWTService{
    private readonly secret:string;
    private readonly accessOptions:SignOptions
    private readonly refreshOptions:SignOptions

    constructor(){
        this.secret=process.env.JWT_SECRET as string;
        this.accessOptions={
            expiresIn:(process.env.JWT_ACCESS_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"]
        }
        this.refreshOptions={
            expiresIn:(process.env.JWT_REFRESH_EXPIRES_IN  ?? "1d") as SignOptions["expiresIn"]
        }

    }

    generateTokenPair(payload:JWTPayload):TokenPair{
        const accessToken=jwt.sign(payload,this.secret,this.accessOptions)
        const refreshToken=jwt.sign(payload,this.secret,this.refreshOptions);
        return {accessToken,refreshToken}
    }
    verifyAccessToken(token:string):JWTPayload {
        return jwt.verify(token,this.secret) as JWTPayload
    }
    verifyRefreshToken(token: string): JWTPayload {
        return jwt.verify(token, this.secret) as JWTPayload;
    }
}
export default new JWTService()