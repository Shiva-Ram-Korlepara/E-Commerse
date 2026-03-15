import { useEffect, useMemo, useState } from 'react';
import { api, endpoints } from '../../services/api.js';
import { Link } from 'react-router-dom';

export default function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryId) params.category = categoryId;
      if (query) params.name = query;
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;

      const [{ data: prods }, { data: cats }] = await Promise.all([
        api.get(endpoints.customer.products, { params }),
        api.get(endpoints.customer.categories)
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { fetchData(); }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryId, minPrice, maxPrice]);

  const filtered = useMemo(()=>{
    return products;
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="space-y-3">
        <div className="card p-4">
          <div className="font-semibold text-navy-800 mb-2">Search</div>
          <input className="w-full rounded border px-3 py-2" placeholder="Search products..." value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="card p-4">
          <div className="font-semibold text-navy-800 mb-2">Price Filter</div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="0" placeholder="Min" className="rounded border px-2 py-1" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
            <input type="number" min="0" placeholder="Max" className="rounded border px-2 py-1" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
          </div>
        </div>
        <div className="card p-4">
          <div className="font-semibold text-navy-800 mb-2">Categories</div>
          <ul className="space-y-1 text-navy-700">
            <li>
              <button className={`px-2 py-1 rounded ${categoryId===''?'bg-gold-200':''}`} onClick={()=>setCategoryId('')}>All</button>
            </li>
            {categories.map((c)=> (
              <li key={c._id}>
                <button className={`px-2 py-1 rounded ${categoryId===c._id?'bg-gold-200':''}`} onClick={()=>setCategoryId(c._id)}>{c.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="col-span-full text-center text-navy-700">Loading...</div>}
        {!loading && filtered.map((p)=>(
          <Link to={`/product/${p._id}`} key={p._id} className="card p-4 hover:shadow-md transition h-72 flex flex-col">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded mb-3" loading="lazy" onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/400x300?text=Image'; }} />
            ) : (
              <div className="w-full h-36 rounded bg-navy-100 mb-3" />)
            }
            <div className="font-medium text-navy-900 line-clamp-1">{p.name}</div>
            <div className="text-navy-700 text-sm line-clamp-2">{p.description}</div>
            <div className="mt-auto font-semibold text-peach-700">${p.price}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}

