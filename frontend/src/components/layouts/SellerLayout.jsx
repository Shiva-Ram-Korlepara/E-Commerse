import { Outlet, NavLink, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

export default function SellerLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-navy-800 text-white p-4 space-y-3">
        <div className="text-lg font-semibold">Seller</div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/seller" end className={({isActive})=>`px-3 py-2 rounded ${isActive?'bg-navy-700':'hover:bg-navy-700/60'}`}>My Products</NavLink>
          <NavLink to="/seller/create" className={({isActive})=>`px-3 py-2 rounded ${isActive?'bg-navy-700':'hover:bg-navy-700/60'}`}>Create Product</NavLink>
          <NavLink to="/seller/portfolio" className={({isActive})=>`px-3 py-2 rounded ${isActive?'bg-navy-700':'hover:bg-navy-700/60'}`}>Portfolio</NavLink>
        </nav>
      </aside>
      <div className="bg-offwhite">
        <header className="bg-white border-b px-6 py-4 text-navy-800 font-semibold flex items-center justify-between">
          <span>Seller Panel</span>
          <div className="flex items-center gap-3">
            <Link to="/seller/profile" className="rounded-full w-9 h-9 bg-navy-100 flex items-center justify-center overflow-hidden" aria-label="Profile">
              <img src="../../../public/profile_image.png" alt="Profile" className="w-full h-full object-cover" />
            </Link>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded bg-navy-800 text-white hover:bg-navy-700">Logout</button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

