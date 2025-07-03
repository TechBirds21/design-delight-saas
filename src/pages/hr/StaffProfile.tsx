import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getStaffDetails,
  getAttendanceLog,
  uploadStaffDocument,
  logPerformance,
  Staff,
  AttendanceRecord,
  ShiftRecord,
  StaffDocument,
  PerformanceNote,
  SalaryStructure,
} from '@/api/hr';
import {
  Card, CardHeader, CardContent, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarWidget } from '@/components/ui/calendar';
import { toast } from 'sonner';
import {
  ArrowLeft, User, Mail, Phone, Calendar, Building,
  FileText, Clock, UserCog, Edit, Upload, Download, DollarSign
} from 'lucide-react';

export const StaffProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const s = await getStaffDetails(id);
        setStaff(s);
        const log = await getAttendanceLog(id, 
          String(new Date().getMonth()+1), String(new Date().getFullYear())
        );
        setAttendance(log);
      } catch {
        toast.error('Could not load staff.');
        navigate('/hr');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const summary = {
    present:   attendance.filter(a => a.status==='present').length,
    halfDay:   attendance.filter(a => a.status==='half-day').length,
    leave:     attendance.filter(a => a.status==='leave').length,
    absent:    attendance.filter(a => a.status==='absent').length,
  };

  const probationEndsSoon = () => {
    if (!staff?.employmentDetails?.probationEndDate) return false;
    const end = new Date(staff.employmentDetails.probationEndDate!);
    const now = Date.now();
    return end.getTime() - now < 7*24*60*60_000;
  };

  const handleDocUpload = async () => {
    if (!file || !id) return;
    const form = new FormData();
    form.append('staffId', id);
    form.append('file', file);
    try {
      await uploadStaffDocument(id, form);
      toast.success('Document uploaded.');
      const refreshed = await getStaffDetails(id);
      setStaff(refreshed);
      setFile(null);
    } catch {
      toast.error('Upload failed.');
    }
  };

  if (loading || !staff) {
    return <div className="p-8 text-center">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/hr')}>
          <ArrowLeft className="mr-2"/> Back
        </Button>
        <div className="space-x-3">
          <span className="text-2xl font-bold">{staff.name}</span>
          {probationEndsSoon() && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              Probation ends soon
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardContent className="text-center space-y-3">
              {staff.avatar
                ? <img src={staff.avatar} className="mx-auto h-24 w-24 rounded-full"/>
                : <User className="h-24 w-24 mx-auto text-gray-300"/>
              }
              <p className="font-medium">{staff.role}</p>
              <Badge variant="outline" className="capitalize">
                {staff.status.replace('-', ' ')}
              </Badge>
            </CardContent>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center space-x-2"><Mail/><span>{staff.email}</span></div>
              <div className="flex items-center space-x-2"><Phone/><span>{staff.phone}</span></div>
              <div className="flex items-center space-x-2"><Calendar/><span>Joined {new Date(staff.joinDate).toLocaleDateString()}</span></div>
              <div className="flex items-center space-x-2"><Building/><span>{staff.branch}</span></div>
            </CardContent>
            {staff.employmentDetails && (
              <CardContent className="space-y-2 text-sm">
                <p><b>ID:</b> {staff.employmentDetails.employeeId}</p>
                <p><b>Designation:</b> {staff.employmentDetails.designation}</p>
                <p><b>Contract:</b> {staff.employmentDetails.contractType}</p>
                <p><b>Hours:</b> {staff.employmentDetails.workHours}</p>
                {staff.employmentDetails.reportingTo && (
                  <p><b>Reports to:</b> {staff.employmentDetails.reportingTo}</p>
                )}
              </CardContent>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => navigate(`/hr/staff/${id}/edit`)}><Edit/> Edit</Button>
              <Button variant="outline" className="w-full"><UserCog/> Add Note</Button>
              <Button variant="outline" className="w-full"><Upload/> Upload Document</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Personal */}
            <TabsContent value="personal">
              <Card>
                <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {staff.personalDetails ? (
                    <>
                      <p><b>DOB:</b> {new Date(staff.personalDetails.dateOfBirth!).toLocaleDateString()}</p>
                      <p><b>Gender:</b> {staff.personalDetails.gender}</p>
                      <p><b>Blood Group:</b> {staff.personalDetails.bloodGroup}</p>
                      <p><b>Marital:</b> {staff.personalDetails.maritalStatus}</p>
                      <p><b>Address:</b> {staff.personalDetails.address}</p>
                      <p><b>Emergency:</b> {staff.personalDetails.emergencyContact}</p>
                    </>
                  ) : <p>No personal info.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader><CardTitle>Attendance ({summary.present} present)</CardTitle></CardHeader>
                <CardContent>
                  <CalendarWidget
                    mode="single"
                    selected={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    disabled={(d) => false}
                    modifiers={{
                      present: d => !!attendance.find(a => a.date === d.toISOString().slice(0,10) && a.status==='present'),
                      leave:   d => !!attendance.find(a => a.date === d.toISOString().slice(0,10) && a.status==='leave'),
                    }}
                    modifiersClassNames={{
                      present: 'bg-green-100',
                      leave:   'bg-blue-100',
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shifts */}
            <TabsContent value="shifts">
              <Card>
                <CardHeader><CardTitle>Shift History</CardTitle></CardHeader>
                <CardContent>
                  {staff.shifts && staff.shifts.length ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th>Date</th><th>Code</th><th>Time</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.shifts.map(s => (
                          <tr key={s.id}>
                            <td>{new Date(s.date).toLocaleDateString()}</td>
                            <td>{s.shiftCode}</td>
                            <td>{s.startTime}–{s.endTime}</td>
                            <td><Badge variant="outline">{s.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p className="p-4 text-center text-gray-500">No shifts.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents">
              <Card>
                <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input type="file" onChange={e => setFile(e.target.files?.[0]||null)}/>
                    <Button onClick={handleDocUpload} disabled={!file}><Upload/> Upload</Button>
                  </div>
                  {staff.documents && staff.documents.length ? staff.documents.map(doc=>(
                    <div key={doc.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                      <a href={`/api/docs/${doc.id}`} target="_blank" rel="noopener noreferrer">
                        <Download/>
                      </a>
                    </div>
                  )) : <p className="text-center text-gray-500">No docs.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader><CardTitle>Dept / Branch Breakdown</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">By Department</p>
                    {stats?.departmentCounts && Object.entries(stats.departmentCounts).map(([d,c]) => (
                      <p key={d}>{d}: {c}</p>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium mb-2">By Branch</p>
                    {stats?.branchCounts && Object.entries(stats.branchCounts).map(([b,c]) => (
                      <p key={b}>{b}: {c}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
