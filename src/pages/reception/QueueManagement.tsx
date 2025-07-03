import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, AlertTriangle } from 'lucide-react';

const QueueManagement: React.FC = () => {
  const queueData = [
    { id: 1, patient: "Sarah Johnson", waitTime: "5 min", priority: "Normal", status: "waiting" },
    { id: 2, patient: "Mike Wilson", waitTime: "12 min", priority: "Urgent", status: "waiting" },
    { id: 3, patient: "Emma Davis", waitTime: "8 min", priority: "Normal", status: "in-progress" },
    { id: 4, patient: "John Smith", waitTime: "3 min", priority: "Normal", status: "waiting" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Queue Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total in Queue</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Wait</p>
                  <p className="text-3xl font-bold">8 min</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Urgent Cases</p>
                  <p className="text-3xl font-bold">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queueData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-bold text-primary">#{item.id}</div>
                    <div>
                      <p className="font-medium">{item.patient}</p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Waiting: {item.waitTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={item.priority === 'Urgent' ? 'destructive' : 'secondary'}
                    >
                      {item.priority}
                    </Badge>
                    <Badge 
                      variant={item.status === 'in-progress' ? 'default' : 'outline'}
                    >
                      {item.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Call Next</Button>
                      <Button size="sm">View Details</Button>
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

export default QueueManagement;