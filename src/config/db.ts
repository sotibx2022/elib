import mongoose from "mongoose"
import { config } from "./configuration"
export  const connectToDB = async() =>{
    try {
        mongoose.connection.on('connected',(()=>{
            console.log("MongoDB already Connected")
        }))
        mongoose.connection.on('error',((error)=>{
            console.log("Error While Connecting to the DB",error)
        }))
        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB Disconnected");
        });
        await mongoose.connect(config.CONNECTION_STRING!) 
    } catch (error) {
        console.log("Couldnot connect to the DB", error);
        process.exit(1);
    }
}