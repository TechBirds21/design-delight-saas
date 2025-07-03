import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DoctorTeleconsult: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teleconsultation</h1>
          <p className="text-muted-foreground">Virtual consultations and video calls</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Virtual Consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Video consultation platform coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorTeleconsult;