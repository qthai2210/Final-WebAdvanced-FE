import { Link, Outlet, useLocation } from "react-router-dom";

// const StatCard = ({
//   title,
//   value,
//   icon: Icon,
// }: {
//   title: string;
//   value: number | string;
//   icon: any;
// }) => (
//   <div className="bg-white p-6 rounded-lg shadow-md">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-gray-500 text-sm">{title}</p>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//       <Icon className="text-3xl text-blue-500" />
//     </div>
//   </div>
// );

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <nav className="mt-4">
            <Link
              to="/admin"
              className={`block px-4 py-2 hover:bg-blue-50 ${
                location.pathname === "/admin" ? "bg-blue-100" : ""
              }`}
            >
              Overview
            </Link>
            <Link
              to="/admin/staff"
              className={`block px-4 py-2 hover:bg-blue-50 ${
                location.pathname === "/admin/staff" ? "bg-blue-100" : ""
              }`}
            >
              Staff Management
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
