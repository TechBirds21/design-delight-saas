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
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const ReceptionDashboard: React.FC = () => {
  const navigate = useNavigate();
  
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
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0 ml-3">
                    <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Today's Appointments */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded flex-shrink-0">
                        {apt.time}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{apt.patient}</p>
                        <p className="text-sm text-gray-600 truncate">{apt.type}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={apt.status === 'checked-in' ? 'default' : apt.status === 'waiting' ? 'secondary' : 'outline'}
                      className={`ml-2 flex-shrink-0 ${apt.status === 'checked-in' ? 'bg-green-100 text-green-800' : ''}`}
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 h-5 w-5 text-orange-600" />
                Current Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.patient}</p>
                      <p className="text-sm text-gray-600">Waiting: {item.waitTime}</p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
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
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Button variant="outline" className="h-16 lg:h-20 flex flex-col space-y-2 hover:bg-green-50 transition-colors" onClick={() => navigate('/reception/register')}>
                <UserPlus className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-sm">Patient Registration</span>
              </Button>
              <Button variant="outline" className="h-16 lg:h-20 flex flex-col space-y-2 hover:bg-blue-50 transition-colors" onClick={() => navigate('/reception/appointments')}>
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-sm">Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-16 lg:h-20 flex flex-col space-y-2 hover:bg-emerald-50 transition-colors" onClick={() => navigate('/reception/checkin')}>
                <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-sm">Check-In Patient</span>
              </Button>
              <Button variant="outline" className="h-16 lg:h-20 flex flex-col space-y-2 hover:bg-purple-50 transition-colors">
                <Phone className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-sm">Call Patient</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionDashboard;