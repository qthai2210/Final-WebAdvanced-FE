import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { DashboardStats as Stats } from "../../types/types";
import { FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: any;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon className="text-3xl text-blue-500" />
    </div>
  </div>
);

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Users" value={stats.totalUsers} icon={FaUsers} />
      <StatCard title="Active Users" value={stats.activeUsers} icon={FaUsers} />
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={FaShoppingCart}
      />
      <StatCard
        title="Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        icon={FaChartLine}
      />
    </div>
  );
}
