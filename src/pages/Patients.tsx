import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'Active' | 'Inactive';
  condition: string;
  avatar?: string;
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const patients: Patient[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 34,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      status: 'Active',
      condition: 'Hypertension',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      phone: '+1 (555) 987-6543',
      email: 'jane.smith@email.com',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-22',
      status: 'Active',
      condition: 'Diabetes Type 2',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      age: 45,
      gender: 'Male',
      phone: '+1 (555) 456-7890',
      email: 'robert.j@email.com',
      lastVisit: '2024-01-08',
      nextAppointment: undefined,
      status: 'Inactive',
      condition: 'Heart Disease',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
    },
    {
      id: 4,
      name: 'Emily Davis',
      age: 31,
      gender: 'Female',
      phone: '+1 (555) 321-0987',
      email: 'emily.davis@email.com',
      lastVisit: '2024-01-18',
      nextAppointment: '2024-01-28',
      status: 'Active',
      condition: 'Asthma',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
    },
    {
      id: 5,
      name: 'Michael Brown',
      age: 52,
      gender: 'Male',
      phone: '+1 (555) 654-3210',
      email: 'michael.brown@email.com',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-30',
      status: 'Active',
      condition: 'Arthritis',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FileText size={16} className="mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search patients by name, condition, or phone..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {patient.avatar ? (
                      <img 
                        src={patient.avatar} 
                        alt={patient.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      getInitials(patient.name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                    <DropdownMenuItem>View History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-600">{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-600">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-gray-600">Last visit: {patient.lastVisit}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {patient.condition}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(patient.status)}`}
                  >
                    {patient.status}
                  </Badge>
                </div>
                {patient.nextAppointment && (
                  <p className="text-xs text-gray-500 mt-2">
                    Next: {patient.nextAppointment}
                  </p>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View
                </Button>
                <Button size="sm" className="flex-1">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first patient'}
            </p>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Patient
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'Active').length}
            </p>
            <p className="text-sm text-gray-600">Active Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {patients.filter(p => p.nextAppointment).length}
            </p>
            <p className="text-sm text-gray-600">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(patients.map(p => p.condition)).size}
            </p>
            <p className="text-sm text-gray-600">Conditions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Patients;