import { connect } from "mongoose";

const uri = process.env.MONGO_URI as string;

export const connectDatabase = async () => {
    await connect(uri);
    console.log("Database Connected!");
}