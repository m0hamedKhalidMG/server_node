import mongoose from "mongoose";

const Token = new mongoose.Schema({
  userId: { type: String },
  createdAt: { type: Date },
  device: { type: String }
});


export default mongoose.model('TokenModel', Token)