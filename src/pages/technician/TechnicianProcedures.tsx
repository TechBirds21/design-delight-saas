import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Clock, User, CheckCircle } from 'lucide-react';

const TechnicianProcedures: React.FC = () => {
  const procedures = [
    { id: 1, patient: "Sarah Johnson", procedure: "Laser Treatment", time: "10:00 AM", duration: "45 min", status: "in-progress", room: "Room 1" },
    { id: 2, patient: "Mike Wilson", procedure: "IPL Session", time: "11:30 AM", duration: "30 min", status: "scheduled", room: "Room 2" },
    { id: 3, patient: "Emma Davis", procedure: "RF Treatment", time: "02:00 PM", duration: "60 min", status: "scheduled", room: "Room 1" },
    { id: 4, patient: "John Smith", procedure: "Coolsculpting", time: "03:30 PM", duration: "90 min", status: "scheduled", room: "Room 3" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <Wrench className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Today's Procedures</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Today</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <Wrench className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">2</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">4</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-3xl font-bold text-orange-600">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Procedure Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {procedures.map((procedure) => (
                <div key={procedure.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-lg font-bold">
                        <Clock className="h-4 w-4" />
                        <span>{procedure.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{procedure.duration}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4" />
                        <p className="font-medium">{procedure.patient}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{procedure.procedure}</p>
                      <p className="text-xs text-muted-foreground">{procedure.room}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={procedure.status === 'in-progress' ? 'default' : 'outline'}
                    >
                      {procedure.status}
                    </Badge>
                    <div className="flex space-x-2">
                      {procedure.status === 'scheduled' && (
                        <Button size="sm">Start Procedure</Button>
                      )}
                      {procedure.status === 'in-progress' && (
                        <Button size="sm" variant="outline">Complete</Button>
                      )}
                      <Button size="sm" variant="outline">View Details</Button>
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

export default TechnicianProcedures;