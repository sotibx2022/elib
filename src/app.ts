// app.ts
import express from "express";
import cors from 'cors';
import userRouter from "./users/userRouter";
import globalErrorHandler from "./middleware/globalErrorHandler";
import bookRouter  from "./books/bookRouter";
import { config } from "./config/configuration";
const app = express();
app.use(express.json()); // This line is crucial
app.use(cors({
    origin:config.FRONTEND_URL
}))
app.use('/api/users/',userRouter)
app.use('/api/books', bookRouter);
app.use(globalErrorHandler);
export default app;