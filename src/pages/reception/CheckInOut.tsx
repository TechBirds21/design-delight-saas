import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Search, User } from 'lucide-react';

const CheckInOut: React.FC = () => {
  const waitingPatients = [
    { id: 1, name: "Sarah Johnson", appointmentTime: "10:00 AM", arrivalTime: "09:55 AM", status: "waiting" },
    { id: 2, name: "Mike Wilson", appointmentTime: "10:30 AM", arrivalTime: "10:25 AM", status: "waiting" },
    { id: 3, name: "Emma Davis", appointmentTime: "11:00 AM", arrivalTime: "10:50 AM", status: "checked-in" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Patient Check-in / Check-out</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Check-in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter patient name or phone number" 
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <Button className="w-full" size="lg">
                <UserCheck className="h-4 w-4 mr-2" />
                Check In Patient
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">18</p>
                  <p className="text-sm text-muted-foreground">Checked In</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">6</p>
                  <p className="text-sm text-muted-foreground">Waiting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Waiting Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waitingPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Appointment: {patient.appointmentTime}</span>
                        <span>Arrived: {patient.arrivalTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={patient.status === 'checked-in' ? 'default' : 'secondary'}
                    >
                      {patient.status}
                    </Badge>
                    {patient.status === 'waiting' ? (
                      <Button size="sm">Check In</Button>
                    ) : (
                      <Button size="sm" variant="outline">Check Out</Button>
                    )}
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

export default CheckInOut;