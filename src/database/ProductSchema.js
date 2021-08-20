import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema({
	productId: mongoose.ObjectId,
	name: String,
  image: String,
	description: String,
  category: String,
  oldPrice: String,
  price: String,
	completedAt: { type: Date, required: false },
});


export default mongoose.model("Product", schema);