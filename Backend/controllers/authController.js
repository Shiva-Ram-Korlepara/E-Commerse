import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import Seller from "../models/Seller.js";
import Admin from "../models/Admin.js";

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: customer._id, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Customer Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Seller Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};