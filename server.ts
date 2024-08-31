import { NextFunction, Request, Response } from "express";
import app from "./src/app";
import { config } from "./src/config/configuration";
import { connectToDB } from "./src/config/db";
import createHttpError from "http-errors";
const startServer = async() => {
    await connectToDB()
    const port = parseInt(config.PORT)
    app.listen(port, () => {
        console.log(`Listening at Port : ${port}`);
    });
    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.json({ message: "Welcome to the page." });
    });
}
startServer();
