import fs from "fs-extra";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DATA_DIR = "./GeneratedData/data";
const API = process.env.API_BASE_URL || "http://localhost:3000/api";

const read = (file) => fs.readJSON(`${DATA_DIR}/${file}.json`);

const instance = axios.create({
  baseURL: API,
  timeout: 20000
});

async function testAdminFlow() {
  const admins = await read("admins");
  const adminTokens = [];
  
  console.log('Testing admin login flow...');
  
  // Login one admin to get token
  const admin = admins[0];
  console.log('Logging in admin:', admin.email);
  
  try {
    const loginRes = await instance.post("/admin/signin", { 
      email: admin.email, 
      password: admin.password 
    });
    
    console.log('Login response:');
    console.log('Status:', loginRes.status);
    console.log('Data:', loginRes.data);
    
    const token = loginRes.data?.token;
    if (token) {
      adminTokens.push(token);
      console.log("✓ Admin logged in successfully");
      console.log("Token (first 50 chars):", token.substring(0, 50) + "...");
    } else {
      console.log("✗ No token in login response");
      return;
    }
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    return;
  }
  
  // Test category creation
  const adminAuthHeader = adminTokens[0] ? { Authorization: `Bearer ${adminTokens[0]}` } : {};
  console.log('\nAuth header:', adminAuthHeader);
  
  const categories = await read("categories");
  const testCategory = categories[0];
  
  console.log('\nTesting category creation...');
  console.log('Category data:', testCategory);
  
  try {
    const res = await instance.post("/admin/categories", testCategory, { headers: adminAuthHeader });
    console.log('✓ Category created successfully');
    console.log('Response:', res.data);
  } catch (err) {
    console.log('✗ Category creation failed');
    console.log('Status:', err.response?.status);
    console.log('Data:', err.response?.data);
    console.log('Headers sent:', err.config?.headers);
  }
}

testAdminFlow();
