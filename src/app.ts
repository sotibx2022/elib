// app.ts
import express from "express";
import userRouter from "./users/userRouter";
const app = express();
app.use('/api/users/',userRouter)
export default app;