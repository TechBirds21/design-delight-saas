import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

const EquipmentManagement: React.FC = () => {
  const equipment = [
    { id: 1, name: "Laser Machine A", type: "Laser", status: "operational", lastMaintenance: "2024-01-10", nextMaintenance: "2024-02-10", location: "Room 1" },
    { id: 2, name: "IPL Device", type: "IPL", status: "maintenance", lastMaintenance: "2024-01-05", nextMaintenance: "2024-01-20", location: "Room 2" },
    { id: 3, name: "RF Machine", type: "Radio Frequency", status: "operational", lastMaintenance: "2024-01-12", nextMaintenance: "2024-02-12", location: "Room 1" },
    { id: 4, name: "Coolsculpting Unit", type: "Cryolipolysis", status: "calibration", lastMaintenance: "2024-01-08", nextMaintenance: "2024-01-25", location: "Room 3" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Equipment Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Equipment</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Settings className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operational</p>
                  <p className="text-3xl font-bold text-green-600">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
                <Wrench className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                  <p className="text-3xl font-bold text-red-600">1</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.type} • {item.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Last Service</p>
                      <p className="text-sm">{item.lastMaintenance}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Next Service</p>
                      <p className="text-sm">{item.nextMaintenance}</p>
                    </div>
                    <Badge 
                      variant={
                        item.status === 'operational' ? 'default' : 
                        item.status === 'maintenance' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Service Log</Button>
                      <Button size="sm">Manage</Button>
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

export default EquipmentManagement;