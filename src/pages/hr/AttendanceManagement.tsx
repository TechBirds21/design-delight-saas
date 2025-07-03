import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

const AttendanceManagement: React.FC = () => {
  const attendanceData = [
    { id: 1, name: "Dr. Sarah Johnson", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "present", hours: "9h" },
    { id: 2, name: "Mike Wilson", checkIn: "09:15 AM", checkOut: "-", status: "present", hours: "6h 45m" },
    { id: 3, name: "Emma Davis", checkIn: "-", checkOut: "-", status: "absent", hours: "0h" },
    { id: 4, name: "John Smith", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "present", hours: "8h 45m" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Attendance Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                  <p className="text-3xl font-bold text-green-600">15</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
                  <p className="text-3xl font-bold text-red-600">3</p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                  <p className="text-3xl font-bold text-orange-600">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceData.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{record.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Working hours: {record.hours}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Check In</p>
                      <p className="font-medium">{record.checkIn}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Check Out</p>
                      <p className="font-medium">{record.checkOut}</p>
                    </div>
                    <Badge 
                      variant={record.status === 'present' ? 'default' : 'destructive'}
                    >
                      {record.status}
                    </Badge>
                    <Button size="sm" variant="outline">View Details</Button>
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

export default AttendanceManagement;