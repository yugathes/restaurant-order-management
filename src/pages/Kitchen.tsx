
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/context/OrderContext';
import { Order } from '@/types';

const Kitchen = () => {
  const { orders, updateOrderStatus } = useOrders();
  
  // Filter orders for kitchen display
  const relevantOrders = orders.filter(
    order => ['new', 'preparing'].includes(order.status)
  );
  
  const handleUpdateStatus = (order: Order, newStatus: 'preparing' | 'ready') => {
    updateOrderStatus(order.id, newStatus);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Kitchen Display</h2>
        </div>
        
        {relevantOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {relevantOrders.map(order => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">No active orders at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (order: Order, newStatus: 'preparing' | 'ready') => void;
}

const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ order, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(false);
  
  const isNew = order.status === 'new';
  const isPreparing = order.status === 'preparing';
  
  const getTimeSinceCreation = () => {
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    return `${diffMinutes} minutes ago`;
  };
  
  return (
    <Card className={`border-l-4 ${
      isNew ? 'border-l-order-new' : 'border-l-order-preparing'
    }`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">Table {order.tableNumber}</CardTitle>
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-order-new opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-order-new"></span>
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isNew ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-500">{getTimeSinceCreation()}</span>
          <span className="font-medium">{order.items.length} items</span>
        </div>
        
        <div className={`space-y-2 ${expanded ? '' : 'max-h-32 overflow-hidden'}`}>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-start p-2 border-b border-gray-100">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.notes && (
                  <p className="text-xs italic text-gray-500 mt-1">{item.notes}</p>
                )}
              </div>
              <span className="text-sm font-medium">x{item.quantity}</span>
            </div>
          ))}
        </div>
        
        {order.items.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full text-gray-500"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show All Items'}
          </Button>
        )}
        
        <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between">
          {isNew ? (
            <Button 
              className="w-full bg-order-preparing hover:bg-amber-600 text-white"
              onClick={() => onUpdateStatus(order, 'preparing')}
            >
              Start Preparing
            </Button>
          ) : (
            <Button 
              className="w-full bg-order-ready hover:bg-blue-600 text-white"
              onClick={() => onUpdateStatus(order, 'ready')}
            >
              Mark as Ready
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Kitchen;
