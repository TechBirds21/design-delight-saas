import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorMessages: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages & Notifications</h1>
          <p className="text-muted-foreground">Patient communications and alerts</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Message Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Messaging and notification system coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorMessages;