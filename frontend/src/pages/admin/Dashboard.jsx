export default function AdminDashboard() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="card p-4">
        <div className="text-sm text-navy-600">Quick Actions</div>
        <ul className="mt-2 list-disc list-inside text-navy-800">
          <li>Create category</li>
          <li>View all lists</li>
        </ul>
      </div>
      <div className="card p-4">Customers overview</div>
      <div className="card p-4">Orders overview</div>
    </div>
  );
}

