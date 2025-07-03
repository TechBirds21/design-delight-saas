import api from './api';
import { Payslip, PayrollStats, LeaveBalance } from '../api/payroll';

const PayrollService = {
  getPayslips: async (userId: string, filters: { month?: number; year?: number } = {}): Promise<Payslip[]> => {
    const response = await api.get(`/payroll/payslips/${userId}`, { params: filters });
    return response.data;
  },
  
  getPayslipDetails: async (id: string): Promise<Payslip> => {
    const response = await api.get(`/payroll/payslips/details/${id}`);
    return response.data;
  },
  
  downloadPayslip: async (id: string): Promise<{ url: string }> => {
    const response = await api.get(`/payroll/payslips/download/${id}`);
    return response.data;
  },
  
  getLeaveBalance: async (staffId: string): Promise<LeaveBalance> => {
    const response = await api.get(`/payroll/leave-balance/${staffId}`);
    return response.data;
  },
  
  getPayrollStats: async (): Promise<PayrollStats> => {
    const response = await api.get('/payroll/stats');
    return response.data;
  }
};

export default PayrollService;