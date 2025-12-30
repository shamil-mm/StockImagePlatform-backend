export interface JWTPayload{
    userId:String
}
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJWTService{
  generateTokenPair(payload:JWTPayload):TokenPair;
  verifyAccessToken(token:string):JWTPayload;
  verifyRefreshToken(token:string):JWTPayload;
}