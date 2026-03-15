// test-api.js - Quick test of API endpoints
import axios from "axios";

const API = "http://localhost:3000/api";
const instance = axios.create({ baseURL: API, timeout: 10000 });

async function testAPI() {
  console.log("Testing API endpoints...");

  // Test admin signup
  try {
    const adminRes = await instance.post("/admin/signup", {
      userName: "Test Admin",
      email: "admin@test.com",
      password: "test123"
    });
    console.log("✅ Admin signup:", adminRes.status);
  } catch (err) {
    console.log("❌ Admin signup error:", err.response?.status, err.response?.data?.message);
  }

  // Test admin login
  try {
    const loginRes = await instance.post("/admin/signin", {
      email: "admin@test.com", 
      password: "test123"
    });
    console.log("✅ Admin login:", loginRes.status, "Token:", !!loginRes.data?.token);
    
    if (loginRes.data?.token) {
      // Test category creation
      try {
        const catRes = await instance.post("/admin/categories", {
          name: "Test Category",
          description: "A test category",
          type: "electronics"
        }, {
          headers: { Authorization: `Bearer ${loginRes.data.token}` }
        });
        console.log("✅ Category creation:", catRes.status);
      } catch (err) {
        console.log("❌ Category creation error:", err.response?.status, err.response?.data?.message);
      }
    }
  } catch (err) {
    console.log("❌ Admin login error:", err.response?.status, err.response?.data?.message);
  }

  // Test seller signup
  try {
    const sellerRes = await instance.post("/seller/signup", {
      userName: "Test Seller",
      email: "seller@test.com",
      password: "test123",
      phone: "1234567890"
    });
    console.log("✅ Seller signup:", sellerRes.status);
  } catch (err) {
    console.log("❌ Seller signup error:", err.response?.status, err.response?.data?.message);
  }

  // Test customer signup
  try {
    const customerRes = await instance.post("/customer/signup", {
      userName: "Test Customer",
      email: "customer@test.com", 
      password: "test123",
      phone: "1234567890"
    });
    console.log("✅ Customer signup:", customerRes.status);
  } catch (err) {
    console.log("❌ Customer signup error:", err.response?.status, err.response?.data?.message);
  }
}

testAPI().catch(console.error);
