// app.ts
import express from "express";
import userRouter from "./users/userRouter";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app = express();
app.use(express.json()); // This line is crucial
app.use('/api/users/',userRouter)
app.use(globalErrorHandler);
export default app;