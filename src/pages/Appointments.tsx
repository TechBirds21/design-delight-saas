import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin
} from 'lucide-react';

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  duration: number;
  type: string;
  status: 'confirmed' | 'pending' | 'urgent';
  room: string;
  notes: string;
}

const Appointments: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const appointments: Appointment[] = [
    {
      id: 1,
      patient: 'John Doe',
      doctor: 'Dr. Sarah Smith',
      time: '09:00 AM',
      duration: 30,
      type: 'Consultation',
      status: 'confirmed',
      room: 'Room 101',
      notes: 'Regular checkup'
    },
    {
      id: 2,
      patient: 'Jane Wilson',
      doctor: 'Dr. Michael Johnson',
      time: '10:30 AM',
      duration: 45,
      type: 'Follow-up',
      status: 'pending',
      room: 'Room 102',
      notes: 'Post-surgery follow-up'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      doctor: 'Dr. Emily Davis',
      time: '11:15 AM',
      duration: 60,
      type: 'Specialist',
      status: 'confirmed',
      room: 'Room 201',
      notes: 'Cardiology consultation'
    },
    {
      id: 4,
      patient: 'Sarah Johnson',
      doctor: 'Dr. Robert Wilson',
      time: '02:00 PM',
      duration: 30,
      type: 'Emergency',
      status: 'urgent',
      room: 'ER-1',
      notes: 'Chest pain evaluation'
    },
    {
      id: 5,
      patient: 'David Lee',
      doctor: 'Dr. Sarah Smith',
      time: '03:30 PM',
      duration: 30,
      type: 'Consultation',
      status: 'confirmed',
      room: 'Room 101',
      notes: 'Diabetes management'
    },
    {
      id: 6,
      patient: 'Lisa Chen',
      doctor: 'Dr. Michael Johnson',
      time: '04:00 PM',
      duration: 45,
      type: 'Therapy',
      status: 'pending',
      room: 'Room 301',
      notes: 'Physical therapy session'
    }
  ];

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status];
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Consultation': 'bg-blue-50 text-blue-700',
      'Follow-up': 'bg-green-50 text-green-700',
      'Emergency': 'bg-red-50 text-red-700',
      'Specialist': 'bg-purple-50 text-purple-700',
      'Therapy': 'bg-orange-50 text-orange-700'
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Schedule and manage patient appointments</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDate(currentDate)}
              </h2>
              <p className="text-sm text-gray-500">
                {appointments.length} appointments scheduled
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate(1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
            <p className="text-sm text-gray-600">Total Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'urgent').length}
            </p>
            <p className="text-sm text-gray-600">Urgent</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock size={20} />
                <span>Today's Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.duration}min</p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTypeColor(appointment.type)}`}
                          >
                            {appointment.type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{appointment.doctor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{appointment.room}</span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Plus size={16} className="mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar size={16} className="mr-2" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users size={16} className="mr-2" />
                Patient List
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock size={16} className="mr-2" />
                Time Slots
              </Button>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map((slot) => {
                  const isBooked = appointments.some(apt => apt.time === slot);
                  return (
                    <Button
                      key={slot}
                      variant={isBooked ? "outline" : "ghost"}
                      size="sm"
                      className={`text-xs ${
                        isBooked 
                          ? 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed' 
                          : 'hover:bg-green-50 hover:text-green-700'
                      }`}
                      disabled={isBooked}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Doctors on Duty */}
          <Card>
            <CardHeader>
              <CardTitle>Doctors on Duty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Dr. Sarah Smith', 'Dr. Michael Johnson', 'Dr. Emily Davis', 'Dr. Robert Wilson'].map((doctor) => (
                  <div key={doctor} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{doctor}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;