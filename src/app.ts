// app.ts
import express from "express";
import cors from 'cors';
import userRouter from "./users/userRouter";
import globalErrorHandler from "./middleware/globalErrorHandler";
import bookRouter  from "./books/bookRouter";
import { config } from "./config/configuration";
const allowedOrigins = [config.FRONTEND_URL, config.DASHBOARD_URL];
const app = express();
app.use(express.json()); // This line is crucial
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow methods as needed
}));
app.use('/api/users/',userRouter)
app.use('/api/books', bookRouter);
app.use(globalErrorHandler);
export default app;