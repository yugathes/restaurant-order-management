
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrders } from '@/context/OrderContext';
import { useMenu } from '@/context/MenuContext';
import { MenuItem, OrderItem } from '@/types';

const Orders = () => {
  const { orders, activeOrder, setActiveOrder, addItemToOrder, removeItemFromOrder, updateOrderStatus } = useOrders();
  const { menuItems, categories } = useMenu();
  
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const handleAddItem = () => {
    if (activeOrder && selectedMenuItem) {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        menuItemId: selectedMenuItem.id,
        name: selectedMenuItem.name,
        price: selectedMenuItem.price,
        quantity,
        notes: notes.trim() || undefined,
      };

      addItemToOrder(activeOrder.id, newItem);
      resetAddItemForm();
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (activeOrder) {
      removeItemFromOrder(activeOrder.id, itemId);
    }
  };

  const handleUpdateStatus = (status: 'new' | 'preparing' | 'ready' | 'completed') => {
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, status);
    }
  };

  const resetAddItemForm = () => {
    setSelectedMenuItem(null);
    setQuantity(1);
    setNotes('');
    setIsAddItemDialogOpen(false);
  };

  const calculateTotal = (order: typeof activeOrder) => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Orders Management</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle>Order List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <div 
                      key={order.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        activeOrder?.id === order.id ? 'bg-restaurant-50' : ''
                      }`}
                      onClick={() => setActiveOrder(order)}
                    >
                      <div className="flex justify-between">
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
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No orders found
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            {activeOrder ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Order Details - Table {activeOrder.tableNumber}</CardTitle>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${activeOrder.status === 'new' ? 'bg-green-100 text-green-800' : 
                      activeOrder.status === 'preparing' ? 'bg-amber-100 text-amber-800' : 
                      activeOrder.status === 'ready' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`
                  }>
                    {activeOrder.status.charAt(0).toUpperCase() + activeOrder.status.slice(1)}
                  </span>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold">Items</h3>
                        <Button onClick={() => setIsAddItemDialogOpen(true)}>
                          Add Item
                        </Button>
                      </div>
                      
                      {activeOrder.items.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {activeOrder.items.map((item) => (
                            <div key={item.id} className="py-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                                {item.notes && (
                                  <p className="text-xs italic mt-1">{item.notes}</p>
                                )}
                              </div>
                              <div className="flex items-center">
                                <p className="mr-4 font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}

                          <div className="py-4 flex justify-between items-center">
                            <p className="font-bold">Total:</p>
                            <p className="font-bold text-lg">
                              ${calculateTotal(activeOrder).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No items in this order</p>
                          <Button
                            onClick={() => setIsAddItemDialogOpen(true)}
                            className="mt-2"
                          >
                            Add First Item
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={activeOrder.status === 'new' ? 'default' : 'outline'} 
                          onClick={() => handleUpdateStatus('new')}
                          className={activeOrder.status === 'new' ? 'bg-order-new text-white' : ''}
                        >
                          New
                        </Button>
                        <Button 
                          variant={activeOrder.status === 'preparing' ? 'default' : 'outline'} 
                          onClick={() => handleUpdateStatus('preparing')}
                          className={activeOrder.status === 'preparing' ? 'bg-order-preparing text-white' : ''}
                        >
                          Preparing
                        </Button>
                        <Button 
                          variant={activeOrder.status === 'ready' ? 'default' : 'outline'} 
                          onClick={() => handleUpdateStatus('ready')}
                          className={activeOrder.status === 'ready' ? 'bg-order-ready text-white' : ''}
                        >
                          Ready
                        </Button>
                        <Button 
                          variant={activeOrder.status === 'completed' ? 'default' : 'outline'} 
                          onClick={() => handleUpdateStatus('completed')}
                          className={activeOrder.status === 'completed' ? 'bg-order-completed text-white' : ''}
                        >
                          Completed
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Select an order from the list to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Item to Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="w-full overflow-x-auto">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map(category => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div
                          key={item.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedMenuItem?.id === item.id 
                              ? 'border-restaurant-500 bg-restaurant-50' 
                              : 'border-gray-200 hover:border-restaurant-300'
                          }`}
                          onClick={() => setSelectedMenuItem(item)}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium">{item.name}</p>
                            <p>${item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {selectedMenuItem && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="E.g., No onions, extra sauce, etc."
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetAddItemForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddItem} 
                disabled={!selectedMenuItem}
                className="bg-restaurant-600 hover:bg-restaurant-700"
              >
                Add to Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Orders;
