import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'path';
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req.body:', req.body); // Log all text fields (title, author, genre)
    console.log('req.files:', req.files); // Log the entire req.files object to see both pdf and coverImage
    const { title, author, genre } = req.body;
    if (!title || !author || !genre) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };
    // Handling the 'pdf' field
    if (files?.pdf?.length > 0) {
        console.log('PDF:', files.pdf[0]); // Log the 'pdf' upload
        const pdfFileName = files.pdf[0].filename;
        const pdfFilePath = path.resolve(__dirname, "../../public/assets/uploads", pdfFileName);
        try {
            const uploadResult = await cloudinary.uploader.upload(pdfFilePath, {
                resource_type: "raw",
                filename_override: pdfFileName,
                folder: "bookPdfs",
                format: "pdf",
            });
            console.log('PDF Upload Result:', uploadResult);
        } catch (error) {
            console.log('Error uploading PDF:', error);
        }
    } else {
        console.log('No pdf field found');
    }
    // Handling the 'coverImage' field
    if (files?.coverImage?.length > 0) {
        console.log('Cover Image:', files.coverImage[0]); // Log the 'coverImage' upload
        const coverImageFileName = files.coverImage[0].filename;
        const coverImageFilePath = path.resolve(__dirname, "../../public/assets/uploads", coverImageFileName);
        try {
            const uploadResult = await cloudinary.uploader.upload(coverImageFilePath, {
                filename_override: coverImageFileName,
                folder: "coverImages",
                format: files.coverImage[0].mimetype.split('/')[1]  // Correctly setting the image format
            });
            console.log('Cover Image Upload Result:', uploadResult);
        } catch (error) {
            console.log('Error uploading cover image:', error);
        }
    } else {
        console.log('No coverImage field found');
    }
    res.send("Files and data received");
};
