import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorPatients: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Search & List</h1>
          <p className="text-muted-foreground">Search and manage patient records</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Patient Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Patient search and management functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatients;