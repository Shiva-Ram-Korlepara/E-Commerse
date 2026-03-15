import express from 'express';

import { 
    createCategory,
    updateCategory,
    viewAllCustomers,
    viewAllSellers,
    viewAllOrders,
    createAdmin
} from '../controllers/adminController.js';

import {
    viewReviews,
    updatePassword,
    updateProfile,
    getProfile,
    viewProduct,
    getCategories,
    updateOrder,
    getProducts
} from '../controllers/publicController.js';

import { roleAuth } from '../middlewares/roleMiddleware.js';
import { loginAdmin } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createAdmin);
router.post('/signin', loginAdmin);

router.post('/categories', authMiddleware, roleAuth('admin'), createCategory);
router.put('/categories/:categoryId', authMiddleware, roleAuth('admin'), updateCategory);

router.get('/customers', authMiddleware, roleAuth('admin'), viewAllCustomers);
router.get('/sellers', authMiddleware, roleAuth('admin'), viewAllSellers);
router.get('/orders', authMiddleware, viewAllOrders);

router.get('/products/:productId', authMiddleware, viewProduct);
router.get('/categories', authMiddleware, getCategories);
router.get('/reviews', authMiddleware, viewReviews);

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, roleAuth('admin'), updateProfile);
router.put('/profile/password', authMiddleware, roleAuth('admin'), updatePassword);

router.put('/orders/:orderId', authMiddleware, roleAuth('admin'), updateOrder);
router.get('/products', authMiddleware, getProducts);

export default router;