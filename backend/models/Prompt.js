import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String },
  models: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  upvotes: { type: Number, default: 0 },
  views: { type: Number, default: 0},
  createdAt: { type: Date, default: Date.now },
  username: {type: String },
});


export default mongoose.model('Prompt', promptSchema);
