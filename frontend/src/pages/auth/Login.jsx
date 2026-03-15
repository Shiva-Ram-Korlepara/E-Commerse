import { useState } from 'react';
import { api, endpoints } from '../../services/api.js';
import useAuthStore from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const path = role === 'admin' ? endpoints.admin.signin : role === 'seller' ? endpoints.seller.signin : endpoints.customer.signin;
      const { data } = await api.post(path, { email, password });
      login(data.token, role);
      if (role === 'admin') navigate('/admin');
      else if (role === 'seller') navigate('/seller');
      else navigate('/customer');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-navy-800 mb-6">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full rounded border px-3 py-2">
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded border px-3 py-2" type="email" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded border px-3 py-2" type="password" required />
          </div>
          {error && <div className="text-peach-700 bg-peach-50 border border-peach-200 px-3 py-2 rounded">{error}</div>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-4 text-sm text-navy-700">
          New here? <a className="text-peach-600 underline" href="/signup/customer">Customer signup</a> • <a className="text-peach-600 underline" href="/signup/seller">Seller signup</a>
        </div>
      </div>
    </div>
  );
}

