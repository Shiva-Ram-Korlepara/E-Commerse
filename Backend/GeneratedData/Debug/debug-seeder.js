import fs from "fs-extra";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DATA_DIR = "./GeneratedData/data";
const API = process.env.API_BASE_URL || "http://localhost:3000/api";

const read = (file) => fs.readJSON(`${DATA_DIR}/${file}.json`);

// helper: make axios instance
const instance = axios.create({
  baseURL: API,
  timeout: 20000
});

async function testSingleAdmin() {
  const admins = await read("admins");
  const admin = admins[0];
  
  console.log('Testing admin:', admin);
  console.log('API base URL:', API);
  
  try {
    console.log('Making signup request...');
    const signupRes = await instance.post("/admin/signup", admin).catch(e => {
      console.log('Signup error caught:');
      console.log('Status:', e.response?.status);
      console.log('Data:', e.response?.data);
      return e.response || e;
    });
    
    console.log('Signup result:');
    console.log('Status:', signupRes?.status);
    console.log('Data:', signupRes?.data);
    
    if (signupRes && signupRes.status >= 200 && signupRes.status < 300) {
      console.log("✓ Admin created successfully");
    } else {
      console.log("✗ Admin signup returned status", signupRes?.status);
    }
    
    console.log('\nMaking signin request...');
    const loginRes = await instance.post("/admin/signin", { 
      email: admin.email, 
      password: admin.password 
    }).catch(e => {
      console.log('Login error caught:');
      console.log('Status:', e.response?.status);
      console.log('Data:', e.response?.data);
      return e.response || e;
    });
    
    console.log('Login result:');
    console.log('Status:', loginRes?.status);
    console.log('Data:', loginRes?.data);
    
    const token = loginRes?.data?.token;
    if (token) {
      console.log("✓ Admin logged in successfully");
      console.log("Token:", token.substring(0, 20) + "...");
    } else {
      console.log("✗ Admin login returned no token. Status:", loginRes?.status);
    }
    
  } catch (err) {
    console.error("Unexpected error:", err.message);
  }
}

testSingleAdmin();
