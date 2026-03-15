import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/customer', customerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});