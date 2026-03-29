export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-(--card-background) shadow">
          <p className="text-(--secondary-text)">Users</p>
          <h2 className="text-xl font-bold">1,200</h2>
        </div>

        <div className="p-4 rounded-xl bg-(--card-background) shadow">
          <p className="text-(--secondary-text)">Products</p>
          <h2 className="text-xl font-bold">850</h2>
        </div>

        <div className="p-4 rounded-xl bg-(--card-background) shadow">
          <p className="text-(--secondary-text)">Orders</p>
          <h2 className="text-xl font-bold">320</h2>
        </div>

        <div className="p-4 rounded-xl bg-(--card-background) shadow">
          <p className="text-(--secondary-text)">Reports</p>
          <h2 className="text-xl font-bold text-(--error)">12</h2>
        </div>
      </div>
    </div>
  );
}