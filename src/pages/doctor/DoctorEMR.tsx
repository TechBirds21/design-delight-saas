import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorEMR: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">EMR / SOAP Notes</h1>
          <p className="text-muted-foreground">Electronic medical records and documentation</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Electronic Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">EMR and SOAP notes editor coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorEMR;