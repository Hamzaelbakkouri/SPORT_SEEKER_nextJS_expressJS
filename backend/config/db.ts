import mongoose from "mongoose";

const connectDB = async () => {
    const { MONGO_URI } = process.env
    try {
        mongoose.set('strictQuery', true);
        // @ts-ignore
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;