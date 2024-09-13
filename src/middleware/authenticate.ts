import { NextFunction, Response,Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from "../config/configuration";
import createHttpError from "http-errors";
interface AuthRequest extends Request{
    userId:string
}
export const authentication =(req:Request,res:Response,next:NextFunction)=>{
    const headerToken = req.header('Authorization');
    const tokenPart = headerToken?.split(" ")[1];
    if(tokenPart){
        const decodedToken = jwt.verify(tokenPart,config.SECRET_KEY!) as JwtPayload;
    const _req = req as AuthRequest;
        _req.userId = decodedToken.userId
        next()
    }
    else{
        return next(createHttpError(400,"Token Not found"))
    }
}