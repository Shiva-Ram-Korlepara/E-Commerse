import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    userName: { type: String, required: true },
    rating: { type: String, enum: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"], required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);