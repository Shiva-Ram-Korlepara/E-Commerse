import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'admin' },
    password: { type: String, required: true }
});

export default mongoose.model('Admin', adminSchema);