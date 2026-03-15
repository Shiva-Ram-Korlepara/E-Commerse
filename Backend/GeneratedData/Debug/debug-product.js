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

async function testProductCreation() {
  // Get seller token
  const sellers = await read("sellers");
  const seller = sellers[0]; // Ivory_Bergnaum@hotmail.com
  
  console.log('Logging in seller:', seller.email);
  
  const loginRes = await instance.post("/seller/signin", { 
    email: seller.email, 
    password: seller.password 
  });
  
  const sellerToken = loginRes.data?.token;
  if (!sellerToken) {
    console.error('No seller token received');
    return;
  }
  
  console.log('✓ Seller logged in successfully');
  
  // Get product data
  const products = await read("products");
  const product = products.find(p => p.sellerEmail === seller.email);
  
  if (!product) {
    console.error('No product found for seller:', seller.email);
    return;
  }
  
  console.log('\nProduct data from JSON:');
  console.log(JSON.stringify(product, null, 2));
  
  // Transform product data like the seeder does
  const productData = { ...product };
  
  // Remove fields that conflict with the model
  delete productData.category;      // Remove string category
  delete productData.sellerEmail;   // Remove sellerEmail (sellerId is added by controller)
  
  // Use categoryIds as category
  if (productData.categoryIds && productData.categoryIds.length > 0) {
    productData.category = productData.categoryIds;
  }
  delete productData.categoryIds;   // Remove categoryIds
  
  console.log('\nTransformed product data:');
  console.log(JSON.stringify(productData, null, 2));
  
  // Test product creation
  console.log('\nTesting product creation...');
  
  try {
    const res = await instance.post("/seller/products", productData, {
      headers: { Authorization: `Bearer ${sellerToken}` }
    });
    console.log('✓ Product created successfully');
    console.log('Response:', res.data);
  } catch (err) {
    console.log('✗ Product creation failed');
    console.log('Status:', err.response?.status);
    console.log('Error data:', err.response?.data);
  }
}

testProductCreation();
