import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set in the server environment.");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection failed.");

        if (error.name === "MongooseServerSelectionError") {
            console.error(
                "Atlas could not be reached. Add your current IP in MongoDB Atlas > Network Access, or allow 0.0.0.0/0 for local development."
            );
        } else {
            console.error(error.message);
        }

        throw error;
    }
};

export default connectDB;