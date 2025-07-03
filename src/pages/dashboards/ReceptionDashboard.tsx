import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  UserPlus,
  CheckCircle,
  Phone
} from 'lucide-react';

const ReceptionDashboard: React.FC = () => {
  const stats = [
    { title: "Today's Appointments", value: "24", icon: Calendar, trend: "+12%" },
    { title: "Checked In", value: "18", icon: CheckCircle, trend: "+8%" },
    { title: "Waiting", value: "6", icon: Clock, trend: "-2%" },
    { title: "New Patients", value: "3", icon: UserPlus, trend: "+15%" }
  ];

  const appointments = [
    { id: 1, time: "09:00", patient: "Sarah Johnson", type: "Consultation", status: "checked-in" },
    { id: 2, time: "09:30", patient: "Mike Wilson", type: "Follow-up", status: "waiting" },
    { id: 3, time: "10:00", patient: "Emma Davis", type: "Treatment", status: "scheduled" },
    { id: 4, time: "10:30", patient: "John Smith", type: "Consultation", status: "scheduled" },
  ];

  const queue = [
    { id: 1, patient: "Sarah Johnson", waitTime: "5 min", priority: "Normal" },
    { id: 2, patient: "Mike Wilson", waitTime: "12 min", priority: "Urgent" },
    { id: 3, patient: "Emma Davis", waitTime: "8 min", priority: "Normal" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
            <p className="text-gray-600">Manage appointments, patients, and front desk operations</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="mr-2 h-4 w-4" />
              New Patient
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
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
                    <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {apt.time}
                      </div>
                      <div>
                        <p className="font-medium">{apt.patient}</p>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={apt.status === 'checked-in' ? 'default' : apt.status === 'waiting' ? 'secondary' : 'outline'}
                      className={apt.status === 'checked-in' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Queue Management */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-600" />
                Current Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.patient}</p>
                      <p className="text-sm text-gray-600">Waiting: {item.waitTime}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={item.priority === 'Urgent' ? 'destructive' : 'outline'}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <UserPlus className="h-6 w-6" />
                <span>Patient Registration</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span>Check-In Patient</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Phone className="h-6 w-6" />
                <span>Call Patient</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionDashboard;