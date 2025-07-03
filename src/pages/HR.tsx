import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users2, 
  CalendarDays, 
  UserPlus, 
  Building,
  Search,
  Eye,
  Edit,
  UserCog,
  Phone,
  Mail,
  Calendar,
  Clock,
  Plus
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
// import { getAllStaff, getHRStats } from '@/api/hr';
// import type { Staff, HRStats } from '@/api/hr';
import { toast } from 'sonner';
import HRService from '@/services/hr.service';

// Temporary types until API is properly defined
interface Staff {
  id: string;
  name: string;
  role: string;
  branch: string;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
  avatar?: string;
}

interface HRStats {
  totalStaff: number;
  onLeaveToday: number;
  newJoinsThisMonth: number;
  upcomingReviews: number;
  departmentCounts: Record<string, number>;
  branchCounts: Record<string, number>;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

const HR: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [stats, setStats] = useState<HRStats>({
    totalStaff: 0,
    onLeaveToday: 0,
    newJoinsThisMonth: 0,
    upcomingReviews: 0,
    departmentCounts: {},
    branchCounts: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadStaff();
  }, [searchTerm, branchFilter, roleFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [staffData, statsData] = await Promise.all([
        HRService.getAllStaff({ 
          search: searchTerm, 
          branch: branchFilter !== 'all' ? branchFilter : undefined, 
          role: roleFilter !== 'all' ? roleFilter : undefined, 
          status: statusFilter !== 'all' ? statusFilter : undefined 
        }),
        HRService.getHRStats()
      ]);
      setStaff(staffData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load HR data');
      console.error('Error loading HR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const staffData = await HRService.getAllStaff({ 
        search: searchTerm, 
        branch: branchFilter !== 'all' ? branchFilter : undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
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

  // Data for department distribution chart
  const departmentData = Object.entries(stats.departmentCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Data for branch distribution chart
  const branchData = Object.entries(stats.branchCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, href }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50'
    };

    const colorClass = colorClasses[color];

    const CardContentComponent = (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${colorClass}`}>
              <Icon size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link to={href}>{CardContentComponent}</Link> : CardContentComponent;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-gray-600 mt-1">Manage staff and HR operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <Clock size={16} className="mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAddStaffDialog(true)}>
            <UserPlus size={16} className="mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Staff"
          value={stats.totalStaff}
          subtitle="Active employees"
          icon={Users2}
          color="blue"
        />
        <StatsCard
          title="On Leave Today"
          value={stats.onLeaveToday}
          subtitle="Out of office"
          icon={CalendarDays}
          color="orange"
        />
        <StatsCard
          title="New Joins"
          value={stats.newJoinsThisMonth}
          subtitle="This month"
          icon={UserPlus}
          color="green"
        />
        <StatsCard
          title="Upcoming Reviews"
          value={stats.upcomingReviews}
          subtitle="Performance evaluations"
          icon={UserCog}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users2 size={20} />
              <span>Department Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                     {departmentData.map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Branch Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building size={20} />
              <span>Branch Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={branchData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Staff Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Users2 size={20} />
              <span>Staff Directory</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search staff..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="Main Branch">Main Branch</SelectItem>
                  <SelectItem value="North Branch">North Branch</SelectItem>
                  <SelectItem value="South Branch">South Branch</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <Users2 size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || branchFilter !== 'all' || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Start by adding your first staff member'
                }
              </p>
              <Button onClick={() => setShowAddStaffDialog(true)}>
                <UserPlus size={16} className="mr-2" />
                Add Staff
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[150px]">Name</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[100px]">Role</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden md:table-cell">Branch</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden lg:table-cell">Contact</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden sm:table-cell">Join Date</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[100px]">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            {member.avatar ? (
                              <img 
                                src={member.avatar} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500 md:hidden">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRoleColor(member.role)}`}
                        >
                          {member.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                        <p className="text-sm text-gray-900">{member.branch}</p>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Phone size={12} />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Mail size={12} />
                            <span className="truncate max-w-[150px]">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar size={12} />
                          <span>{new Date(member.joinDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-xs ${getStatusColor(member.status)}`}
                        >
                          {member.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/hr/staff/${member.id}`}>
                              <Eye size={12} className="sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Link>
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Edit size={12} className="sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
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

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Enter the details of the new staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input id="name" placeholder="Enter full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="branch" className="text-right">
                Branch
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Branch</SelectItem>
                  <SelectItem value="north">North Branch</SelectItem>
                  <SelectItem value="south">South Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" placeholder="Enter email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" placeholder="Enter phone number" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="joinDate" className="text-right">
                Join Date
              </Label>
              <Input id="joinDate" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStaffDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Staff added successfully!');
              setShowAddStaffDialog(false);
            }}>
              <Plus size={16} className="mr-2" />
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HR;