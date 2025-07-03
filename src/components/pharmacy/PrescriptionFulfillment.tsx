import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Pill, 
  Clock, 
  User, 
  Scan,
  ShoppingCart,
  CheckCircle 
} from 'lucide-react';

const PrescriptionFulfillment: React.FC = () => {
  const [selectedRx, setSelectedRx] = useState<string[]>([]);

  const activePrescriptions = [
    {
      id: 'RX001',
      patient: 'Sarah Johnson',
      drug: 'Amoxicillin 500mg',
      dose: '500mg',
      frequency: '3 times daily',
      duration: '7 days',
      qtyOrdered: 21,
      qtyDispensed: 0,
      doctor: 'Dr. Smith',
      date: '2024-01-15',
      status: 'pending'
    },
    {
      id: 'RX002',
      patient: 'Mike Wilson',
      drug: 'Ibuprofen 400mg',
      dose: '400mg',
      frequency: '2 times daily',
      duration: '5 days',
      qtyOrdered: 10,
      qtyDispensed: 5,
      doctor: 'Dr. Johnson',
      date: '2024-01-14',
      status: 'partial'
    },
    {
      id: 'RX003',
      patient: 'Emma Davis',
      drug: 'Vitamin D3 1000IU',
      dose: '1000IU',
      frequency: 'Once daily',
      duration: '30 days',
      qtyOrdered: 30,
      qtyDispensed: 30,
      doctor: 'Dr. Brown',
      date: '2024-01-13',
      status: 'completed'
    }
  ];

  const toggleRxSelection = (rxId: string) => {
    setSelectedRx(prev => 
      prev.includes(rxId) 
        ? prev.filter(id => id !== rxId)
        : [...prev, rxId]
    );
  };

  const handleDispense = () => {
    console.log('Dispensing prescriptions:', selectedRx);
    setSelectedRx([]);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Pill className="mr-2 h-5 w-5 text-green-600" />
            Active Prescriptions
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Scan className="mr-2 h-4 w-4" />
              Scan
            </Button>
            <Button 
              size="sm" 
              disabled={selectedRx.length === 0}
              onClick={handleDispense}
              className="bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Dispense ({selectedRx.length})
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activePrescriptions.map((rx) => (
            <div
              key={rx.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRx.includes(rx.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => rx.status !== 'completed' && toggleRxSelection(rx.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">{rx.drug}</div>
                  <Badge 
                    variant={
                      rx.status === 'completed' ? 'default' : 
                      rx.status === 'partial' ? 'secondary' : 
                      'outline'
                    }
                    className={
                      rx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      rx.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }
                  >
                    {rx.status}
                  </Badge>
                </div>
                {rx.status === 'completed' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{rx.patient}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{rx.frequency}</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Prescribed by: <strong>{rx.doctor}</strong></span>
                  <span>Qty: <strong>{rx.qtyDispensed}/{rx.qtyOrdered}</strong></span>
                </div>
              </div>

              {selectedRx.includes(rx.id) && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Quantity to dispense" type="number" />
                    <Input placeholder="Days supply" type="number" />
                  </div>
                  <Input 
                    placeholder="Patient instructions..." 
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionFulfillment;