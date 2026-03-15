import { useEffect, useMemo, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function SellerPortfolio() {
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    (async()=>{
      try { const { data } = await api.get(endpoints.seller.orders); setOrders(data || []);} catch {}
    })();
  },[]);

  const revenue = useMemo(()=> orders.reduce((sum, o)=> sum + (Number(o.amount)||0), 0), [orders]);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-navy-800">Customer Orders</h2>
        <div className="text-navy-800">Revenue: <span className="font-semibold">${revenue}</span></div>
      </div>
      <div className="mt-4 space-y-3">
        {orders.map((o)=> (
          <div key={o._id} className="border rounded p-3 text-sm text-navy-800 grid gap-2">
            <div className="flex items-center gap-3">
              {o.productId?.image ? (
                <img src={o.productId.image} alt={o.productId?.name || 'Product'} className="w-24 h-16 object-cover rounded" onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/160x120?text=Image'; }} />
              ) : (
                <div className="w-24 h-16 bg-navy-100 rounded" />
              )}
              <div>
                <div className="font-medium">Order #{o._id?.slice(-6)}</div>
                <div>Product: {o.productId?.name}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>Quantity: {o.quantity}</div>
              <div>Price: ${o.price}</div>
              <div>Amount: ${o.amount}</div>
              <div>Date: {o.orderDate ? new Date(o.orderDate).toLocaleString() : ''}</div>
            </div>
            <div>Address: {[o.location?.city, o.location?.state, o.location?.country].filter(Boolean).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

