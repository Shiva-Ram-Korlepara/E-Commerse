import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function AdminCategories() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadCategories = async () => {
    try {
      const { data } = await api.get(endpoints.admin.categories);
      setCategories(data || []);
    } catch {}
  };

  useEffect(() => { loadCategories(); }, []);

  const onCreate = async (e) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      await api.post(endpoints.admin.categories, { name, type, description });
      setName(''); setType(''); setDescription('');
      setMessage('Category created');
      loadCategories();
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Error creating category');
    } finally { setLoading(false); }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <div className="card p-6">
        <h2 className="font-semibold text-navy-800">Create Category</h2>
        <form onSubmit={onCreate} className="mt-4 grid gap-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="rounded border px-3 py-2" required />
          <input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Type" className="rounded border px-3 py-2" required />
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="rounded border px-3 py-2" rows={3} required />
          <button className="btn-primary w-max" disabled={loading}>{loading? 'Creating...' : 'Create'}</button>
        </form>
        {message && <div className="mt-3 text-sm text-navy-700">{message}</div>}
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-navy-800 mb-3">Categories</h2>
        <ul className="divide-y">
          {categories.map((c)=>(
            <li key={c._id} className="py-2">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-navy-700">{c.type}</div>
              <div className="text-sm text-navy-600">{c.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

