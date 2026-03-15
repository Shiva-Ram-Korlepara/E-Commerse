import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, endpoints } from '../../services/api.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [location, setLocation] = useState({ country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' });
  const [orderMsg, setOrderMsg] = useState('');

  useEffect(() => {
    (async ()=>{
      try {
        const [{ data: prod }, { data: revs } ] = await Promise.all([
          api.get(endpoints.customer.product(id)),
          api.get(endpoints.customer.reviews(id))
        ]);
        setProduct(prod);
        setReviews(Array.isArray(revs) ? revs : []);
      } catch {}
    })();
  }, [id]);

  const dec = () => setQty((q)=> Math.max(0, q - 1));
  const inc = () => setQty((q)=> q + 1);
  const amount = useMemo(()=> (product ? (Number(product.price) * Number(qty)) : 0), [product, qty]);

  const submitReview = async (e) => {
    e.preventDefault(); if (!rating || !comment) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(endpoints.customer.createReview, { productId: id, rating, comment });
      // Prepend newly created review; fetch has already loaded others;
      setReviews((prev)=> [{ _id: data?._id || Math.random().toString(36), userName: data?.userName || 'You', rating, comment, date: data?.date }, ...prev]);
      setRating(''); setComment('');
    } catch {}
    finally { setSubmitting(false); }
  };

  const placeOrder = async (e) => {
    e.preventDefault(); setOrderMsg(''); setSubmitting(true);
    try {
      await api.post(endpoints.customer.orders, { productId: id, quantity: String(qty), location });
      setOrderMsg('Order placed successfully');
      setBuyOpen(false);
    } catch (err) {
      setOrderMsg(err?.response?.data?.message || 'Failed to place order');
    } finally { setSubmitting(false); }
  };

  if (!product) return <div className="mx-auto max-w-6xl px-4 py-10">Loading...</div>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2">
      <div className="card aspect-square overflow-hidden flex items-center justify-center bg-navy-50">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/800?text=Image'; }} />
        ) : (
          <div className="text-navy-400">No Image</div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{product.name}</h1>
        <div className="text-sm text-navy-600 mt-1">Seller: <span className="font-medium">{product.sellerName || product.sellerId || '—'}</span></div>
        <div className="mt-2 text-navy-700">{product.description}</div>
        <div className="mt-4 font-semibold text-peach-700 text-xl">${product.price}</div>
        <div className="mt-1 text-sm text-navy-700">Amount: <span className="font-semibold">${amount}</span></div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-navy-700">Qty</label>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border" onClick={dec}>-</button>
            <input type="number" min="0" value={qty} onChange={(e)=>setQty(Math.max(0, Number(e.target.value)||0))} className="w-16 text-center rounded border px-2 py-1" />
            <button className="px-3 py-1 rounded border" onClick={inc}>+</button>
          </div>
          <button className="btn-primary" onClick={()=>setBuyOpen((v)=>!v)}>Buy</button>
        </div>

        {buyOpen && (
          <form onSubmit={placeOrder} className="mt-4 grid gap-2 border rounded p-3">
            <div className="text-sm font-medium text-navy-800">Shipping Address</div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Country" value={location.country} onChange={(e)=>setLocation({...location, country:e.target.value})} className="rounded border px-2 py-1" required />
              <input placeholder="State" value={location.state} onChange={(e)=>setLocation({...location, state:e.target.value})} className="rounded border px-2 py-1" required />
              <input placeholder="City" value={location.city} onChange={(e)=>setLocation({...location, city:e.target.value})} className="rounded border px-2 py-1" required />
              <input placeholder="Street" value={location.street} onChange={(e)=>setLocation({...location, street:e.target.value})} className="rounded border px-2 py-1" required />
              <input placeholder="Flat No" value={location.flatNo} onChange={(e)=>setLocation({...location, flatNo:e.target.value})} className="rounded border px-2 py-1" required />
              <input placeholder="Zip Code" value={location.zipCode} onChange={(e)=>setLocation({...location, zipCode:e.target.value})} className="rounded border px-2 py-1" required />
            </div>
            <button className="btn-primary w-max" disabled={submitting}>{submitting? 'Placing...' : 'Place Order'}</button>
            {orderMsg && <div className="text-sm text-navy-700">{orderMsg}</div>}
          </form>
        )}

        <div className="mt-8">
          <h2 className="font-semibold text-navy-800">Reviews</h2>
          <form onSubmit={submitReview} className="mt-3 grid gap-2">
            <StarRating value={rating} onChange={setRating} />
            <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Write your review..." className="rounded border px-3 py-2" rows={3} required />
            <button className="btn-primary w-max" disabled={submitting}>{submitting ? 'Submitting...' : 'Create Review'}</button>
          </form>
          <div className="mt-4 space-y-3">
            {reviews.map((r)=> (
              <div key={r._id} className="card p-4">
                <div className="font-medium text-navy-800">{r.userName || 'Customer'}</div>
                <div className="text-xs text-navy-600">Rating: {r.rating}</div>
                <div className="text-sm text-navy-700">{r.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ value, onChange }) {
  const ratings = ['1 Star','2 Star','3 Star','4 Star','5 Star'];
  const activeIdx = ratings.indexOf(value);
  return (
    <div className="flex items-center gap-1">
      {ratings.map((label, idx)=> (
        <button type="button" key={label} onClick={()=>onChange(label)} aria-label={label} className="text-2xl text-gold-500">
          <span>{idx <= activeIdx ? '★' : '☆'}</span>
        </button>
      ))}
    </div>
  );
}

