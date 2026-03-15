import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function MainLayout() {
  const { isAuthenticated, userRole, logout } = useAuthStore();
  const isCustomer = isAuthenticated && userRole === 'customer';
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to={isCustomer ? '/customer' : '/login'} className="text-xl font-bold text-navy-700">E‑Shop</Link>
          {!isLoginPage && (
            <nav className="flex items-center gap-4">
              {isCustomer && <Link to="/customer" className="hover:text-peach-600">Home</Link>}
              {isCustomer && <Link to="/customer/orders" className="hover:text-peach-600">My Orders</Link>}
              {isCustomer && (
                <Link to="/customer/profile" className="rounded-full w-9 h-9 bg-navy-100 flex items-center justify-center overflow-hidden" aria-label="Profile">
                  <img src="public/profile_image.png" alt="Profile" className="w-full h-full object-cover" />
                </Link>
              )}
              {!isAuthenticated ? (
                <Link to="/login" className="btn-primary">Login</Link>
              ) : (
                <button onClick={handleLogout} className="px-3 py-1.5 rounded bg-navy-800 text-white hover:bg-navy-700">Logout</button>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-navy-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} E‑Shop</span>
          <span className="text-gold-600">Crafted in peach & navy</span>
        </div>
      </footer>
    </div>
  );
}

