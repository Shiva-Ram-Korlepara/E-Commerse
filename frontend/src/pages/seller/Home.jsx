import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function SellerHome() {
  const [products, setProducts] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name:'', image:'', price:'', stock:'', location:{ country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' } });
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get(endpoints.seller.products);
      setProducts(data || []);
    } catch {}
  };

  useEffect(()=>{ load(); },[]);

  const toggle = (id) => setOpenId((curr)=> curr === id ? null : id);
  const startEdit = (p) => { setEditingId(p._id); setEditForm({ name:p.name||'', image:p.image||'', price:String(p.price||''), stock:String(p.stock||''), location: p.location || { country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' } }); setMsg(''); };
  const cancelEdit = () => { setEditingId(null); setMsg(''); };

  const saveEdit = async (id) => {
    setMsg('');
    try {
      const payload = { ...editForm, price: Number(editForm.price||0), stock: Number(editForm.stock||0) };
      await api.put(endpoints.seller.updateProduct(id), payload);
      setMsg('Product updated');
      setEditingId(null);
      load();
    } catch { setMsg('Failed to update'); }
  };

  const remove = async (id) => {
    setMsg('');
    try {
      await api.delete(endpoints.seller.deleteProduct(id));
      setMsg('Product deleted');
      if (openId === id) setOpenId(null);
      load();
    } catch { setMsg('Failed to delete'); }
  };

  return (
    <div className="space-y-3">
      {products.map((p)=>(
        <div key={p._id} className="border rounded">
          <button className="w-full text-left p-4 flex items-center justify-between" onClick={()=>toggle(p._id)}>
            <div className="flex items-center gap-3">
              {p.image ? <img src={p.image} alt={p.name} className="w-16 h-12 object-cover rounded" onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/160x120?text=Image'; }} /> : <div className="w-16 h-12 bg-navy-100 rounded" />}
              <div>
                <div className="font-medium text-navy-900">{p.name}</div>
                <div className="text-sm text-navy-700">${p.price} • Stock: {p.stock}</div>
              </div>
            </div>
            <div className="text-navy-600">{openId===p._id ? '▴' : '▾'}</div>
          </button>
          {openId===p._id && (
            <div className="px-4 pb-4">
              {editingId===p._id ? (
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={editForm.name} onChange={(e)=>setEditForm({...editForm, name:e.target.value})} placeholder="Name" className="rounded border px-3 py-2" />
                    <input value={editForm.image} onChange={(e)=>setEditForm({...editForm, image:e.target.value})} placeholder="Image URL" className="rounded border px-3 py-2" />
                    <input value={editForm.price} onChange={(e)=>setEditForm({...editForm, price:e.target.value})} placeholder="Price" className="rounded border px-3 py-2" type="number" />
                    <input value={editForm.stock} onChange={(e)=>setEditForm({...editForm, stock:e.target.value})} placeholder="Stock" className="rounded border px-3 py-2" type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={editForm.location.country} onChange={(e)=>setEditForm({...editForm, location:{...editForm.location, country:e.target.value}})} placeholder="Country" className="rounded border px-3 py-2" />
                    <input value={editForm.location.state} onChange={(e)=>setEditForm({...editForm, location:{...editForm.location, state:e.target.value}})} placeholder="State" className="rounded border px-3 py-2" />
                    <input value={editForm.location.city} onChange={(e)=>setEditForm({...editForm, location:{...editForm.location, city:e.target.value}})} placeholder="City" className="rounded border px-3 py-2" />
                    <input value={editForm.location.street} onChange={(e)=>setEditForm({...editForm, location:{...editForm.location, street:e.target.value}})} placeholder="Street" className="rounded border px-3 py-2" />
                    <input value={editForm.location.flatNo} onChange={(e)=>setEditForm({...editForm, location:{...editForm.location, flatNo:e.target.value}})} placeholder="Flat No" className="rounded border px-3 py-2" />
                    <input value={editForm.location.zipCode} onChange={(e)=>setEditForm({...editForm, location:{...editForm.location, zipCode:e.target.value}})} placeholder="Zip Code" className="rounded border px-3 py-2" />
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={()=>saveEdit(p._id)}>Save</button>
                    <button className="px-3 py-2 rounded border" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2 text-sm text-navy-800">
                  <div><span className="text-navy-600">Description:</span> {p.description}</div>
                  <div><span className="text-navy-600">Location:</span> {[p.location?.street, p.location?.flatNo, p.location?.city, p.location?.state, p.location?.country, p.location?.zipCode].filter(Boolean).join(', ')}</div>
                  <div className="flex gap-2 pt-2">
                    <button className="btn-primary" onClick={()=>startEdit(p)}>Edit</button>
                    <button className="px-3 py-2 rounded border text-peach-700" onClick={()=>remove(p._id)}>Delete</button>
                  </div>
                  {msg && <div className="text-navy-700">{msg}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

