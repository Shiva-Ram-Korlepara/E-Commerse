import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';
import { Link } from 'react-router-dom';

export default function CustomerProfile() {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState({ userName:false, phone:false });
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await api.get(endpoints.customer.profile);
        setData(data);
      } catch {}
    })();
  },[]);

  const saveField = async (field, value) => {
    setPending(true); setMsg('');
    try {
      await api.put(endpoints.customer.updateProfile, { [field]: value });
      setData((prev)=> ({ ...prev, [field]: value }));
      setEdit((e)=> ({ ...e, [field]: false }));
      setMsg('Updated');
    } catch { setMsg('Update failed'); }
    finally { setPending(false); }
  };

  const addAddress = async (addr) => {
    setPending(true); setMsg('');
    try {
      const newList = Array.isArray(data.address) ? [...data.address, addr] : [addr];
      await api.put(endpoints.customer.updateProfile, { address: newList });
      setData((prev)=> ({ ...prev, address: newList }));
      setMsg('Address added');
    } catch { setMsg('Failed to add address'); }
    finally { setPending(false); }
  };

  if (!data) return <div className="mx-auto max-w-2xl px-4 py-10">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4 text-center">My Profile</h2>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-navy-600">Name</div>
              {!edit.userName ? (
                <div className="text-navy-900 font-medium">{data.userName || '-'}</div>
              ) : (
                <input defaultValue={data.userName} onKeyDown={(e)=>{ if(e.key==='Enter') saveField('userName', e.currentTarget.value); }} className="rounded border px-3 py-2" />
              )}
            </div>
            <button disabled={pending} onClick={()=> setEdit((e)=> ({...e, userName: !e.userName}))} className="px-3 py-1.5 rounded border">{edit.userName? 'Cancel':'Edit'}</button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-navy-600">Email</div>
              <div className="text-navy-900 font-medium">{data.email || '-'}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-navy-600">Phone</div>
              {!edit.phone ? (
                <div className="text-navy-900 font-medium">{data.phone || '-'}</div>
              ) : (
                <input defaultValue={data.phone} onKeyDown={(e)=>{ if(e.key==='Enter') saveField('phone', e.currentTarget.value); }} className="rounded border px-3 py-2" />
              )}
            </div>
            <button disabled={pending} onClick={()=> setEdit((e)=> ({...e, phone: !e.phone}))} className="px-3 py-1.5 rounded border">{edit.phone? 'Cancel':'Edit'}</button>
          </div>

          <div>
            <div className="text-sm text-navy-600 mb-2">Addresses</div>
            <div className="grid gap-3">
              {Array.isArray(data.address) && data.address.length>0 ? data.address.map((a, idx)=> (
                <div key={idx} className="border rounded p-3 text-sm text-navy-800">
                  {[a.street, a.flatNo, a.city, a.state, a.country, a.zipCode].filter(Boolean).join(', ')}
                </div>
              )) : <div className="text-sm text-navy-600">No addresses added</div>}
              <details className="border rounded p-3">
                <summary className="cursor-pointer text-sm text-navy-700">+ Add address</summary>
                <AddressForm onAdd={addAddress} submitting={pending} />
              </details>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Link to="/customer/password" className="btn-primary">Update Password</Link>
          </div>
          {msg && <div className="text-sm text-navy-700">{msg}</div>}
        </div>
      </div>
    </div>
  );
}

function AddressForm({ onAdd, submitting }) {
  const [addr, setAddr] = useState({ country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' });
  const onChange = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); onAdd(addr); };
  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <input name="country" value={addr.country} onChange={onChange} placeholder="Country" className="rounded border px-2 py-1" required />
        <input name="state" value={addr.state} onChange={onChange} placeholder="State" className="rounded border px-2 py-1" required />
        <input name="city" value={addr.city} onChange={onChange} placeholder="City" className="rounded border px-2 py-1" required />
        <input name="street" value={addr.street} onChange={onChange} placeholder="Street" className="rounded border px-2 py-1" required />
        <input name="flatNo" value={addr.flatNo} onChange={onChange} placeholder="Flat No" className="rounded border px-2 py-1" required />
        <input name="zipCode" value={addr.zipCode} onChange={onChange} placeholder="Zip Code" className="rounded border px-2 py-1" required />
      </div>
      <button className="btn-primary w-max" disabled={submitting}>Save Address</button>
    </form>
  );
}

