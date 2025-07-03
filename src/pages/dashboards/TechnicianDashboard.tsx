import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Camera, 
  Activity, 
  CheckCircle,
  Upload,
  Settings,
  Clock,
  Zap
} from 'lucide-react';

const TechnicianDashboard: React.FC = () => {
  const stats = [
    { title: "Today's Procedures", value: "8", icon: Activity, trend: "+2 from yesterday" },
    { title: "Photos Captured", value: "24", icon: Camera, trend: "Progress tracking" },
    { title: "Equipment Status", value: "5/6", icon: CheckCircle, trend: "1 maintenance due" },
    { title: "Session Duration", value: "6.2h", icon: Clock, trend: "Average today" }
  ];

  const procedures = [
    { id: 1, patient: "Sarah Johnson", type: "Laser Hair Removal", area: "Face", status: "completed", time: "09:00" },
    { id: 2, patient: "Mike Wilson", type: "IPL Treatment", area: "Arms", status: "in-progress", time: "10:30" },
    { id: 3, patient: "Emma Davis", type: "Microneedling", area: "Face", status: "scheduled", time: "11:00" },
    { id: 4, patient: "John Smith", type: "Chemical Peel", area: "Face", status: "scheduled", time: "14:00" },
  ];

  const equipment = [
    { id: 1, name: "Laser System A", model: "LS-2000", status: "operational", lastMaintenance: "Jan 10", nextDue: "Feb 10" },
    { id: 2, name: "IPL Device B", model: "IPL-Pro", status: "operational", lastMaintenance: "Jan 8", nextDue: "Feb 8" },
    { id: 3, name: "Microneedle Unit", model: "MN-500", status: "maintenance", lastMaintenance: "Dec 15", nextDue: "Overdue" },
  ];

  const photoSessions = [
    { id: 1, patient: "Sarah Johnson", type: "Before/After", session: "Session 3", photos: 8, date: "Today" },
    { id: 2, patient: "Mike Wilson", type: "Progress", session: "Session 1", photos: 6, date: "Today" },
    { id: 3, patient: "Emma Davis", type: "Documentation", session: "Initial", photos: 4, date: "Yesterday" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
            <p className="text-gray-600">Manage procedures, photo documentation, and equipment</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Equipment Setup
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
                    <p className="text-sm text-orange-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Procedures */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-orange-600" />
                Today's Procedures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedures.map((procedure) => (
                  <div key={procedure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {procedure.time}
                      </div>
                      <div>
                        <p className="font-medium">{procedure.patient}</p>
                        <p className="text-sm text-gray-600">{procedure.type} • {procedure.area}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        procedure.status === 'completed' ? 'default' : 
                        procedure.status === 'in-progress' ? 'secondary' : 
                        'outline'
                      }
                      className={
                        procedure.status === 'completed' ? 'bg-green-100 text-green-800' :
                        procedure.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''
                      }
                    >
                      {procedure.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="mr-2 h-5 w-5 text-blue-600" />
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((device) => (
                  <div key={device.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{device.name}</p>
                      <Badge 
                        variant={device.status === 'operational' ? 'default' : 'destructive'}
                        className={device.status === 'operational' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {device.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{device.model}</p>
                    <p className="text-xs text-gray-500">Next maintenance: {device.nextDue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Manager */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-purple-600" />
              Photo Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {photoSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Camera className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{session.patient}</p>
                      <p className="text-sm text-gray-600">{session.type} • {session.session}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{session.photos} photos</p>
                    <p className="text-xs text-gray-500">{session.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Protocols */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Device Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Laser Hair Removal</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Power: 12-15J/cm²</li>
                  <li>• Pulse: 30ms</li>
                  <li>• Cooling: Pre/Post</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">IPL Treatment</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Filter: 530-1200nm</li>
                  <li>• Fluence: 8-12J/cm²</li>
                  <li>• Delay: 20ms</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Microneedling</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Depth: 0.5-2.5mm</li>
                  <li>• Speed: Medium</li>
                  <li>• Patterns: Cross-hatch</li>
                </ul>
              </div>
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
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Upload className="h-6 w-6" />
                <span>Upload Photos</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Activity className="h-6 w-6" />
                <span>Start Session</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>Device Setup</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span>Maintenance Log</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianDashboard;