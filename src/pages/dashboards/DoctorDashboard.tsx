import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  ClipboardList,
  FileText,
  TestTube,
  Activity
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const stats = [
    { title: "Today's Patients", value: "12", icon: Users, trend: "+8%" },
    { title: "Appointments", value: "15", icon: Calendar, trend: "+12%" },
    { title: "Pending Reports", value: "3", icon: FileText, trend: "-5%" },
    { title: "Lab Orders", value: "7", icon: TestTube, trend: "+18%" }
  ];

  const patients = [
    { id: 1, name: "Sarah Johnson", time: "09:00", type: "Follow-up", condition: "Acne Treatment", status: "completed" },
    { id: 2, name: "Mike Wilson", time: "09:30", type: "Consultation", condition: "Skin Screening", status: "in-progress" },
    { id: 3, name: "Emma Davis", time: "10:00", type: "Treatment", condition: "Laser Therapy", status: "scheduled" },
    { id: 4, name: "John Smith", time: "10:30", type: "Check-up", condition: "Post Treatment", status: "scheduled" },
  ];

  const recentNotes = [
    { id: 1, patient: "Sarah Johnson", date: "Today", type: "SOAP Note", summary: "Patient responding well to treatment..." },
    { id: 2, patient: "Mike Wilson", date: "Yesterday", type: "Prescription", summary: "Prescribed retinoid cream for acne..." },
    { id: 3, patient: "Emma Davis", date: "2 days ago", type: "Lab Order", summary: "Ordered skin biopsy for suspicious lesion..." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600">Manage patients, treatments, and medical records</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <ClipboardList className="mr-2 h-4 w-4" />
              New SOAP Note
            </Button>
            <Button variant="outline">
              <TestTube className="mr-2 h-4 w-4" />
              Lab Order
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
                    <p className="text-sm text-emerald-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-emerald-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                        {patient.time}
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{patient.type}</p>
                      <Badge 
                        variant={
                          patient.status === 'completed' ? 'default' : 
                          patient.status === 'in-progress' ? 'secondary' : 
                          'outline'
                        }
                        className={
                          patient.status === 'completed' ? 'bg-green-100 text-green-800' :
                          patient.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Recent Notes & Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{note.patient}</p>
                      <Badge variant="outline">{note.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{note.summary}</p>
                    <p className="text-xs text-gray-500">{note.date}</p>
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
                <ClipboardList className="h-6 w-6" />
                <span>SOAP Notes</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Prescriptions</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <TestTube className="h-6 w-6" />
                <span>Lab Orders</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Activity className="h-6 w-6" />
                <span>Patient Records</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;