import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Printer,
  DollarSign,
  Building,
  Calendar,
  User,
  CreditCard,
  CheckCircle
} from 'lucide-react';
// import { getPayslipDetails, downloadPayslip } from '@/api/payroll';
import type { Payslip } from '@/api/payroll';
import { toast } from 'sonner';
import PayrollService from '@/services/payroll.service';

const PayslipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      loadPayslipDetails();
    }
  }, [id]);

  const loadPayslipDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const payslipData = await PayrollService.getPayslipDetails(id);
      setPayslip(payslipData);
    } catch (error) {
      toast.error('Failed to load payslip details');
      console.error('Error loading payslip:', error);
      navigate('/payroll');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    
    try {
      setDownloading(true);
      await PayrollService.downloadPayslip(id);
      toast.success('Payslip downloaded successfully');
    } catch (error) {
      toast.error('Failed to download payslip');
      console.error('Error downloading payslip:', error);
    } finally {
      setDownloading(false);
    }
  };

  const printPayslip = () => {
    window.print();
  };

  const getMonthName = (month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!payslip) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payslip not found</h3>
        <Button onClick={() => navigate('/payroll')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Payroll
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/payroll')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Payroll
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payslip</h1>
            <p className="text-gray-600 mt-1">
              {getMonthName(payslip.month)} {payslip.year}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={16} className="mr-2" />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
          <Button variant="outline" size="sm" onClick={printPayslip}>
            <Printer size={16} className="mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Payslip Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white print:bg-white print:text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Building size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hospverse Medical Center</h2>
                <p className="text-blue-100 print:text-gray-600">Payslip for {getMonthName(payslip.month)} {payslip.year}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`capitalize text-sm border-2 ${getStatusColor(payslip.paymentStatus)} print:border-gray-200 print:text-gray-800`}
            >
              {payslip.paymentStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Employee Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Employee Details</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="font-medium">{payslip.staffName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Employee ID:</span>
                  <span className="font-medium">{payslip.employeeId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Pay Period:</span>
                  <span className="font-medium">{getMonthName(payslip.month)} {payslip.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Payment Date:</span>
                  <span className="font-medium">{new Date(payslip.paymentDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCard size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Payment Mode:</span>
                  <span className="font-medium capitalize">{payslip.paymentMode.replace('-', ' ')}</span>
                </div>
                {payslip.bankAccount && (
                  <div className="flex items-center space-x-2">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Bank Account:</span>
                    <span className="font-medium">{payslip.bankAccount}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Days Worked:</span>
                  <span className="font-medium">{payslip.daysWorked} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Leaves Taken:</span>
                  <span className="font-medium">{payslip.leavesTaken} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Earnings</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-900">Description</th>
                    <th className="text-right py-2 font-medium text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Basic Salary</td>
                    <td className="py-2 text-right">${payslip.basic.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">House Rent Allowance (HRA)</td>
                    <td className="py-2 text-right">${payslip.hra.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Conveyance Allowance</td>
                    <td className="py-2 text-right">${payslip.conveyance.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Medical Allowance</td>
                    <td className="py-2 text-right">${payslip.medical.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Special Allowance</td>
                    <td className="py-2 text-right">${payslip.special.toLocaleString()}</td>
                  </tr>
                  {payslip.bonus && payslip.bonus > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Bonus</td>
                      <td className="py-2 text-right">${payslip.bonus.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100 font-semibold">
                    <td className="py-2">Gross Earnings</td>
                    <td className="py-2 text-right">${payslip.grossSalary.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Deductions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-900">Description</th>
                    <th className="text-right py-2 font-medium text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Provident Fund (PF)</td>
                    <td className="py-2 text-right">${payslip.pf.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Tax Deducted at Source (TDS)</td>
                    <td className="py-2 text-right">${payslip.tax.toLocaleString()}</td>
                  </tr>
                  {payslip.otherDeductions && payslip.otherDeductions > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Other Deductions</td>
                      <td className="py-2 text-right">${payslip.otherDeductions.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100 font-semibold">
                    <td className="py-2">Total Deductions</td>
                    <td className="py-2 text-right">${payslip.totalDeductions.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 print:border print:border-blue-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <DollarSign size={20} className="text-blue-600" />
                <span className="text-lg font-semibold text-blue-900">Net Salary</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">${payslip.netSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax & PF Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Tax & PF Details</h3>
              <div className="space-y-2 text-sm">
                {payslip.panNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">PAN Number:</span>
                    <span className="font-medium">{payslip.panNumber}</span>
                  </div>
                )}
                {payslip.pfNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">PF Number:</span>
                    <span className="font-medium">{payslip.pfNumber}</span>
                  </div>
                )}
                {payslip.uan && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">UAN:</span>
                    <span className="font-medium">{payslip.uan}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Notes */}
            {payslip.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Notes</h3>
                <p className="text-sm text-gray-600">{payslip.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500 print:mt-16">
            <p>This is a computer-generated document. No signature is required.</p>
            <p className="mt-1">For any queries regarding this payslip, please contact HR department.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayslipDetail;