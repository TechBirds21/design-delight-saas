import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Calendar, 
  ClipboardList,
  TestTube,
  Bell,
  Clock,
  Pill,
  Camera,
  MessageSquare,
  Filter,
  Plus,
  Video,
  Upload,
  BarChart3,
  User,
  AlertCircle,
  CheckCircle,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DoctorService from '@/services/doctor.service';
import { Appointment, DoctorStats } from '@/api/doctor';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [appointmentsData, statsData] = await Promise.all([
        DoctorService.getDoctorAppointments(),
        DoctorService.getDoctorStats()
      ]);
      setAppointments(appointmentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const notifications = [
    { id: 1, type: 'urgent', title: 'Lab Results Ready', message: 'CBC results for Sarah Johnson', time: '2 min ago' },
    { id: 2, type: 'appointment', title: 'New Appointment Request', message: 'Michael Brown - Skin consultation', time: '15 min ago' },
    { id: 3, type: 'prescription', title: 'Prescription Approved', message: 'Retinoid cream for Emma Davis', time: '1 hour ago' },
  ];

  const labResults = [
    { id: 1, patient: 'Sarah Johnson', test: 'Complete Blood Count', status: 'abnormal', date: 'Today' },
    { id: 2, patient: 'Mike Wilson', test: 'Lipid Panel', status: 'normal', date: 'Yesterday' },
    { id: 3, patient: 'Emma Davis', test: 'Thyroid Function', status: 'pending', date: '2 days ago' },
  ];

  const prescriptions = [
    { id: 1, patient: 'Sarah Johnson', medication: 'Tretinoin 0.1%', dosage: 'Apply nightly', status: 'active' },
    { id: 2, patient: 'Mike Wilson', medication: 'Hydrocortisone 2.5%', dosage: 'Twice daily', status: 'completed' },
    { id: 3, patient: 'Emma Davis', medication: 'Clindamycin gel', dosage: 'Morning application', status: 'pending' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600">Complete patient care management system</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <Badge variant="destructive" className="ml-2">3</Badge>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Start Consultation
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="prescriptions">eRx</TabsTrigger>
            <TabsTrigger value="lab">Lab Orders</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="messaging">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.todayAppointments || 0}</p>
                      <p className="text-sm text-emerald-600 mt-1">+12% from yesterday</p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Prescriptions</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                      <p className="text-sm text-blue-600 mt-1">2 urgent reviews</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lab Orders</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                      <p className="text-sm text-purple-600 mt-1">3 results pending</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <TestTube className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Patients</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.assignedPatients || 0}</p>
                      <p className="text-sm text-orange-600 mt-1">Active care</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-emerald-600" />
                      Today's Schedule
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAppointments.slice(0, 6).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="font-mono text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                            {appointment.time}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.notes}</p>
                            <p className="text-xs text-gray-500">Age: {appointment.age} • {appointment.phone}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge 
                            variant={
                              appointment.status === 'completed' ? 'default' : 
                              appointment.status === 'in-progress' ? 'secondary' : 
                              'outline'
                            }
                            className={
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications & Alerts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-orange-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            notification.type === 'urgent' ? 'bg-red-100' :
                            notification.type === 'appointment' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {notification.type === 'urgent' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
                             notification.type === 'appointment' ? <Calendar className="h-4 w-4 text-blue-600" /> :
                             <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Toolbar */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-emerald-50" onClick={() => navigate('/doctor/emr')}>
                    <ClipboardList className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm">SOAP Notes</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-blue-50">
                    <Pill className="h-6 w-6 text-blue-600" />
                    <span className="text-sm">Prescribe</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-purple-50">
                    <TestTube className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Lab Orders</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-orange-50">
                    <Camera className="h-6 w-6 text-orange-600" />
                    <span className="text-sm">Upload Image</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-green-50" onClick={() => navigate('/doctor/patients')}>
                    <User className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Patient Records</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-indigo-50" onClick={() => navigate('/doctor/messages')}>
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-pink-50" onClick={() => navigate('/doctor/teleconsult')}>
                    <Video className="h-6 w-6 text-pink-600" />
                    <span className="text-sm">Teleconsult</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:bg-yellow-50">
                    <CheckCircle className="h-6 w-6 text-yellow-600" />
                    <span className="text-sm">End Visit</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content placeholders */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Appointment Management</CardTitle>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Search patients..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                            {appointment.time}
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.notes}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{appointment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Patient Records & EMR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Patient management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>e-Prescription Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{prescription.patient}</p>
                          <p className="text-sm text-gray-600">{prescription.medication}</p>
                          <p className="text-xs text-gray-500">{prescription.dosage}</p>
                        </div>
                        <Badge variant="outline">{prescription.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Lab Orders & Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labResults.map((result) => (
                    <div key={result.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{result.patient}</p>
                          <p className="text-sm text-gray-600">{result.test}</p>
                          <p className="text-xs text-gray-500">{result.date}</p>
                        </div>
                        <Badge 
                          variant={result.status === 'normal' ? 'default' : result.status === 'abnormal' ? 'destructive' : 'secondary'}
                        >
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imaging">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Imaging & Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Photo management system coming soon...</p>
                  <Button className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messaging">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Messaging & Teleconsult</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Secure messaging system coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Analytics & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Visit Volume</p>
                      <p className="text-2xl font-bold text-blue-600">142</p>
                      <p className="text-sm text-gray-600">Last 30 days</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">Avg Consultation</p>
                      <p className="text-2xl font-bold text-green-600">24min</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">No-show Rate</p>
                      <p className="text-2xl font-bold text-purple-600">5.2%</p>
                      <p className="text-sm text-gray-600">Last 7 days</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;