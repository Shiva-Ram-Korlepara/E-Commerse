import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function AdminLists() {
  const [tab, setTab] = useState('customers');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const url = tab === 'customers' ? endpoints.admin.customers : tab === 'sellers' ? endpoints.admin.sellers : tab === 'orders' ? endpoints.admin.orders : endpoints.admin.products;
        const { data } = await api.get(url);
        setItems(data || []);
      } catch (e) { setItems([]); }
    };
    load();
  }, [tab]);

  const renderCustomer = (c) => {
    return (
      <div className="border rounded p-4 bg-white" key={c._id}>
        <div className="font-semibold text-navy-800">{c.userName || 'Customer'}</div>
        <div className="text-sm text-navy-700">Email: {c.email}</div>
        <div className="text-sm text-navy-700">Phone: {c.phone}</div>
        <div className="text-sm text-navy-700">Role: {c.role}</div>
        {Array.isArray(c.address) && c.address.length > 0 && (
          <div className="mt-2 text-sm text-navy-700">
            <div className="font-medium">Addresses</div>
            <ul className="list-disc ml-5">
              {c.address.map((a, idx) => (
                <li key={idx}>{[a.street, a.flatNo, a.city, a.state, a.country, a.zipCode].filter(Boolean).join(', ')}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderSeller = (s) => {
    const sellerObj = s.sellerId || s; // in some endpoints seller may be nested
    const addr = sellerObj.businessAddress || {};
    return (
      <div className="border rounded p-4 bg-white" key={s._id || sellerObj._id}>
        <div className="font-semibold text-navy-800">{sellerObj.businessName || sellerObj.userName || 'Seller'}</div>
        <div className="text-sm text-navy-700">Email: {sellerObj.email}</div>
        <div className="text-sm text-navy-700">Phone: {sellerObj.phone}</div>
        <div className="text-sm text-navy-700">Role: {sellerObj.role}</div>
        <div className="mt-2 text-sm text-navy-700">
          <div className="font-medium">Business Address</div>
          <div>{[addr.street, addr.flatNo, addr.city, addr.state, addr.country, addr.zipCode].filter(Boolean).join(', ')}</div>
        </div>
      </div>
    );
  };

  const renderProduct = (p) => {
    const loc = p.location || {};
    return (
      <div className="border rounded p-4 bg-white" key={p._id}>
        {p.image && (
          <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded mb-3" onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/400x300?text=Image'; }} />
        )}
        <div className="font-semibold text-navy-800">{p.name}</div>
        <div className="text-sm text-navy-700">Seller: {p.sellerName || p.sellerId}</div>
        <div className="text-sm text-navy-700">Price: ${p.price}</div>
        <div className="text-sm text-navy-700">Stock: {p.stock}</div>
        {Array.isArray(p.category) && p.category.length > 0 && (
          <div className="text-sm text-navy-700">Categories: {p.category.join(', ')}</div>
        )}
        <div className="mt-1 text-sm text-navy-700 line-clamp-2">{p.description}</div>
        <div className="mt-2 text-sm text-navy-700">
          <div className="font-medium">Location</div>
          <div>{[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}</div>
        </div>
      </div>
    );
  };

  const renderOrder = (o) => {
    const loc = o.location || {};
    const sellerName = (o.sellerId && (o.sellerId.businessName || o.sellerId.userName)) || o.sellerId;
    const customerName = (o.customerId && o.customerId.userName) || o.customerId;
    return (
      <div className="border rounded p-4 bg-white" key={o._id}>
        <div className="font-semibold text-navy-800">Order</div>
        <div className="text-sm text-navy-700">Seller: {sellerName}</div>
        <div className="text-sm text-navy-700">Customer: {customerName}</div>
        <div className="text-sm text-navy-700">Quantity: {o.quantity}</div>
        <div className="text-sm text-navy-700">Price: ${o.price}</div>
        <div className="text-sm text-navy-700">Amount: ${o.amount}</div>
        <div className="text-sm text-navy-700">Date: {o.orderDate ? new Date(o.orderDate).toLocaleString() : ''}</div>
        <div className="text-sm text-navy-700">
          <div className="font-medium">Location</div>
          <div>{[loc.street, loc.flatNo, loc.city, loc.state, loc.country, loc.zipCode].filter(Boolean).join(', ')}</div>
        </div>
      </div>
    );
  };

  const renderItem = (it) => {
    if (tab === 'customers') return renderCustomer(it);
    if (tab === 'sellers') return renderSeller(it);
    if (tab === 'orders') return renderOrder(it);
    return renderProduct(it);
  };

  return (
    <div className="card p-6">
      <div className="flex gap-2 mb-4">
        {['customers','sellers','orders','products'].map((t)=> (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded ${tab===t?'bg-navy-800 text-white':'bg-navy-50 text-navy-700'}`}>{t}</button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it)=> renderItem(it))}
      </div>
    </div>
  );
}

