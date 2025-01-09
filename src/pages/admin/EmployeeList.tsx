import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/store/admin/adminSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  MoreVertical,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { UserStatus } from "@/types/Enums/User.enum";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CreateEmployeeDto } from "@/types/admin.types";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EmployeeList() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: employees = [],
    metadata,
    loading,
  } = useSelector((state: RootState) => state.admin.employees);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    sortBy: "createdAt" as
      | "username"
      | "createdAt"
      | "email"
      | "fullName"
      | undefined,
    sortOrder: "desc" as "asc" | "desc",
  });

  const [newEmployee, setNewEmployee] = useState<CreateEmployeeDto>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    fullName: "",
    phone: "",
    identityNumber: "",
    dateOfBirth: undefined,
    address: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<CreateEmployeeDto | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    try {
      dispatch(getEmployees(filters));
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? "" : value,
      page: 1,
    }));
  };

  const handleSort = (
    field: "username" | "createdAt" | "email" | "fullName"
  ) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateEmployee = async () => {
    try {
      // Combine firstName and lastName to create fullName
      const employeeData = {
        ...newEmployee,
        fullName: `${newEmployee.firstName} ${newEmployee.lastName}`.trim(),
      };

      await dispatch(createEmployee(employeeData)).unwrap();
      setIsDialogOpen(false);
      dispatch(getEmployees(filters));
      setNewEmployee({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        fullName: "",
        phone: "",
        identityNumber: "",
        dateOfBirth: undefined,
        address: "",
      });
    } catch (error: any) {
      console.error("Failed to create employee:", error);
      if (Array.isArray(error?.response?.data?.message)) {
        // Handle array of error messages
        error.response.data.message.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to create employee"
        );
      }
    }
  };

  const handleEditClick = (employee: Employee) => {
    // Split fullName into firstName and lastName
    const [firstName = "", lastName = ""] = employee.fullName.split(" ");

    setEditEmployee({
      username: employee.username,
      email: employee.email,
      phone: employee.phone,
      firstName,
      lastName,
      fullName: employee.fullName,
      password: "", // Empty password as we don't want to update it by default
      identityNumber: employee.identityNumber,
      dateOfBirth: employee.dateOfBirth,
      address: employee.address,
    });
    setSelectedEmployeeId(employee.id);
    setEditDialogOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editEmployee || !selectedEmployeeId) return;

    try {
      const updateData = {
        ...editEmployee,
        fullName: `${editEmployee.firstName} ${editEmployee.lastName}`.trim(),
      };

      await dispatch(
        updateEmployee({
          id: selectedEmployeeId,
          data: updateData,
        })
      ).unwrap();

      setEditDialogOpen(false);
      dispatch(getEmployees(filters));
    } catch (error: any) {
      console.error("Failed to update employee:", error);
      if (Array.isArray(error?.response?.data?.message)) {
        error.response.data.message.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to update employee"
        );
      }
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete({ id: employee.id, name: employee.fullName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await dispatch(deleteEmployee(employeeToDelete.id)).unwrap();
      dispatch(getEmployees(filters));
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete employee:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete employee"
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employee Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 [&::backdrop]:bg-black/70">
              <DialogHeader>
                <DialogTitle>Create New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      className="bg-white"
                      value={newEmployee.firstName}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          firstName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      className="bg-white"
                      value={newEmployee.lastName}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          lastName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-white"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="bg-white"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    className="bg-white"
                    value={newEmployee.username}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-white"
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identityNumber">Identity Number</Label>
                  <Input
                    id="identityNumber"
                    className="bg-white"
                    value={newEmployee.identityNumber}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        identityNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="bg-white"
                    value={
                      newEmployee.dateOfBirth
                        ? new Date(newEmployee.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        dateOfBirth: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    className="bg-white"
                    value={newEmployee.address}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleCreateEmployee} className="w-full">
                  Create Employee
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 [&::backdrop]:bg-black/70">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            {editEmployee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">First Name *</Label>
                    <Input
                      id="editFirstName"
                      className="bg-white"
                      value={editEmployee.firstName}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          firstName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Last Name *</Label>
                    <Input
                      id="editLastName"
                      className="bg-white"
                      value={editEmployee.lastName}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          lastName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    className="bg-white"
                    value={editEmployee.email}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone *</Label>
                  <Input
                    id="editPhone"
                    type="tel"
                    className="bg-white"
                    value={editEmployee.phone}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editUsername">Username *</Label>
                  <Input
                    id="editUsername"
                    className="bg-white"
                    value={editEmployee.username}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPassword">Password *</Label>
                  <Input
                    id="editPassword"
                    type="password"
                    className="bg-white"
                    value={editEmployee.password}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editIdentityNumber">Identity Number</Label>
                  <Input
                    id="editIdentityNumber"
                    className="bg-white"
                    value={editEmployee.identityNumber}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        identityNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDateOfBirth">Date of Birth</Label>
                  <Input
                    id="editDateOfBirth"
                    type="date"
                    className="bg-white"
                    value={
                      editEmployee.dateOfBirth
                        ? new Date(editEmployee.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        dateOfBirth: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAddress">Address</Label>
                  <Input
                    id="editAddress"
                    className="bg-white"
                    value={editEmployee.address}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleUpdateEmployee} className="w-full">
                  Update Employee
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8 bg-white"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  <span>
                    {filters.status ? filters.status : "Filter Status"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuItem
                  onClick={() => handleStatusFilter("all")}
                  className="cursor-pointer"
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.values(UserStatus).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={cn(
                      "cursor-pointer",
                      filters.status === status && "bg-accent"
                    )}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).toLowerCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : employees && employees.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("fullName")}
                    >
                      Name
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.fullName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            employee.status === UserStatus.ACTIVE
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-[160px] bg-white border shadow-md"
                            style={{ backgroundColor: "white" }} // Force white background
                            sideOffset={5}
                          >
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-100 bg-white"
                              onClick={() => handleEditClick(employee)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 hover:bg-red-50 bg-white"
                              onClick={() => handleDeleteClick(employee)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {metadata && (
                <div className="mt-4 flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(metadata.page - 1)}
                          //disabled={metadata.page === 1}
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: metadata.lastPage },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={metadata.page === page}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(metadata.page + 1)}
                          // disabled={metadata.page === metadata.lastPage}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No employees found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete employee{" "}
              <span className="font-semibold">{employeeToDelete?.name}</span>?
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
