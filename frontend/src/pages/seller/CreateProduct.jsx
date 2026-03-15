import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function CreateProduct() {
  const [form, setForm] = useState({ name:'', description:'', image:'', stock:'', price:'', location:{ country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' }, categories:[] });
  const [msg, setMsg] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    (async()=>{
      try { const { data } = await api.get(endpoints.seller.categories); setCategories(data || []); } catch {}
    })();
  },[]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    try { await api.post(endpoints.seller.createProduct, { ...form, stock: Number(form.stock||0), price: Number(form.price||0) }); setMsg('Product created'); setForm({ name:'', description:'', image:'', stock:'', price:'', location:{ country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' }, categories:[] }); } catch { setMsg('Failed to create'); }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card p-6">
        <h2 className="font-semibold text-navy-800 text-center">Create Product</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="rounded border px-3 py-2" required />
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="rounded border px-3 py-2" rows={4} />
          <input name="image" value={form.image} onChange={onChange} placeholder="Image URL" className="rounded border px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input name="stock" value={form.stock} onChange={onChange} placeholder="Stock" className="rounded border px-3 py-2" type="number" />
            <input name="price" value={form.price} onChange={onChange} placeholder="Price" className="rounded border px-3 py-2" type="number" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Country" className="rounded border px-3 py-2" value={form.location.country} onChange={(e)=>setForm({...form, location:{...form.location, country:e.target.value}})} />
            <input placeholder="State" className="rounded border px-3 py-2" value={form.location.state} onChange={(e)=>setForm({...form, location:{...form.location, state:e.target.value}})} />
            <input placeholder="City" className="rounded border px-3 py-2" value={form.location.city} onChange={(e)=>setForm({...form, location:{...form.location, city:e.target.value}})} />
            <input placeholder="Street" className="rounded border px-3 py-2" value={form.location.street} onChange={(e)=>setForm({...form, location:{...form.location, street:e.target.value}})} />
            <input placeholder="Flat No" className="rounded border px-3 py-2" value={form.location.flatNo} onChange={(e)=>setForm({...form, location:{...form.location, flatNo:e.target.value}})} />
            <input placeholder="Zip Code" className="rounded border px-3 py-2" value={form.location.zipCode} onChange={(e)=>setForm({...form, location:{...form.location, zipCode:e.target.value}})} />
          </div>
          <div>
            <div className="font-medium text-navy-800 mb-1">Categories</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(c=> (
                <label key={c._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.categories.includes(c._id)} onChange={(e)=>{
                    const checked = e.target.checked;
                    setForm(f=> ({...f, categories: checked ? [...f.categories, c._id] : f.categories.filter(id=>id!==c._id)}));
                  }} />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="btn-primary w-max mx-auto">Create</button>
        </form>
        {msg && <div className="mt-3 text-navy-800 text-center">{msg}</div>}
      </div>
    </div>
  );
}

