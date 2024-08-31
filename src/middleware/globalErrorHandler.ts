import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/configuration";
const globalErrorHandler = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;  // Provide a default status code if it's undefined
    return res.status(statusCode).json({
        message: error.message,
        errorStack: config.ENV === "development" ? error.stack : "" // Show stack trace only in development
    });
};
export default globalErrorHandler;
