import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // store Clerk ID here
  email: String,
  fullName: String,
  imageUrl: String,
  username: { type: String, unique: true },
});

const User = mongoose.model("User", userSchema);
export default User;
