import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

export const createCustomer = async (req, res) => {
  try {
    const { userName, email, password, phone, address } = req.body || {};

    if (!userName || !email || !password || !phone) {
      return res.status(400).json({ 
        message: "All fields are required (userName, email, password, phone)." 
      });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newCustomer = new Customer({ 
      userName, 
      email, 
      phone, 
      password: await bcrypt.hash(password, 10), 
      address: address || []
    });

    await newCustomer.save();
    const token = jwt.sign({ id: newCustomer._id, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Customer created successfully.", token: token });
  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOrder = async (req, res) => {
    try {
        if (!req.body.productId || !req.body.quantity || !req.body.location) {
            return res.status(400).json({ message: "All order fields are required." });
        }

        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        if (product.stock < req.body.quantity) {
            return res.status(400).json({ message: "Insufficient stock available." });
        }

        product.stock -= req.body.quantity;
        await product.save();

        const order = new Order({ ...req.body, customerId: req.userId, price: product.price, amount: product.price * req.body.quantity, sellerId: product.sellerId });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.userId }).populate('productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body || {};
        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "All review fields are required." });
        }

        const customer = await Customer.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const review = new Review({ productID: productId, customerID: req.userId, userName: customer.userName, rating, comment });
        product.reviews.push(review._id);
        await review.save();
        await product.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}