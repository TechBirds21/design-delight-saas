import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Analytics and reporting dashboard</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>Analytics Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Analytics & Reports</p>
              <p>Comprehensive reporting and analytics tools will be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;