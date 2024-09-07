import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { createBook, listAllBooks, updateBook } from "./bookController";
import { authentication } from "../middleware/authenticate";
const bookRouter = Router();
const upload = multer({
    dest: path.join(__dirname, '../../public/assets/uploads'),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});
bookRouter.post("/",authentication, upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), createBook);
bookRouter.put("/:bookId",authentication, upload.fields([
    {name:'pdf',maxCount:1},
    {name:'coverImage', maxCount:1}
]),updateBook);
bookRouter.get("/lists",listAllBooks)
export default bookRouter;