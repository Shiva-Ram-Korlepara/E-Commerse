import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Category from "../models/Category.js";
import Customer from "../models/Customer.js";
import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import Admin from "../models/Admin.js";

export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body || {};

    if (!userName || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required (userName, email, password)." 
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newAdmin = new Admin({ 
      userName, 
      email, 
      password: await bcrypt.hash(password, 10)
    });

    await newAdmin.save();
    const token = jwt.sign({ id: newAdmin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Admin created successfully.", token: token });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCategory = async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.type) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const viewAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().select('-password');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const viewAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password');
        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const viewAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('productId').populate('customerId').populate('sellerId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
