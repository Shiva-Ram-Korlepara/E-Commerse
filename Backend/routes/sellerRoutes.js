import express from 'express';

import { 
    createSeller,
    getSellerOrders,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/sellerController.js';

import {
    viewReviews,
    updatePassword,
    updateProfile,
    getProfile,
    viewProduct,
    getCategories,
    updateOrder
} from '../controllers/publicController.js';

import { roleAuth } from '../middlewares/roleMiddleware.js';
import { loginSeller } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createSeller);
router.post('/signin', loginSeller);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, roleAuth('seller'), updateProfile);
router.put('/profile/password', authMiddleware, roleAuth('seller'), updatePassword);

router.get('/products', authMiddleware, roleAuth('seller'), getSellerProducts);
router.post('/products', authMiddleware, roleAuth('seller'), createProduct);
router.put('/products/:productId', authMiddleware, roleAuth('seller'), updateProduct);

router.get('/orders', authMiddleware, roleAuth('seller'), getSellerOrders);
router.put('/orders/:orderId', authMiddleware, roleAuth('seller'), updateOrder);

router.get('/products/:productId', authMiddleware, viewProduct);
router.delete('/products/:productId', authMiddleware, roleAuth('seller'), deleteProduct);
router.get('/categories', authMiddleware, getCategories);
router.get('/reviews', authMiddleware, viewReviews);

export default router;