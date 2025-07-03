import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DoctorMessages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Messages & Notifications</h1>
        <p className="text-muted-foreground">Patient communications and alerts</p>
      </div>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Message Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Messaging and notification system coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorMessages;