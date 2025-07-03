import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ShoppingCart, 
  FileText, 
  Calendar,
  Scan,
  Receipt,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: Plus,
      label: "Add Stock",
      description: "Add new inventory",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: ShoppingCart,
      label: "New Sale",
      description: "Process OTC sale",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Scan,
      label: "Scan Barcode",
      description: "Quick item lookup",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      icon: FileText,
      label: "Dispense Log",
      description: "View daily log",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      icon: Calendar,
      label: "Expiry Report",
      description: "Check expiring items",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      icon: Receipt,
      label: "Print Labels",
      description: "Batch print labels",
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      icon: AlertTriangle,
      label: "Stock Alerts",
      description: "Low stock items",
      color: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      icon: BarChart3,
      label: "Reports",
      description: "Generate reports",
      color: "bg-teal-600 hover:bg-teal-700"
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-24 flex flex-col space-y-2 hover:shadow-md transition-all ${action.color} text-white border-0`}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;