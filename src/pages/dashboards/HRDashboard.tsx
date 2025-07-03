import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  UserPlus,
  FileText,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const HRDashboard: React.FC = () => {
  const stats = [
    { title: "Total Employees", value: "24", icon: Users, trend: "+2 this month" },
    { title: "Present Today", value: "22", icon: CheckCircle, trend: "91.7%" },
    { title: "Leave Requests", value: "5", icon: Calendar, trend: "3 pending" },
    { title: "Payroll Amount", value: "$45,200", icon: DollarSign, trend: "This month" }
  ];

  const staff = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Dermatologist", status: "present", shift: "Morning", hours: "8h" },
    { id: 2, name: "Mike Wilson", role: "Technician", status: "present", shift: "Full Day", hours: "8h" },
    { id: 3, name: "Emma Davis", role: "Nurse", status: "on-leave", shift: "Evening", hours: "0h" },
    { id: 4, name: "John Smith", role: "Receptionist", status: "present", shift: "Morning", hours: "4h" },
  ];

  const leaveRequests = [
    { id: 1, employee: "Emma Davis", type: "Sick Leave", dates: "Jan 15-17", status: "pending" },
    { id: 2, employee: "Alex Brown", type: "Vacation", dates: "Jan 20-25", status: "approved" },
    { id: 3, employee: "Lisa Wilson", type: "Personal", dates: "Jan 18", status: "pending" },
  ];

  const payrollSummary = [
    { department: "Medical", employees: 8, amount: "$28,500" },
    { department: "Administration", employees: 6, amount: "$12,200" },
    { department: "Support", employees: 10, amount: "$4,500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
            <p className="text-gray-600">Manage staff, attendance, and payroll operations</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Payslip
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-purple-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Directory */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-600" />
                Staff Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        employee.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{employee.shift}</p>
                      <Badge 
                        variant={employee.status === 'present' ? 'default' : 'secondary'}
                        className={employee.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {employee.hours}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-orange-600" />
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{request.employee}</p>
                      <Badge 
                        variant={request.status === 'approved' ? 'default' : 'secondary'}
                        className={
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{request.type}</p>
                    <p className="text-sm font-medium">{request.dates}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
              Payroll Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {payrollSummary.map((dept, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                  <p className="text-sm text-gray-600">{dept.employees} employees</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{dept.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <UserPlus className="h-6 w-6" />
                <span>Add Employee</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Clock className="h-6 w-6" />
                <span>Attendance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Generate Payslip</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Performance Review</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;