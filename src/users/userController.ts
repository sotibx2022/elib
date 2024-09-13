import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Users } from "./userModel";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { config } from "../config/configuration";
// Create User Controller
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if the request body is empty
        if (!req.body) {
            return next(createHttpError(400, "No body provided"));
        }
        const { firstName,lastName, email, password } = req.body;
        // Validate required fields
        if (!firstName ||!lastName || !email || !password) {
            return next(createHttpError(400, "All fields are required"));
        }
        // Check if the user already exists
        let user = await Users.findOne({ email });
        if (user) {
            return next(createHttpError(400, "User Already Exists with provided Email"));
        }
        // Hash the password and create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            name: firstName + lastName,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, config.SECRET_KEY!, {
            expiresIn: '2h'
        });
        return res.status(201).json({success:true, status:200, message:"User Registered Successfully !", accessToken:token });
    } catch (error) {
        return next(error);
    }
};
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(createHttpError(400, "Email and Password are required"));
    }
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return next(createHttpError(404, "User Not Found"));
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return next(createHttpError(400, "Incorrect Password"));
        }
        const token = jwt.sign({ userId: user._id }, config.SECRET_KEY!, {
            expiresIn: '2h'
        });
        return res.status(200).json({success:true, status:200, message:"User Login Successfully !", accessToken:token });
    } catch (error) {
        return next(error);
    }
};
