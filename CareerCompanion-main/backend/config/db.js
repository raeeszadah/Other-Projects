import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB CONNECTED");
  } catch (e) {
    console.error("DB ERROR", e);
    process.exit(1);
  }
};

export default connectDb;
