import Seller from "../models/Seller.js";
import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import bcrypt from "bcrypt";

export const viewReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productID: req.params.productId });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        let user = await Seller.findById(req.userId);
        if (!user) user = await Customer.findById(req.userId);
        if (!user) user = await Admin.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        let user = await Seller.findByIdAndUpdate(req.userId, req.body, { new: true });
        if (!user) user = await Customer.findByIdAndUpdate(req.userId, req.body, { new: true });
        if (!user) user = await Admin.findByIdAndUpdate(req.userId, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Update User Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        let user = await Seller.findById(req.userId).select('-password');
        if (!user) user = await Customer.findById(req.userId).select('-password');
        if (!user) user = await Admin.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const viewProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { category, name, minPrice, maxPrice } = req.query;
        const filter = {};

        if (category) {
            if (Array.isArray(category)) {
                filter.category = { $in: category };
            } else {
                filter.category = category;
            }
        }
        if (name) filter.name = { $regex: name, $options: "i" };
        if (minPrice || maxPrice) filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);

        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}