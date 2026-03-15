import { useEffect, useState } from 'react';
import { api, endpoints } from '../../services/api.js';

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(endpoints.admin.profile);
        setProfile(data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load profile');
      }
    })();
  }, []);

  if (error) return <div className="mx-auto max-w-xl px-4 py-10"><div className="card p-6 text-peach-700">{error}</div></div>;
  if (!profile) return <div className="mx-auto max-w-xl px-4 py-10"><div className="card p-6">Loading...</div></div>;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="card p-6">
        <h2 className="font-semibold text-navy-800 mb-4 text-center">Admin Profile</h2>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-navy-600">Name</span>
            <span className="text-navy-900 font-medium">{profile.userName || '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-navy-600">Email</span>
            <span className="text-navy-900 font-medium">{profile.email || '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-navy-600">Role</span>
            <span className="text-navy-900 font-medium">{profile.role || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
