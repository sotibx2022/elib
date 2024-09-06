import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { uploadFile } from '../helper/upload';
import { BookDocument, Books } from './bookModel';
import { generatePublicPath } from '../helper/generatePublicPath';
import cloudinary from '../config/cloudinary';
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
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const { title, genre } = req.body;
        // Initialize with existing values
        let pdfUrl: string | undefined = undefined;
        let imageUrl: string | undefined = undefined;
        // Handle file uploads if present
        const files = req.files as { [fieldName: string]: Express.Multer.File[] };
        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (files.pdf && files.pdf.length > 0) {
            pdfUrl = await uploadFile(files.pdf[0], "bookPdfs", "pdf");
            const filePublicPath = generatePublicPath(book.file);
            if (filePublicPath) {
                try {
                    const result = await cloudinary.uploader.destroy(filePublicPath, {
                        resource_type: 'raw' 
                    });
                    console.log('File deletion result:', result);
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
            }
        }
        if (files.coverImage && files.coverImage.length > 0) {
            imageUrl = await uploadFile(files.coverImage[0], "coverImages", "any");
            const imagePublicPath = generatePublicPath(book.coverImage);
            console.log(imagePublicPath);
            if(imagePublicPath){
                try {
                    const result = await cloudinary.uploader.destroy(imagePublicPath);  
                } catch (error) {
                    if (error instanceof Error) {
                        console.error(error.message);
                    } else {
                        console.error("Unknown error occurred while deleting the file");
                    }
                }
            }
        }
        // Fetch existing book details
        const _req = req as AuthRequest;
const userId = _req.userId;
if(userId !== book.author.toString()){
    return next(createHttpError('401',"User Not autorized"))
}
        // Update the book with the new or existing values
        const updatedBook = await Books.findOneAndUpdate(
            { _id: bookId },
            {
                title,
                genre,
                coverImage: imageUrl || book.coverImage,
                file: pdfUrl || book.file
            },
            { new: true }
        );
        res.status(200).json(updatedBook);
    } catch (error) {
        next(error);
    }
};