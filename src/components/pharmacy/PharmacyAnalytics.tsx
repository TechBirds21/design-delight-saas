import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Activity,
  Users
} from 'lucide-react';

const PharmacyAnalytics: React.FC = () => {
  const stats = [
    { 
      title: "Prescriptions Filled", 
      value: "342", 
      icon: Activity, 
      trend: "+18% from last week",
      color: "blue"
    },
    { 
      title: "Revenue Today", 
      value: "$2,450", 
      icon: DollarSign, 
      trend: "+12% from yesterday",
      color: "green"
    },
    { 
      title: "Patients Served", 
      value: "89", 
      icon: Users, 
      trend: "+8% from last week",
      color: "purple"
    },
    { 
      title: "Avg Wait Time", 
      value: "8 min", 
      icon: TrendingUp, 
      trend: "-2 min from last week",
      color: "orange"
    }
  ];

  const topDrugs = [
    { name: "Amoxicillin 500mg", dispensed: 45, revenue: "$675" },
    { name: "Ibuprofen 400mg", dispensed: 38, revenue: "$190" },
    { name: "Vitamin D3 1000IU", dispensed: 32, revenue: "$320" },
    { name: "Aspirin 75mg", dispensed: 28, revenue: "$140" },
    { name: "Paracetamol 500mg", dispensed: 25, revenue: "$125" }
  ];

  const recentActivity = [
    { time: "14:30", action: "Dispensed Amoxicillin to John Doe", pharmacist: "Sarah" },
    { time: "14:15", action: "Stock adjustment - Ibuprofen", pharmacist: "Mike" },
    { time: "14:00", action: "Dispensed Vitamin D3 to Jane Smith", pharmacist: "Sarah" },
    { time: "13:45", action: "New prescription received", pharmacist: "System" },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' };
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-600' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${colors.text}`}>{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-full ${colors.bg}`}>
                    <stat.icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dispensed Drugs */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" />
              Top Dispensed Drugs (This Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrugs.map((drug, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div>
                    <p className="font-medium">{drug.name}</p>
                    <p className="text-sm text-gray-600">{drug.dispensed} units dispensed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600">{drug.revenue}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-emerald-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="font-mono text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                    {activity.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.pharmacist}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyAnalytics;