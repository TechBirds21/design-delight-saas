import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Star, TrendingUp } from 'lucide-react';

const PerformanceManagement: React.FC = () => {
  const performanceData = [
    { id: 1, name: "Dr. Sarah Johnson", rating: 4.8, reviews: 152, procedures: 89, satisfaction: 96 },
    { id: 2, name: "Mike Wilson", rating: 4.6, reviews: 98, procedures: 67, satisfaction: 94 },
    { id: 3, name: "Emma Davis", rating: 4.9, reviews: 134, procedures: 78, satisfaction: 98 },
    { id: 4, name: "John Smith", rating: 4.5, reviews: 76, procedures: 45, satisfaction: 92 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Performance Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-3xl font-bold">4.7</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                  <p className="text-3xl font-bold">460</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-3xl font-bold text-green-600">95%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Performer</p>
                  <p className="text-xl font-bold">Emma D.</p>
                </div>
                <Star className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{staff.rating}</span>
                        <span className="text-sm text-muted-foreground">({staff.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Procedures</p>
                      <p className="font-medium">{staff.procedures}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <p className="font-medium text-green-600">{staff.satisfaction}%</p>
                    </div>
                    <Badge 
                      variant={staff.rating >= 4.7 ? 'default' : 'secondary'}
                    >
                      {staff.rating >= 4.7 ? 'Excellent' : 'Good'}
                    </Badge>
                    <Button size="sm" variant="outline">View Details</Button>
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

export default PerformanceManagement;