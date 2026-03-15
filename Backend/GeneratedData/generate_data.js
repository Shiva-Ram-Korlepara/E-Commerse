import { faker } from '@faker-js/faker';
import fs from 'fs';

const DATA_DIR = './generateddata/data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ✅ Helper: random ID generator
const randomId = () => faker.string.uuid();

// ✅ Categories (20)
const generateCategories = () => {
  return Array.from({ length: 20 }).map(() => ({
    name: faker.commerce.department() + faker.number.int({ min: 1, max: 99 }),
    type: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
  }));
};

// ✅ Admins (3)
const generateAdmins = () => {
  return Array.from({ length: 3 }).map(() => ({
    userName: faker.person.firstName(),
    email: faker.internet.email(),
    password: 'password',
  }));
};

// ✅ Customers (100)
const generateCustomers = () => {
  return Array.from({ length: 100 }).map(() => ({
    userName: faker.person.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password: 'password',
    address: [
      {
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.street(),
        flatNo: faker.number.int({ min: 1, max: 500 }).toString(),
        zipCode: faker.location.zipCode(),
      },
    ],
  }));
};

// ✅ Sellers (20)
const generateSellers = () => {
  return Array.from({ length: 20 }).map(() => ({
    userName: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    businessName: faker.company.name(),
    businessAddress: {
      country: faker.location.country(),
      state: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.street(),
      flatNo: faker.number.int({ min: 1, max: 500 }).toString(),
      zipCode: faker.location.zipCode(),
    },
    password: 'password',
  }));
};

// ✅ Products (200)
const generateProducts = (categories, sellers) => {
  return Array.from({ length: 200 }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.urlPicsumPhotos(),
    stock: faker.number.int({ min: 10, max: 200 }),
    price: faker.number.int({ min: 50, max: 2000 }),
    location: {
      country: faker.location.country(),
      state: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.street(),
      flatNo: faker.number.int({ min: 1, max: 500 }).toString(),
      zipCode: faker.location.zipCode(),
    },
    category: faker.helpers.arrayElement(categories).name,
    sellerEmail: faker.helpers.arrayElement(sellers).email,
  }));
};

// ✅ Orders (30)
const generateOrders = (customers, products) => {
  return Array.from({ length: 30 }).map(() => ({
    productId: faker.helpers.arrayElement(products).name,
    quantity: faker.number.int({ min: 1, max: 5 }),
    location: {
      country: faker.location.country(),
      state: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.street(),
      flatNo: faker.number.int({ min: 1, max: 500 }).toString(),
      zipCode: faker.location.zipCode(),
    },
    customerEmail: faker.helpers.arrayElement(customers).email,
  }));
};

// ✅ Generate all data
const categories = generateCategories();
const admins = generateAdmins();
const customers = generateCustomers();
const sellers = generateSellers();
const products = generateProducts(categories, sellers);
const orders = generateOrders(customers, products);

// ✅ Write to JSON files
fs.writeFileSync(`${DATA_DIR}/categories.json`, JSON.stringify(categories, null, 2));
fs.writeFileSync(`${DATA_DIR}/admins.json`, JSON.stringify(admins, null, 2));
fs.writeFileSync(`${DATA_DIR}/customers.json`, JSON.stringify(customers, null, 2));
fs.writeFileSync(`${DATA_DIR}/sellers.json`, JSON.stringify(sellers, null, 2));
fs.writeFileSync(`${DATA_DIR}/products.json`, JSON.stringify(products, null, 2));
fs.writeFileSync(`${DATA_DIR}/orders.json`, JSON.stringify(orders, null, 2));

console.log('✅ All mock data generated successfully!');