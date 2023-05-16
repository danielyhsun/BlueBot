import { connect } from "mongoose";

const uri = process.env.MONGO_URI;

export const connectDatabase = async () => {
  await connect(uri as string);
  console.log("Database Connected!");
};
