// File: HRDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, UserPlus, Search, ArrowRightCircle
} from 'lucide-react';
// import { getAllStaff, getHRStats } from '@/api/hr';
import type { Staff, HRStats } from '@/api/hr';
import HRService from '@/services/hr.service';
import { toast } from 'sonner';

const HRDashboard: React.FC = () => {
  // list + filters
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all'|string>('all');
  const [branchFilter, setBranchFilter] = useState<'all'|string>('all');
  const [statusFilter, setStatusFilter] = useState<'all'|string>('all');

  // stats
  const [stats, setStats] = useState<HRStats|null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);

  useEffect(() => {
    // load overview stats once
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const s = await HRService.getHRStats();
        setStats(s);
      } catch {
        toast.error('Failed to load HR stats');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    // reload staff list whenever filters change
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const list = await HRService.getAllStaff({
          search: searchTerm,
          role: roleFilter,
          branch: branchFilter,
          status: statusFilter
        });
        setStaffList(list);
      } catch {
        toast.error('Failed to load staff list');
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, [searchTerm, roleFilter, branchFilter, statusFilter]);

  return (
    <div className="space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users size={28} /> HR Dashboard
        </h1>
        <Button asChild variant="outline">
          <Link to="/hr/new">
            <UserPlus size={16} className="mr-2" />
            Add New Staff
          </Link>
        </Button>
      </div>

      {/* Stats */}
      {loadingStats ? (
        <div className="text-center py-8">Loading stats…</div>
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader><CardTitle>Total Staff</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">
              {stats.totalStaff}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>On Leave Today</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">
              {stats.onLeaveToday}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>New Joins This Month</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">
              {stats.newJoinsThisMonth}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Upcoming Reviews</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">
              {stats.upcomingReviews}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader><CardTitle>Search &amp; Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by name, email, employee ID…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
              <SelectItem value="Receptionist">Receptionist</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={branchFilter}
            onValueChange={setBranchFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {Object.keys(stats?.branchCounts || {}).map(br => (
                <SelectItem key={br} value={br}>{br}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on‐leave">On Leave</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingStaff ? (
            <div className="text-center py-8">Loading staff…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell className="text-right">Details</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.role}</TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell>{s.branch}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${{
                        active: 'bg-green-50 text-green-700',
                        'on-leave': 'bg-blue-50 text-blue-700',
                        suspended: 'bg-yellow-50 text-yellow-700',
                        terminated: 'bg-red-50 text-red-700'
                      }[s.status]}`}>
                        {s.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(s.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link to={`/hr/staff/${s.id}`}>
                          <ArrowRightCircle size={16} />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;
