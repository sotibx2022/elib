import {Request,Response,NextFunction} from 'express';
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req.files:', req.files); // Log the entire req.files object
    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };
    if (files.file) {
        console.log('File:', files.file[0]); // Log the 'file' upload
    } else {
        console.log('No file field found');
    }
    if (files.coverImage) {
        console.log('Cover Image:', files.coverImage[0]); // Log the 'coverImage' upload
    } else {
        console.log('No coverImage field found');
    }
    res.send("Files received");
};
