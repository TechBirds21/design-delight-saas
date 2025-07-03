import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Calendar, AlertTriangle } from 'lucide-react';

const PatientLookup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const mockPatients = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      phone: '+1-555-0123',
      lastVisit: '2024-01-15',
      allergies: ['Penicillin', 'Aspirin'],
      activeRx: 3,
      balance: 150.00
    }
  ];

  const handleSearch = () => {
    if (searchQuery) {
      setSelectedPatient(mockPatients[0]);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-600" />
          Patient Lookup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search by phone number or patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {selectedPatient && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Last Visit: {selectedPatient.lastVisit}</span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    <strong>Allergies:</strong> {selectedPatient.allergies.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Prescriptions: <strong>{selectedPatient.activeRx}</strong></span>
                  <span>Outstanding Balance: <strong>${selectedPatient.balance}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientLookup;