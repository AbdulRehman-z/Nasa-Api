import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

export const mongoConnect = async () =>
  await mongoose.connect(process.env.MONGO_URL);
export const mongodisconnect = async () => await mongoose.disconnect();
