import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DoctorAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Analytics & KPIs</h1>
        <p className="text-muted-foreground">Performance metrics and reporting</p>
      </div>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics dashboard and reports coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorAnalytics;