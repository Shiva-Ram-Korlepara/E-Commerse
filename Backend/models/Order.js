import mongoose from "mongoose";
import addressSchema from "./Address.js";

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    amount: { type: Number, required: true },
    location: { type: addressSchema, required: true }
});

export default mongoose.model("Order", orderSchema);