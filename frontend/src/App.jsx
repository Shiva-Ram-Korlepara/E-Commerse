import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout.jsx';
import AdminLayout from './components/layouts/AdminLayout.jsx';
import SellerLayout from './components/layouts/SellerLayout.jsx';
import Login from './pages/auth/Login.jsx';
import SignupCustomer from './pages/auth/SignupCustomer.jsx';
import SignupSeller from './pages/auth/SignupSeller.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import AdminLists from './pages/admin/Lists.jsx';
import AdminProfile from './pages/admin/Profile.jsx';
import CustomerHome from './pages/customer/Home.jsx';
import ProductDetail from './pages/customer/ProductDetail.jsx';
import CustomerProfile from './pages/customer/Profile.jsx';
import CustomerOrders from './pages/customer/Orders.jsx';
import UpdatePassword from './pages/customer/UpdatePassword.jsx';
import SellerHome from './pages/seller/Home.jsx';
import SellerProfile from './pages/seller/Profile.jsx';
import SellerPortfolio from './pages/seller/Portfolio.jsx';
import SellerUpdatePassword from './pages/seller/UpdatePassword.jsx';
import CreateProduct from './pages/seller/CreateProduct.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>        
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/customer" element={<SignupCustomer />} />
        <Route path="/signup/seller" element={<SignupSeller />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/customer/profile" element={<ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>} />
        <Route path="/customer/password" element={<ProtectedRoute role="customer"><UpdatePassword /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute role="customer"><CustomerOrders /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/lists" replace />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="lists" element={<AdminLists />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="/seller" element={<ProtectedRoute role="seller"><SellerLayout /></ProtectedRoute>}>
        <Route index element={<SellerHome />} />
        <Route path="profile" element={<SellerProfile />} />
        <Route path="password" element={<SellerUpdatePassword />} />
        <Route path="portfolio" element={<SellerPortfolio />} />
        <Route path="create" element={<CreateProduct />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
