import express from 'express';

import {
    createCustomer,
    createOrder,
    getCustomerOrders,
    createReview
} from '../controllers/customerController.js';

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
import { loginCustomer } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createCustomer);
router.post('/signin', loginCustomer);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, roleAuth('customer'), updateProfile);
router.put('/profile/password', authMiddleware, roleAuth('customer'), updatePassword);

router.get('/products', authMiddleware, getProducts);
router.post('/products', authMiddleware, roleAuth('customer'), createReview);
router.post('/orders', authMiddleware, roleAuth('customer'), createOrder);
router.get('/orders', authMiddleware, roleAuth('customer'), getCustomerOrders);
router.post('/reviews', authMiddleware, roleAuth('customer'), createReview);

router.get('/products/:productId', authMiddleware, viewProduct);
router.get('/categories', authMiddleware, getCategories);
router.get('/reviews/:productId', authMiddleware, viewReviews);
router.put('/orders/:orderId', authMiddleware, updateOrder);

export default router;