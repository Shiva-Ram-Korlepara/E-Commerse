import { useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function UpdatePassword() {
  const [form, setForm] = useState({ oldPassword:'', newPassword:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault(); setMsg(''); setLoading(true);
    try {
      await api.put(endpoints.customer.updatePassword, form);
      setMsg('Password updated');
      setForm({ oldPassword:'', newPassword:'' });
    } catch (e) { setMsg(e?.response?.data?.message || 'Failed to update password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card p-6">
        <h2 className="font-semibold text-navy-800 mb-4">Update Password</h2>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input name="oldPassword" type="password" value={form.oldPassword} onChange={onChange} placeholder="Old Password" className="rounded border px-3 py-2" required />
          <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} placeholder="New Password" className="rounded border px-3 py-2" required />
          <button className="btn-primary w-max" disabled={loading}>{loading? 'Updating...' : 'Update Password'}</button>
        </form>
        {msg && <div className="mt-3 text-sm text-navy-700">{msg}</div>}
      </div>
    </div>
  );
}
