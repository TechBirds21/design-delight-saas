import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users2, 
  Search,
  Filter,
  Eye,
  Edit,
  
  Key,
  Download,
  Plus,
  Mail,
  Phone,
  Calendar,
  Building
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import HRService from '@/services/hr.service';
import { Staff } from '@/api/hr';
import { toast } from 'sonner';

const EmployeeDirectory: React.FC = () => {
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, roleFilter, statusFilter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await HRService.getAllStaff();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.phone.includes(term) ||
        emp.employmentDetails?.employeeId.toLowerCase().includes(term)
      );
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      'on-leave': 'bg-blue-100 text-blue-800 border-blue-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      terminated: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Doctor: 'bg-blue-50 text-blue-700',
      Nurse: 'bg-green-50 text-green-700',
      Technician: 'bg-purple-50 text-purple-700',
      Receptionist: 'bg-pink-50 text-pink-700',
      Manager: 'bg-orange-50 text-orange-700',
      Admin: 'bg-gray-50 text-gray-700'
    };
    return colors[role] || 'bg-gray-50 text-gray-700';
  };

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleBulkStatusChange = (newStatus: string) => {
    // In a real app, this would update the status in the database
    console.log('Updating status to:', newStatus);
    toast.success(`Status updated for ${selectedEmployees.length} employees`);
    setSelectedEmployees([]);
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download the CSV
    console.log('Exporting data for', filteredEmployees.length, 'employees');
    toast.success('Employee data exported successfully');
  };

  const departments = [...new Set(employees.map(emp => emp.department))];
  const roles = [...new Set(employees.map(emp => emp.role))];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employee Directory</h1>
            <p className="text-muted-foreground">Manage your workforce and employee information</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button asChild size="sm">
              <Link to="/hr/employees/new">
                <Plus size={16} className="mr-2" />
                Add Employee
              </Link>
            </Button>
          </div>
        </div>
        {/* Search and Filters */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email, phone, or employee ID..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
              </div>

              {/* Filter Controls */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Department</label>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {selectedEmployees.length} employee(s) selected
                </p>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Employee Status</DialogTitle>
                        <DialogDescription>
                          Select a new status for the selected employees.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Select onValueChange={handleBulkStatusChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on-leave">On Leave</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    Export Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employee Table */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users2 size={20} />
                <span>Employees ({filteredEmployees.length})</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users2 size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || departmentFilter !== 'all' || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start by adding your first employee'
                  }
                </p>
                <Button asChild>
                  <Link to="/hr/employees/new">
                    <Plus size={16} className="mr-2" />
                    Add Employee
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-foreground w-12">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-foreground min-w-[200px]">Employee</th>
                      <th className="text-left py-3 px-2 font-medium text-foreground min-w-[120px]">Role</th>
                      <th className="text-left py-3 px-2 font-medium text-foreground hidden md:table-cell">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-foreground hidden lg:table-cell">Contact</th>
                      <th className="text-left py-3 px-2 font-medium text-foreground hidden sm:table-cell">Join Date</th>
                      <th className="text-left py-3 px-2 font-medium text-foreground min-w-[100px]">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-foreground min-w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <Checkbox 
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={() => handleSelectEmployee(employee.id)}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                              {employee.avatar ? (
                                <img 
                                  src={employee.avatar} 
                                  alt={employee.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                                  {employee.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {employee.employmentDetails?.employeeId || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRoleColor(employee.role)}`}
                          >
                            {employee.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <div className="flex items-center space-x-1 text-sm text-foreground">
                            <Building size={12} />
                            <span>{employee.department}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Phone size={12} />
                              <span>{employee.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Mail size={12} />
                              <span className="truncate max-w-[150px]">{employee.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar size={12} />
                            <span>{new Date(employee.joinDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge 
                            variant="outline" 
                            className={`capitalize text-xs ${getStatusColor(employee.status)}`}
                          >
                            {employee.status.replace('-', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-1">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/hr/employees/${employee.id}`}>
                                <Eye size={12} className="mr-1" />
                                <span className="hidden sm:inline">View</span>
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit size={12} className="mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Key size={12} className="mr-1" />
                                  <span className="hidden sm:inline">Reset</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reset Password</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to reset the password for {employee.name}?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button onClick={() => toast.success('Password reset email sent')}>
                                    Reset Password
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDirectory;