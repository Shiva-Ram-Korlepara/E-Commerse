// seeder.js
import fs from "fs-extra";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DATA_DIR = "./GeneratedData/data";
const API = process.env.API_BASE_URL || "http://localhost:3000/api";

const read = (file) => fs.readJSON(`${DATA_DIR}/${file}.json`);
const write = (file, obj) => fs.writeJSON(`${DATA_DIR}/${file}.json`, obj, { spaces: 2 });

// helper: make axios instance
const instance = axios.create({
  baseURL: API,
  timeout: 20000
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  // load data
  const admins = await read("admins");
  const categories = await read("categories");
  const sellers = await read("sellers");
  const customers = await read("customers");
  const products = await read("products");
  const orders = await read("orders");

  // 1) Create admins and login to get tokens
  console.log("Creating admins...");
  const adminTokens = [];

  for (const admin of admins) {
    try {
      const signupRes = await instance.post("/admin/signup", admin).catch(e => e.response || e);
      // if signup exists already maybe 409, attempt signin
      if (signupRes && signupRes.status >= 200 && signupRes.status < 300) {
        console.log("Admin created:", signupRes.data.admin?.email || admin.email);
      } else {
        console.log("Admin signup returned status", signupRes?.status);
      }
    } catch (err) {
      console.error("Admin signup error:", err?.response?.data || err.message);
    }
  }

  // login admins and keep first token as super-admin
  for (const admin of admins) {
    try {
      const loginRes = await instance.post("/admin/signin", { email: admin.email, password: admin.password })
        .catch(e => e.response || e);
      
      const token = loginRes?.data?.token;
      if (token) {
        adminTokens.push(token);
        console.log("Admin logged in:", admin.email);
      } else {
        console.warn("Admin login returned no token for", admin.email, "Status:", loginRes?.status);
      }
    } catch (err) {
      console.error("Admin login error:", err?.response?.data || err.message);
    }
    await sleep(200);
  }

  const adminAuthHeader = adminTokens[0] ? { Authorization: `Bearer ${adminTokens[0]}` } : {};

  // 2) Create categories using admin token
  console.log("Creating categories...");
  const createdCategories = [];
  for (const cat of categories) {
    try {
      const res = await instance.post("/admin/categories", cat, { headers: adminAuthHeader }).catch(e => e.response || e);
      if (res && res.data && res.status >= 200 && res.status < 300) {
        createdCategories.push(res.data);
        console.log("Category created:", cat.name);
      } else {
        console.warn("Category creation failed for", cat.name, "Status:", res?.status);
        // fallback: maybe endpoint returned created category in body
        createdCategories.push(cat);
      }
    } catch (err) {
      console.error("Category creation error:", err?.response?.data || err.message);
    }
    await sleep(100);
  }
  // gather ids
  const categoryIds = createdCategories.map(c => c._id || c.id || c.categoryId).filter(Boolean);
  console.log("Created categories:", categoryIds.length);

  // 3) Create sellers and login them (capture tokens)
  console.log("Creating sellers...");
  const sellerMap = []; // { email, token, id }
  for (const seller of sellers) {
    try {
      const res = await instance.post("/seller/signup", seller).catch(e => e.response || e);
      if (res && res.status >= 200 && res.status < 300) console.log("Seller signup ok:", seller.email);
    } catch (err) {
      console.error("Seller signup error:", err?.response?.data || err.message);
    }

    // login seller
    await sleep(100);
    try {
      const loginRes = await instance.post("/seller/signin", { email: seller.email, password: seller.password }).catch(e => e.response || e);
      
      const token = loginRes?.data?.token;
      const id = loginRes?.data?.user?.id || loginRes?.data?.userId || null;
      if (token) {
        sellerMap.push({ email: seller.email, token, id });
        console.log("Seller logged in:", seller.email);
      } else {
        console.warn("Seller login returned no token for", seller.email, "Status:", loginRes?.status);
        sellerMap.push({ email: seller.email, token: null, id: null });
      }
    } catch (err) {
      console.error("Seller login error:", err?.response?.data || err.message);
      sellerMap.push({ email: seller.email, token: null, id: null });
    }
  }

  // 4) Create products using seller tokens
  console.log("Creating products...");
  const createdProducts = [];
  // assign each product to a random seller
  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const seller = sellerMap[i % sellerMap.length]; // rotate sellers
    if (!seller?.token) {
      console.warn("No token for seller", seller?.email, "skipping product", prod.name);
      continue;
    }

    // choose random categories (1-2) - only if categories exist
    const catCount = categoryIds.length > 0 ? (Math.random() < 0.3 ? Math.min(2, categoryIds.length) : 1) : 0;
    const cats = [];
    for (let k = 0; k < catCount; k++) {
      const pick = categoryIds[Math.floor(Math.random() * categoryIds.length)];
      if (pick && !cats.includes(pick)) cats.push(pick);
    }
    
    // Prepare product data for API
    const productData = { ...prod };
    
    // Remove fields that conflict with the model
    delete productData.category;      // Remove string category
    delete productData.sellerEmail;   // Remove sellerEmail (sellerId is added by controller)
    delete productData.categoryIds;   // Remove categoryIds (we'll use category instead)
    
    // Set category as array of ObjectIds
    if (cats.length > 0) {
      productData.category = cats;
    }

    try {
      const res = await instance.post("/seller/products", productData, {
        headers: { Authorization: `Bearer ${seller.token}` },
      }).catch(e => e.response || e);
      if (res && res.data && res.status >= 200 && res.status < 300) {
        createdProducts.push(res.data);
        // write returned id back to products array
        products[i].productId = res.data._id || res.data.id || null;
        console.log("Product created:", prod.name, "by", seller.email);
      } else {
        console.warn("Create product failed for", prod.name, "Status:", res?.status);
      }
    } catch (err) {
      console.error("Product creation error:", err?.response?.data || err.message);
    }
    await sleep(80);
  }

  // save updated products file with productId
  await write("products", products);
  console.log("Products created:", createdProducts.length);

  // 5) Create customers and login them
  console.log("Creating customers...");
  const customerMap = [];
  for (const customer of customers) {
    try {
      const res = await instance.post("/customer/signup", customer).catch(e => e.response || e);
      if (res && res.status >= 200 && res.status < 300) console.log("Customer created:", customer.email);
    } catch (err) {
      console.error("Customer signup error:", err?.response?.data || err.message);
    }
    await sleep(50);

    // login
    try {
      const loginRes = await instance.post("/customer/signin", { email: customer.email, password: customer.password }).catch(e=>e.response||e);
      
      const token = loginRes?.data?.token;
      const id = loginRes?.data?.user?.id || null;
      if (token) {
        customerMap.push({ email: customer.email, token, id });
        console.log("Customer logged in:", customer.email);
      } else {
        console.warn("Customer login returned no token for", customer.email, "Status:", loginRes?.status);
        customerMap.push({ email: customer.email, token: null, id: null });
      }
    } catch (err) {
      console.error("Customer login error:", err?.response?.data || err.message);
      customerMap.push({ email: customer.email, token: null, id: null });
    }
  }

  // 6) Create orders using customer tokens: map order.productIndex to actual productId
  console.log("Creating orders...");
  for (let i = 0; i < orders.length; i++) {
    const ord = orders[i];
    const productIndex = ord.productIndex ?? i % products.length; // Use i as fallback if productIndex is undefined
    const product = products[productIndex];
    if (!product || !product.productId) {
      console.warn("No productId for productIndex", productIndex, "skipping order");
      continue;
    }

    // pick random customer
    const customer = customerMap[i % customerMap.length];
    if (!customer?.token) {
      console.warn("No token for customer", customer?.email, "skipping order");
      continue;
    }

    // build order payload expected by your API
    const payload = {
      productId: product.productId,
      quantity: ord.quantity || 1,
      location: ord.location || "Default Location",
      price: product.price || 100, // Add price if missing
    };

    try {
      const res = await instance.post("/customer/orders", payload, {
        headers: { Authorization: `Bearer ${customer.token}` },
      }).catch(e => e.response || e);

      if (res && (res.status >= 200 && res.status < 300)) {
        orders[i].order_id = res.data._id || res.data.id || null;
        console.log("Order created for product", product.name, "by", customer.email);
      } else {
        console.warn("Order creation returned", res?.status, res?.data);
      }
    } catch (err) {
      console.error("Order creation error:", err?.response?.data || err.message);
    }
    await sleep(100);
  }

  // write back orders file
  await write("orders", orders);

  console.log("Seeding finished successfully.");
}

run().catch((err) => {
  console.error("Seeder failed:", err);
  process.exit(1);
});