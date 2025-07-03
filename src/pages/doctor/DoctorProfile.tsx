import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorProfile: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Profile management and settings coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;