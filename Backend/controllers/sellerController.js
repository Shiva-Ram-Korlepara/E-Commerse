import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createSeller = async (req, res) => {
    try {

        if (!req.body.userName || !req.body.phone || !req.body.businessName || !req.body.email || !req.body.businessAddress || !req.body.password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingSeller = await Seller.findOne({ email: req.body.email });
        if (existingSeller)
            return res.status(409).json({ message: "Email already in use." });

        const newSeller = new Seller({ userName: req.body.userName, phone: req.body.phone, businessName: req.body.businessName, email: req.body.email, businessAddress: req.body.businessAddress, password: await bcrypt.hash(req.body.password, 10) });
        await newSeller.save();
        const token = jwt.sign({ id: newSeller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "Seller created successfully.", token: token });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getSellerOrders = async(req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.userId }, {"location.street": 0, "location.flatNo": 0, "location.zipCode": 0}).populate("productId", "name price image");
        res.status(200).json(orders);
    }catch (error) {
         res.status(500).json({ message: error.message });
    }
}

export const getSellerProducts = async(req, res) => {
    try {
        const products = await Product.find({ sellerId: req.userId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async(req, res) => {
    try {
        if (!req.body.description || !req.body.name || !req.body.image || !req.body.stock || !req.body.price || !req.body.location) {
            return res.status(400).json({ message: "All product fields are required." });
        }

        const seller = await Seller.findById(req.userId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found." });
        }

        let product = new Product({ ...req.body, sellerId: req.userId, sellerName: seller.businessName });
        if (req.body.category && Array.isArray(req.body.category)) {
            product.category = req.body.category;
        }
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.productId, sellerId: req.userId },
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found or you do not have permission to update it." });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.productId, sellerId: req.userId });
        if (!product) {
            return res.status(404).json({ message: "Product not found or you do not have permission to delete it." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}