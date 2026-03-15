import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';
import { Link } from 'react-router-dom';

export default function SellerProfile() {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState({ userName:false, email:false, phone:false, businessName:false, address:false });
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async()=>{
      try {
        const { data } = await api.get(endpoints.seller.profile);
        setData(data);
      } catch {}
    })();
  },[]);

  const saveField = async (patch) => {
    setPending(true); setMsg('');
    try {
      await api.put(endpoints.seller.updateProfile, patch);
      setData((prev)=> ({ ...prev, ...patch }));
      setEdit({ userName:false, email:false, phone:false, businessName:false, address:false });
      setMsg('Updated');
    } catch { setMsg('Update failed'); }
    finally { setPending(false); }
  };

  if (!data) return <div className="mx-auto max-w-2xl px-4 py-10">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4 text-center">Seller Profile</h2>
        <div className="grid gap-4">
          <Row label="Name" value={data.userName} editable={edit.userName} onToggle={()=>setEdit(e=>({...e, userName:!e.userName}))} onSave={(val)=>saveField({ userName: val })} pending={pending} />
          <Row label="Email" value={data.email} editable={edit.email} onToggle={()=>setEdit(e=>({...e, email:!e.email}))} onSave={(val)=>saveField({ email: val })} pending={pending} />
          <Row label="Phone" value={data.phone} editable={edit.phone} onToggle={()=>setEdit(e=>({...e, phone:!e.phone}))} onSave={(val)=>saveField({ phone: val })} pending={pending} />
          <Row label="Business Name" value={data.businessName} editable={edit.businessName} onToggle={()=>setEdit(e=>({...e, businessName:!e.businessName}))} onSave={(val)=>saveField({ businessName: val })} pending={pending} />

          <div>
            <div className="text-sm text-navy-600 mb-1">Business Address</div>
            {!edit.address ? (
              <div className="text-navy-900 font-medium">{[data.businessAddress?.street, data.businessAddress?.flatNo, data.businessAddress?.city, data.businessAddress?.state, data.businessAddress?.country, data.businessAddress?.zipCode].filter(Boolean).join(', ') || '-'}</div>
            ) : (
              <AddressEditor initial={data.businessAddress} onSave={(addr)=>saveField({ businessAddress: addr })} onCancel={()=>setEdit(e=>({...e, address:false}))} pending={pending} />
            )}
            <div className="mt-2">
              <button disabled={pending} onClick={()=>setEdit(e=>({...e, address:!e.address}))} className="px-3 py-1.5 rounded border">{edit.address? 'Cancel':'Edit'}</button>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Link to="/seller/password" className="btn-primary">Update Password</Link>
          </div>
          {msg && <div className="text-sm text-navy-700">{msg}</div>}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, editable, onToggle, onSave, pending }) {
  const [val, setVal] = useState(value || '');
  useEffect(()=>{ setVal(value || ''); }, [value]);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm text-navy-600">{label}</div>
        {!editable ? (
          <div className="text-navy-900 font-medium">{value || '-'}</div>
        ) : (
          <input value={val} onChange={(e)=>setVal(e.target.value)} className="rounded border px-3 py-2" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {!editable ? (
          <button disabled={pending} onClick={onToggle} className="px-3 py-1.5 rounded border">Edit</button>
        ) : (
          <>
            <button disabled={pending} onClick={()=>onSave(val)} className="btn-primary">Save</button>
            <button disabled={pending} onClick={onToggle} className="px-3 py-1.5 rounded border">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

function AddressEditor({ initial, onSave, onCancel, pending }) {
  const [addr, setAddr] = useState(initial || { country:'', state:'', city:'', street:'', flatNo:'', zipCode:'' });
  const change = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <input name="country" value={addr.country} onChange={change} placeholder="Country" className="rounded border px-2 py-1" />
        <input name="state" value={addr.state} onChange={change} placeholder="State" className="rounded border px-2 py-1" />
        <input name="city" value={addr.city} onChange={change} placeholder="City" className="rounded border px-2 py-1" />
        <input name="street" value={addr.street} onChange={change} placeholder="Street" className="rounded border px-2 py-1" />
        <input name="flatNo" value={addr.flatNo} onChange={change} placeholder="Flat No" className="rounded border px-2 py-1" />
        <input name="zipCode" value={addr.zipCode} onChange={change} placeholder="Zip Code" className="rounded border px-2 py-1" />
      </div>
      <div className="flex gap-2">
        <button disabled={pending} onClick={()=>onSave(addr)} className="btn-primary">Save</button>
        <button disabled={pending} onClick={onCancel} className="px-3 py-1.5 rounded border">Cancel</button>
      </div>
    </div>
  );
}

