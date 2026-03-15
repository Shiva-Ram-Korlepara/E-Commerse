import mongoose from "mongoose";
import addressSchema from "./Address.js";

const customerSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, default: "customer" },
    email: { type: String, required: true, unique: true },
    address: { type: [addressSchema], default: [], required: false },
    password: { type: String, required: true }
});

export default mongoose.model("Customer", customerSchema);