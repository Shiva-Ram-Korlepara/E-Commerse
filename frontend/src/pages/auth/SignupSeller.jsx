import { useState } from 'react';
import { api, endpoints } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

export default function SignupSeller() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', businessName:'', businessAddress:{ country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const payload = {
        userName: form.name,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        businessAddress: form.businessAddress,
        password: form.password
      };
      const { data } = await api.post(endpoints.seller.signup, payload);
      if (data?.token) {
        login(data.token, 'seller');
        navigate('/seller');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-navy-800 mb-6">Seller Sign Up</h1>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <input name="name" placeholder="Full Name" className="rounded border px-3 py-2" value={form.name} onChange={onChange} required />
          <input name="email" placeholder="Email" className="rounded border px-3 py-2" value={form.email} onChange={onChange} type="email" required />
          <input name="password" placeholder="Password" className="rounded border px-3 py-2" value={form.password} onChange={onChange} type="password" required />
          <input name="phone" placeholder="Phone" className="rounded border px-3 py-2" value={form.phone} onChange={onChange} required />
          <input name="businessName" placeholder="Business Name" className="rounded border px-3 py-2" value={form.businessName} onChange={onChange} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="country" placeholder="Country" className="rounded border px-3 py-2" value={form.businessAddress.country} onChange={(e)=>setForm({ ...form, businessAddress:{ ...form.businessAddress, country:e.target.value }})} required />
            <input name="state" placeholder="State" className="rounded border px-3 py-2" value={form.businessAddress.state} onChange={(e)=>setForm({ ...form, businessAddress:{ ...form.businessAddress, state:e.target.value }})} required />
            <input name="city" placeholder="City" className="rounded border px-3 py-2" value={form.businessAddress.city} onChange={(e)=>setForm({ ...form, businessAddress:{ ...form.businessAddress, city:e.target.value }})} required />
            <input name="street" placeholder="Street" className="rounded border px-3 py-2" value={form.businessAddress.street} onChange={(e)=>setForm({ ...form, businessAddress:{ ...form.businessAddress, street:e.target.value }})} required />
            <input name="flatNo" placeholder="Flat No" className="rounded border px-3 py-2" value={form.businessAddress.flatNo} onChange={(e)=>setForm({ ...form, businessAddress:{ ...form.businessAddress, flatNo:e.target.value }})} required />
            <input name="zipCode" placeholder="Zip Code" className="rounded border px-3 py-2" value={form.businessAddress.zipCode} onChange={(e)=>setForm({ ...form, businessAddress:{ ...form.businessAddress, zipCode:e.target.value }})} required />
          </div>
          {error && <div className="text-peach-700 bg-peach-50 border border-peach-200 px-3 py-2 rounded">{error}</div>}
          <button className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
      </div>
    </div>
  );
}

