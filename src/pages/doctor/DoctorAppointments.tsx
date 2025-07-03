import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Calendar,
  Clock,
  Search,
  Plus,
  Phone,
  Video,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Appointment {
  id: string;
  time: string;
  patient: {
    name: string;
    phone: string;
    id: string;
  };
  type: 'Consultation' | 'Follow-up' | 'Procedure' | 'Teleconsult';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  room: string;
  notes?: string;
  duration: number;
}

const DoctorAppointments: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [view, setView] = useState<'calendar' | 'list'>('list');

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      time: '09:00 AM',
      patient: { name: 'Sarah Johnson', phone: '+1 234-567-8901', id: 'P001' },
      type: 'Consultation',
      status: 'confirmed',
      room: 'Room 101',
      duration: 30,
      notes: 'First visit - skin condition assessment'
    },
    {
      id: '2',
      time: '10:30 AM',
      patient: { name: 'Mike Chen', phone: '+1 234-567-8902', id: 'P002' },
      type: 'Follow-up',
      status: 'confirmed',
      room: 'Room 102',
      duration: 20,
      notes: 'Post-treatment follow-up'
    },
    {
      id: '3',
      time: '02:00 PM',
      patient: { name: 'Lisa Park', phone: '+1 234-567-8903', id: 'P003' },
      type: 'Procedure',
      status: 'pending',
      room: 'Procedure Room',
      duration: 60,
      notes: 'Laser treatment session'
    },
    {
      id: '4',
      time: '03:30 PM',
      patient: { name: 'David Brown', phone: '+1 234-567-8904', id: 'P004' },
      type: 'Teleconsult',
      status: 'confirmed',
      room: 'Virtual',
      duration: 15,
      notes: 'Prescription review'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      'no-show': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.confirmed;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Consultation': 'bg-blue-100 text-blue-800',
      'Follow-up': 'bg-green-100 text-green-800',
      'Procedure': 'bg-purple-100 text-purple-800',
      'Teleconsult': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || colors['Consultation'];
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.patient.phone.includes(searchTerm) ||
                         apt.patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStartAppointment = (appointmentId: string) => {
    // Navigate to EMR or start teleconsult
    console.log('Starting appointment:', appointmentId);
  };

  const handleReschedule = (appointmentId: string) => {
    // Open reschedule modal
    console.log('Rescheduling appointment:', appointmentId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments & Schedule</h1>
            <p className="text-muted-foreground">{formatDate(currentDate)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar size={16} className="mr-2" />
              Today
            </Button>
            <Button size="sm">
              <Plus size={16} className="mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
        {/* Filters and Search */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
                  <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm font-medium">{formatDate(currentDate)}</span>
                  <Button variant="outline" size="sm">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search patient, phone, or ID..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Procedure">Procedure</SelectItem>
                    <SelectItem value="Teleconsult">Teleconsult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Tabs value={view} className="space-y-6">
          <TabsContent value="list" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No appointments found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'No appointments scheduled for today'
                    }
                  </p>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="animate-fade-in hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="flex items-center space-x-1 text-lg font-bold text-foreground">
                              <Clock size={16} />
                              <span>{appointment.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{appointment.duration} min</p>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-foreground">{appointment.patient.name}</h3>
                              <Badge variant="outline" className={`text-xs ${getTypeColor(appointment.type)}`}>
                                {appointment.type}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <User size={14} />
                                <span>ID: {appointment.patient.id}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Phone size={14} />
                                <span>{appointment.patient.phone}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin size={14} />
                                <span>{appointment.room}</span>
                              </span>
                            </div>
                            
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone size={14} className="mr-1" />
                            Call
                          </Button>
                          
                          {appointment.type === 'Teleconsult' ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Video size={14} className="mr-1" />
                              Join Video
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleStartAppointment(appointment.id)}
                            >
                              Start Consultation
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReschedule(appointment.id)}
                          >
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Calendar View</h3>
                  <p className="text-muted-foreground">Interactive calendar with drag & drop scheduling coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{filteredAppointments.filter(a => a.status === 'confirmed').length}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{filteredAppointments.filter(a => a.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{filteredAppointments.filter(a => a.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{filteredAppointments.filter(a => a.type === 'Teleconsult').length}</p>
                <p className="text-sm text-muted-foreground">Virtual</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;