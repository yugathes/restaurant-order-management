
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/context/OrderContext';
import { useTables } from '@/context/TableContext';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { orders } = useOrders();
  const { tables } = useTables();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Calculate statistics
  const newOrders = orders.filter(order => order.status === 'new').length;
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;

  // Handle navigation to respective pages
  const handleOrdersClick = () => navigate('/orders');
  const handleKitchenClick = () => navigate('/kitchen');
  const handleTableClick = () => navigate('/tables');

  return (
    <AppLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Welcome, {currentUser?.name || 'User'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="cursor-pointer transition-all hover:shadow-md" 
            onClick={handleOrdersClick}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                New Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-restaurant-700">{newOrders}</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all hover:shadow-md" 
            onClick={handleKitchenClick}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Preparing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-order-preparing">{preparingOrders}</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all hover:shadow-md" 
            onClick={handleKitchenClick}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Ready to Serve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-order-ready">{readyOrders}</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all hover:shadow-md" 
            onClick={handleTableClick}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tables Occupied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {occupiedTables} / {tables.length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader className="cursor-pointer" onClick={handleOrdersClick}>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {orders.slice(0, 5).map(order => (
                  <div 
                    key={order.id} 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/orders?id=${order.id}`)}
                  >
                    <div>
                      <p className="font-medium">Table {order.tableNumber}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${order.status === 'new' ? 'bg-green-100 text-green-800' : 
                          order.status === 'preparing' ? 'bg-amber-100 text-amber-800' : 
                          order.status === 'ready' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="cursor-pointer" onClick={handleTableClick}>
              <CardTitle>Table Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tables.map(table => (
                  <div
                    key={table.number}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                      table.status === 'occupied' 
                        ? 'border-restaurant-300 bg-restaurant-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => navigate(`/tables?table=${table.number}`)}
                  >
                    <p className="font-medium">Table {table.number}</p>
                    <p className={`text-sm ${
                      table.status === 'occupied' 
                        ? 'text-restaurant-700' 
                        : 'text-gray-500'
                    }`}>
                      {table.seats} Seats
                    </p>
                    <p className={`text-xs mt-1 ${
                      table.status === 'occupied' 
                        ? 'text-restaurant-700 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
