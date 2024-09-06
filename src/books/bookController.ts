import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { uploadFile } from '../helper/upload';
import { Books } from './bookModel';
interface AuthRequest extends Request {
    userId: string;
}
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;
    const { title, author, genre } = req.body;
    if (!title || !author || !genre) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };
    try {
        let imageUrl: string = "";
        let pdfUrl: string = "";
        // Handling the 'pdf' field
        if (files?.pdf?.length > 0) {
            pdfUrl = await uploadFile(files.pdf[0], "bookPdfs", "pdf");
        } else {
            return next(createHttpError(400, "No PDF file found"));
        }
        // Handling the 'coverImage' field
        if (files?.coverImage?.length > 0) {
            imageUrl = await uploadFile(files.coverImage[0], "coverImages", "any");
        } else {
            return next(createHttpError(400, "No cover image found"));
        }
        // Create a new book entry in the database
        const newBook = await Books.create({
            title,
            author: _req.userId,
            genre,
            coverImage: imageUrl,
            file: pdfUrl
        });
        res.status(201).json(newBook); // Send back the created book entry
    } catch (error) {
        next(createHttpError(500, `Error creating book`));
    }
};
