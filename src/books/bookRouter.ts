import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { createBook } from "./bookController";
const bookRouter = Router();
const upload = multer({
    dest: path.join(__dirname, '../../public/assets/uploads'),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});
bookRouter.post("/", upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), createBook);
export default bookRouter;