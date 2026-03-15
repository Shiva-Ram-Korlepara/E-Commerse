import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    flatNo: { type: String, required: true },
    zipCode: { type: String, required: true },
});

export default addressSchema;