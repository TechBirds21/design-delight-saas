import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientLookup from '@/components/pharmacy/PatientLookup';
import PrescriptionFulfillment from '@/components/pharmacy/PrescriptionFulfillment';
import InventoryManagement from '@/components/pharmacy/InventoryManagement';
import PharmacyAnalytics from '@/components/pharmacy/PharmacyAnalytics';
import QuickActions from '@/components/pharmacy/QuickActions';

const PharmacyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management</h1>
            <p className="text-gray-600">Complete prescription fulfillment and inventory control</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientLookup />
              <QuickActions />
            </div>
            <PharmacyAnalytics />
          </TabsContent>

          <TabsContent value="patients">
            <PatientLookup />
          </TabsContent>

          <TabsContent value="prescriptions">
            <PrescriptionFulfillment />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <PharmacyAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PharmacyDashboard;