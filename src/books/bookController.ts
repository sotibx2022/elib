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
export const listAllBooks = async (req:Request, res:Response, next:NextFunction) =>{
try {
    const allBooks = await Books.find();
    return res.json({status:200, message:"Books Found Successfully", allBooks})
} catch (error) {
    return next(createHttpError('400',"Error to Fetch Books"))
}
}
export const getSingleBook = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const bookId = req.params.bookId;
    const singleBook = await Books.find({_id:bookId});
    if(!singleBook){
        return next(createHttpError(400,"Book Not found."))
    }
    return res.json({status:200, message:"Single Books Found", singleBook})
    } catch (error) {
       return next(createHttpError(400,'Error to fetch Data')) 
    }
}
export const deleteSingleBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    try {
      // Find the book by ID
      const singleBook = await Books.findById(bookId);
      // If book is not found, return an error
      if (!singleBook) {
        return next(createHttpError(400, "Book to delete not found"));
      }
      const _req = req as AuthRequest;
      // Check if the user is authorized to delete the book
      if (_req.userId !== singleBook.author.toString()) {
        return next(createHttpError(403, "You are not authorized to delete this book"));
      }
      // Delete the cover image from Cloudinary
      try {
        let imagePublicPath = generatePublicPath(singleBook.coverImage);
        if(imagePublicPath){
            await cloudinary.uploader.destroy(imagePublicPath);
        }
      } catch (error) {
        return next(createHttpError(500, "Error deleting Cloudinary cover image"));
      }
      // Delete the PDF file from Cloudinary
      try {
        let pdfPublicPath = generatePublicPath(singleBook.file);
        if(pdfPublicPath){
            await cloudinary.uploader.destroy(pdfPublicPath);
        }
      } catch (error) {
        return next(createHttpError(500, "Error deleting Cloudinary file"));
      }
      // Delete the book from the database
      try {
        await singleBook.deleteOne(); // Use `deleteOne` instead of `delete` (better semantic)
      } catch (error) {
        return next(createHttpError(500, "Error deleting book from the database"));
      }
      // Respond with a success message
      return res.json({ message: "Book deleted successfully", status: 200, success: true });
    } catch (error) {
      // Handle any unexpected errors
      return next(createHttpError(500, "Internal server error"));
    }
  };