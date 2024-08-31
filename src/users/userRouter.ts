import { Request, Response, Router } from 'express';
const userRouter = Router();
userRouter.post("/register",(req:Request,res:Response)=>{
    res.json("User Posted");
})
export default userRouter;