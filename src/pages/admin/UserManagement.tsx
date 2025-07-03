import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Search, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
  const users = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", status: "active", lastLogin: "2 min ago", email: "sarah@clinic.com" },
    { id: 2, name: "Mike Wilson", role: "Technician", status: "active", lastLogin: "5 min ago", email: "mike@clinic.com" },
    { id: 3, name: "Emma Davis", role: "Reception", status: "inactive", lastLogin: "1 hour ago", email: "emma@clinic.com" },
    { id: 4, name: "John Smith", role: "Admin", status: "active", lastLogin: "Just now", email: "john@clinic.com" },
    { id: 5, name: "Lisa Brown", role: "HR", status: "active", lastLogin: "30 min ago", email: "lisa@clinic.com" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by name, email, or role..." 
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Role</p>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="text-sm">{user.lastLogin}</p>
                    </div>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'secondary'}
                    >
                      {user.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Permissions
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;