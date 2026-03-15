import mongoose from "mongoose";
import addressSchema from "./Address.js";

const sellerSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, default: "seller" },
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    businessAddress: { type: addressSchema, required: true },
    password: { type: String, required: true }
});

export default mongoose.model("Seller", sellerSchema);