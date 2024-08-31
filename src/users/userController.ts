import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Users } from "./userModel";
import bcrypt from 'bcrypt';
import jwt  from "jsonwebtoken";
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if the request body is empty
        if (!req.body) {
            return next(createHttpError(400, "No body provided"));
        }
        const { name, email, password } = req.body;
        // Validate required fields
        if (!name || !email || !password) {
            return next(createHttpError(400, "All fields are required"));
        }
        let user = await Users.findOne({email:email});
        if(user){
            return next(createHttpError(400,"User Already Exist with provided Email"))
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await Users.create({
            name,
            email,
            password:hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, "secretKey", {
            expiresIn: '2h'
        });
        res.cookie('accessToken',token,{
            httpOnly:true,
            maxAge:2 * 60 * 60 * 1000
        })
        return res.json(token);
    } catch (error) {
        // Pass any unexpected errors to the error-handling middleware
        return next(error);
    }
};
