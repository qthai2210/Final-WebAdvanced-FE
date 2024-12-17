import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchEmployees, deleteEmployee } from "@/store/admin/adminSlice";
import { Employee } from "@/types/admin.types";
import { UpdateEmployeeDialog } from "./UpdateEmployeeDialog";

export default function StaffManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector(
    (state: RootState) => state.admin
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDeleteStaff = async (id: string) => {
    dispatch(deleteEmployee(id));
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            {employees.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteStaff(member.id)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleEditClick(member)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateEmployeeDialog
        employee={editingEmployee}
        isOpen={isEditModalOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
