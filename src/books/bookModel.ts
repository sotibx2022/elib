import mongoose, { Document, Schema } from "mongoose";
export interface BookDocument extends Document {
    title: string;
    author:string;
    user: mongoose.Types.ObjectId; // Reference to the Users model
    genre: string; // Corrected spelling,
    description:string,
    coverImage: string;
    file: string;
}
const bookSchema = new Schema<BookDocument>({
    title: {
        type: String,
        required: true
    },
    author:{
        type:String,
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the Users model
        required: true,
    },
    genre: { // Corrected spelling
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true,
    },
    coverImage: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }
}, { timestamps: true });
export const Books = mongoose.models.Books || mongoose.model<BookDocument>("Books", bookSchema);
