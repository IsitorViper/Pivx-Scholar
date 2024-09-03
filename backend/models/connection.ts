import mongoose from "mongoose";

export default async function connectDB() {
  console.log("Connecting to database...");
  console.log(process.env.MONGO_URL);
  await mongoose.connect("mongodb+srv://mohamedasjadh:isRGsSkywprrZZU0@cluster0.ynapdyc.mongodb.net/", {});
  console.log("Connected to MongoDB");
}
