import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateEmployee } from "@/store/admin/adminSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Employee } from "@/types/admin.types";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface UpdateEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEmployeeDialog({
  employee,
  isOpen,
  onClose,
}: UpdateEmployeeDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username,
        email: employee.email,
        role: employee.role,
      });
    }
  }, [employee]);

  const handleUpdateEmployee = async () => {
    if (!employee) return;

    await dispatch(
      updateEmployee({
        id: employee.id,
        data: formData,
      })
    );

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border-0">
        <DialogHeader className="space-y-3 pb-4 border-b dark:border-gray-700">
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Employee
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make changes to employee information here.
          </p>
        </DialogHeader>
        <motion.div
          className="space-y-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </motion.div>
        <DialogFooter className="pt-4 border-t dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
