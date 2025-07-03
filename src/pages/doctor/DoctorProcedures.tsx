import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DoctorProcedures: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Procedures Module</h1>
        <p className="text-muted-foreground">Manage procedures and treatment protocols</p>
      </div>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Procedure Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Procedure catalog and assignment functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProcedures;