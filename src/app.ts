// app.ts
import express from "express";
import userRouter from "./users/userRouter";
import globalErrorHandler from "./middleware/globalErrorHandler";
import bookRouter  from "./books/bookRouter";
const app = express();
app.use(express.json()); // This line is crucial
app.use('/api/users/',userRouter)
app.use('/api/books', bookRouter);
app.use(globalErrorHandler);
export default app;