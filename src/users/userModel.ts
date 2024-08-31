import mongoose, { Document, Schema, Model } from "mongoose";
// Define the interface for the document
interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
}
// Define the schema
const UserSchema: Schema<UserDocument> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// Define the model, ensuring type safety
export const Users: Model<UserDocument> = mongoose.models.User as Model<UserDocument> || mongoose.model<UserDocument>("User", UserSchema);
