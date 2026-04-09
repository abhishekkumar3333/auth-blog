import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error, "mongodb connection failsss");
        process.exit(1);
    }
}

export default connectDb;