import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other staff properties
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axiosInstance.get("/admin/staff");
      setStaff(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch staff list");
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/staff/${id}`);
      toast.success("Staff member deleted successfully");
      fetchStaff();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete staff member");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Staff Management</h2>
      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteStaff(member.id)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    <FaTrash />
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
