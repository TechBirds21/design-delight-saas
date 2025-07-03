import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users2, 
  Calendar, 
  FileText,
  Download, 
  Search, 
  // Filter,
  Eye,
  // Printer,
  Clock,
  // Building,
  BarChart3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
// import { getPayslips, getPayrollStats } from '@/api/payroll';
// import type { Payslip, PayrollStats } from '@/api/payroll';
import { toast } from 'sonner';
import PayrollService from '@/services/payroll.service';

// Temporary types until API is properly defined
interface Payslip {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  daysWorked: number;
  leavesTaken: number;
  grossSalary: number;
  netSalary: number;
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  special: number;
  bonus: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  paymentDate: string;
  paymentStatus: string;
}

// interface PayrollStats {
//   totalPayroll: number;
//   employeesProcessed: number;
//   pendingPayslips: number;
//   averageSalary: number;
//   departmentBreakdown: Record<string, number>;
// }

const Payroll: React.FC = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  // const [stats, setStats] = useState<PayrollStats>({
  //   totalPayroll: 0,
  //   employeesProcessed: 0,
  //   pendingPayslips: 0,
  //   averageSalary: 0,
  //   departmentBreakdown: {}
  // });
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

  // Mock current user ID - in a real app, this would come from auth context
  const currentUserId = '1'; // Dr. Sarah Johnson

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPayslips();
  }, [searchTerm, monthFilter, yearFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [,] = await Promise.all([
        PayrollService.getPayslips(currentUserId),
        PayrollService.getPayrollStats()
      ]);
      // Mock data for now since API types don't match
      setPayslips([]);
      // setStats(statsData);
    } catch (error) {
      toast.error('Failed to load payroll data');
      console.error('Error loading payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayslips = async () => {
    try {
      const filters: { month?: number; year?: number } = {};
      
      if (monthFilter !== 'all') {
        filters.month = parseInt(monthFilter);
      }
      
      if (yearFilter) {
        filters.year = parseInt(yearFilter);
      }
      
      const payslipsData = await PayrollService.getPayslips(currentUserId, filters);
      
      // Apply search filter
      if (searchTerm && payslipsData.length > 0) {
        const filteredPayslips = payslipsData.filter(payslip =>
          payslip.id.includes(searchTerm) ||
          payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log('Filtered:', filteredPayslips);
      }
      
      // Mock empty data for now
      setPayslips([]);
    } catch (error) {
      console.error('Error loading payslips:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getMonthName = (month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };

  // Data for department breakdown chart (mock data) - commented out since unused
  // const departmentData = [
  //   { name: 'Medical', value: 4500 },
  //   { name: 'Admin', value: 3000 },
  //   { name: 'Nursing', value: 3500 }
  // ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50'
    };

    const colorClass = colorClasses[color];

    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${colorClass}`}>
              <Icon size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Portal</h1>
          <p className="text-gray-600 mt-1">View your salary details and payslips</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <Clock size={16} className="mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download size={16} className="mr-2" />
            Latest Payslip
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Days Worked"
          value={payslips[0]?.daysWorked || 0}
          subtitle="This month"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Leaves Taken"
          value={payslips[0]?.leavesTaken || 0}
          subtitle="This month"
          icon={Users2}
          color="orange"
        />
        <StatsCard
          title="Gross Salary"
          value={`$${payslips[0]?.grossSalary.toLocaleString() || 0}`}
          subtitle="Before deductions"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Net Salary"
          value={`$${payslips[0]?.netSalary.toLocaleString() || 0}`}
          subtitle="Take-home pay"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign size={20} />
              <span>Salary Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Basic', value: payslips[0]?.basic || 0 },
                    { name: 'HRA', value: payslips[0]?.hra || 0 },
                    { name: 'Conveyance', value: payslips[0]?.conveyance || 0 },
                    { name: 'Medical', value: payslips[0]?.medical || 0 },
                    { name: 'Special', value: payslips[0]?.special || 0 },
                    { name: 'Bonus', value: payslips[0]?.bonus || 0 }
                  ].filter(item => item.value > 0)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Deductions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'PF', value: payslips[0]?.pf || 0 },
                      { name: 'Tax', value: payslips[0]?.tax || 0 },
                      { name: 'Other', value: payslips[0]?.otherDeductions || 0 }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                     {[
                       { name: 'PF', value: payslips[0]?.pf || 0 },
                       { name: 'Tax', value: payslips[0]?.tax || 0 },
                       { name: 'Other', value: payslips[0]?.otherDeductions || 0 }
                     ].filter(item => item.value > 0).map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <FileText size={20} />
              <span>Payslip History</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search payslips..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {getMonthName(i)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payslips.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payslips found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || monthFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No payslips have been generated yet'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[120px]">Month</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[100px]">Net Pay</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden md:table-cell">Gross Pay</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden lg:table-cell">Deductions</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden sm:table-cell">Payment Date</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[100px]">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((payslip) => (
                    <tr key={payslip.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {getMonthName(payslip.month)} {payslip.year}
                            </p>
                            <p className="text-xs text-gray-500 sm:hidden">
                              ${payslip.netSalary.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <p className="font-medium text-gray-900 text-sm">
                          ${payslip.netSalary.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                        <p className="text-sm text-gray-900">
                          ${payslip.grossSalary.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-900">
                          ${payslip.totalDeductions.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">
                          {new Date(payslip.paymentDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-xs ${getStatusColor(payslip.paymentStatus)}`}
                        >
                          {payslip.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/payroll/payslip/${payslip.id}`}>
                              <Eye size={12} className="sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Link>
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Download size={12} className="sm:mr-1" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payroll;