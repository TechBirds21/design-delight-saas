import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Shield, 
  Building2,
  UserPlus,
  Database,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: "Total Users", value: "48", icon: Users, trend: "+5 this week" },
    { title: "Active Sessions", value: "32", icon: Activity, trend: "Real-time" },
    { title: "System Health", value: "99.9%", icon: Database, trend: "Excellent" },
    { title: "Branches", value: "3", icon: Building2, trend: "Multi-location" }
  ];

  const users = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", status: "active", lastLogin: "2 min ago", branch: "Main" },
    { id: 2, name: "Mike Wilson", role: "Technician", status: "active", lastLogin: "5 min ago", branch: "Downtown" },
    { id: 3, name: "Emma Davis", role: "Reception", status: "inactive", lastLogin: "1 hour ago", branch: "Main" },
    { id: 4, name: "John Smith", role: "Admin", status: "active", lastLogin: "Just now", branch: "Main" },
  ];

  const systemLogs = [
    { id: 1, action: "User Login", user: "Dr. Sarah Johnson", time: "2 min ago", status: "success" },
    { id: 2, action: "Data Backup", user: "System", time: "1 hour ago", status: "success" },
    { id: 3, action: "Failed Login", user: "Unknown", time: "2 hours ago", status: "warning" },
    { id: 4, action: "Module Update", user: "Admin", time: "3 hours ago", status: "success" },
  ];

  const branches = [
    { id: 1, name: "Main Branch", location: "Downtown Medical Center", users: 25, status: "active" },
    { id: 2, name: "North Branch", location: "North Medical Plaza", users: 15, status: "active" },
    { id: 3, name: "South Branch", location: "South Wellness Center", users: 8, status: "maintenance" },
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System administration and multi-branch management</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-gray-600 hover:bg-gray-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
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
                    <p className="text-sm text-gray-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.role} • {user.branch}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{user.lastLogin}</p>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-orange-600" />
                System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.user} • {log.time}</p>
                    </div>
                    <Badge 
                      variant={
                        log.status === 'success' ? 'default' : 
                        log.status === 'warning' ? 'secondary' : 
                        'destructive'
                      }
                      className={
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Multi-Branch Management */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-purple-600" />
              Branch Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <div key={branch.id} className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                    <Badge 
                      variant={branch.status === 'active' ? 'default' : 'secondary'}
                      className={
                        branch.status === 'active' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {branch.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{branch.location}</p>
                  <p className="text-lg font-bold text-purple-600">{branch.users} users</p>
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
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/users')}>
                <UserPlus className="h-6 w-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/roles')}>
                <Shield className="h-6 w-6" />
                <span>Manage Roles</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/settings')}>
                <Settings className="h-6 w-6" />
                <span>System Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/branches')}>
                <Building2 className="h-6 w-6" />
                <span>Branch Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;