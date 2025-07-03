import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorProcedures: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Procedures Module</h1>
          <p className="text-muted-foreground">Manage procedures and treatment protocols</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Procedure Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Procedure catalog and assignment functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProcedures;