import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scissors, 
  BookOpen, 
  Plus, 
  PlayCircle,
  FileText,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const ProceduresDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: "Total Procedures", value: "156", icon: Scissors, trend: "+12 new this week" },
    { title: "Active Protocols", value: "24", icon: PlayCircle, trend: "Currently in use" },
    { title: "Success Rate", value: "96.8%", icon: Star, trend: "+2.1% improvement" },
    { title: "Avg Duration", value: "45m", icon: Clock, trend: "Optimized timing" }
  ];

  const procedures = [
    { id: 1, name: "Laser Hair Removal - Face", category: "Laser", duration: "30 min", popularity: "High", status: "active" },
    { id: 2, name: "Chemical Peel - Light", category: "Chemical", duration: "45 min", popularity: "Medium", status: "active" },
    { id: 3, name: "Microneedling + PRP", category: "Rejuvenation", duration: "60 min", popularity: "High", status: "active" },
    { id: 4, name: "IPL Photorejuvenation", category: "Light", duration: "40 min", popularity: "Medium", status: "revision" },
  ];

  const protocols = [
    { id: 1, name: "Acne Treatment Protocol", steps: 5, category: "Medical", lastUpdated: "2 days ago" },
    { id: 2, name: "Anti-Aging Facial", steps: 7, category: "Cosmetic", lastUpdated: "1 week ago" },
    { id: 3, name: "Scar Reduction Program", steps: 4, category: "Therapeutic", lastUpdated: "3 days ago" },
    { id: 4, name: "Pigmentation Correction", steps: 6, category: "Medical", lastUpdated: "Today" },
  ];

  const recentActivity = [
    { id: 1, action: "Protocol Updated", item: "Acne Treatment Protocol", user: "Dr. Sarah", time: "2 hours ago" },
    { id: 2, action: "New Procedure Added", item: "Hydrafacial MD", user: "Admin", time: "4 hours ago" },
    { id: 3, action: "Success Rate Updated", item: "Laser Hair Removal", user: "System", time: "6 hours ago" },
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Procedures Dashboard</h1>
            <p className="text-gray-600">Manage procedure catalog and protocol development</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" />
              New Procedure
            </Button>
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Create Protocol
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-pink-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Procedure Catalog */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="mr-2 h-5 w-5 text-pink-600" />
                Procedure Catalog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedures.map((procedure) => (
                  <div key={procedure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{procedure.name}</p>
                      <p className="text-sm text-gray-600">{procedure.category} • {procedure.duration}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={procedure.popularity === 'High' ? 'default' : 'secondary'}
                        className={procedure.popularity === 'High' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {procedure.popularity}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{procedure.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Protocol Builder */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Protocol Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocols.map((protocol) => (
                  <div key={protocol.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{protocol.name}</p>
                      <Badge variant="outline">{protocol.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{protocol.steps} steps</p>
                    <p className="text-xs text-gray-500">Updated: {protocol.lastUpdated}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.item} by {activity.user}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Procedure Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Procedure Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <Scissors className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Laser</h3>
                <p className="text-2xl font-bold text-red-600">24</p>
                <p className="text-sm text-gray-600">Procedures</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Chemical</h3>
                <p className="text-2xl font-bold text-blue-600">18</p>
                <p className="text-sm text-gray-600">Procedures</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Rejuvenation</h3>
                <p className="text-2xl font-bold text-green-600">32</p>
                <p className="text-sm text-gray-600">Procedures</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <PlayCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Medical</h3>
                <p className="text-2xl font-bold text-purple-600">28</p>
                <p className="text-sm text-gray-600">Procedures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/procedures/catalog')}>
                <Plus className="h-6 w-6" />
                <span>New Procedure</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/procedures/builder')}>
                <BookOpen className="h-6 w-6" />
                <span>Create Protocol</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Usage Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ProceduresDashboard;