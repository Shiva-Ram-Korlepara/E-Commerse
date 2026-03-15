import mongoose from "mongoose";
import addressSchema from "./Address.js";

const productSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    sellerName: { type: String, required: true },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    description: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: addressSchema, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

export default mongoose.model("Product", productSchema);