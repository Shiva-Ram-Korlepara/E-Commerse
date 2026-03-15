import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(()=>{
    (async()=>{
      try {
        const { data } = await api.get(endpoints.customer.orders);
        setOrders(data || []);
      } catch {}
    })();
  },[]);

  const toggle = (id) => setOpenId((curr)=> curr === id ? null : id);

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-navy-800 mb-3">My Orders</h2>
      <div className="space-y-3">
        {orders.map((o)=> {
          const isOpen = openId === o._id;
          const p = o.productId || {};
          const loc = o.location || {};
          return (
            <div key={o._id} className="border rounded">
              <button className="w-full text-left p-3 flex items-center justify-between" onClick={()=>toggle(o._id)}>
                <div>
                  <div className="font-medium">Order #{o._id?.slice(-6)}</div>
                  <div className="text-sm text-navy-700">Status: {o.status}</div>
                </div>
                <div className="text-navy-600">{isOpen ? '▴' : '▾'}</div>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 text-sm text-navy-800 grid gap-3">
                  {p.image && (
                    <div className="w-full">
                      <img src={p.image} alt={p.name || 'Product'} className="w-full max-w-sm h-40 object-cover rounded" onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/400x300?text=Image'; }} />
                    </div>
                  )}
                  <div><span className="text-navy-600">Product:</span> {p.name}</div>
                  <div><span className="text-navy-600">Description:</span> {p.description}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-navy-600">Quantity:</span> {o.quantity}</div>
                    <div><span className="text-navy-600">Price:</span> ${o.price}</div>
                    <div><span className="text-navy-600">Amount:</span> ${o.amount}</div>
                    <div><span className="text-navy-600">Date:</span> {o.orderDate ? new Date(o.orderDate).toLocaleString() : ''}</div>
                  </div>
                  <div>
                    <div className="text-navy-600">Shipping Address</div>
                    <div>{[loc.street, loc.flatNo, loc.city, loc.state, loc.country, loc.zipCode].filter(Boolean).join(', ')}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

