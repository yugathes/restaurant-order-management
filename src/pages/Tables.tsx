
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTables } from '@/context/TableContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Tables = () => {
  const { tables } = useTables();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const handleTableClick = (tableNumber: number) => {
    setSelectedTable(tableNumber);
    setIsDialogOpen(true);
  };

  const handleCreateOrder = () => {
    if (selectedTable !== null && currentUser) {
      createOrder(selectedTable, currentUser.id);
      navigate('/orders');
    }
    setIsDialogOpen(false);
  };

  const handleViewOrder = () => {
    setIsDialogOpen(false);
    navigate('/orders');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Tables</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => {
            const isOccupied = table.status === 'occupied';
            
            return (
              <Card 
                key={table.number}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  isOccupied ? 'border-restaurant-300' : 'border-gray-200'
                }`}
                onClick={() => handleTableClick(table.number)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Table {table.number}</h3>
                    <span 
                      className={`inline-block w-3 h-3 rounded-full ${
                        isOccupied ? 'bg-restaurant-600' : 'bg-green-500'
                      }`}
                    />
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">Seats: {table.seats}</p>
                    <p className={`text-sm font-medium ${
                      isOccupied ? 'text-restaurant-700' : 'text-green-700'
                    }`}>
                      Status: {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </p>
                    {isOccupied && (
                      <p className="text-xs text-restaurant-600">
                        Order #{table.currentOrderId?.substring(0, 8)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Table {selectedTable}</DialogTitle>
            <DialogDescription>
              {tables.find(t => t.number === selectedTable)?.status === 'occupied' 
                ? 'This table is currently occupied with an active order.'
                : 'This table is available. Would you like to create a new order?'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            
            {tables.find(t => t.number === selectedTable)?.status === 'occupied' ? (
              <Button onClick={handleViewOrder} className="bg-restaurant-600 hover:bg-restaurant-700">
                View Order
              </Button>
            ) : (
              <Button onClick={handleCreateOrder} className="bg-restaurant-600 hover:bg-restaurant-700">
                Create Order
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Tables;
