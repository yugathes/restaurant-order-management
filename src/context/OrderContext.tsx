
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, OrderStatus, OrderItem, MenuItem } from '../types';
import { toast } from 'sonner';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (tableNumber: number, serverId: string) => void;
  addItemToOrder: (orderId: string, item: OrderItem) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  removeItemFromOrder: (orderId: string, itemId: string) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  activeOrder: null,
  setActiveOrder: () => {},
  createOrder: () => {},
  addItemToOrder: () => {},
  updateOrderStatus: () => {},
  removeItemFromOrder: () => {},
  getOrdersByStatus: () => [],
});

// Initial orders for demonstration
const initialOrders: Order[] = [
  {
    id: '1',
    tableNumber: 1,
    items: [
      { id: '101', menuItemId: '1', name: 'Classic Burger', price: 12.99, quantity: 1 },
      { id: '102', menuItemId: '2', name: 'French Fries', price: 4.99, quantity: 1 },
    ],
    status: 'new',
    createdAt: new Date(),
    updatedAt: new Date(),
    serverId: '1',
  },
  {
    id: '2',
    tableNumber: 3,
    items: [
      { id: '103', menuItemId: '3', name: 'Caesar Salad', price: 9.99, quantity: 1 },
      { id: '104', menuItemId: '4', name: 'Chicken Sandwich', price: 11.99, quantity: 2 },
    ],
    status: 'preparing',
    createdAt: new Date(),
    updatedAt: new Date(),
    serverId: '1',
  },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // In a real app, this would sync with a backend
  useEffect(() => {
    // We could load orders from API here
    console.log('Orders loaded');
  }, []);

  const createOrder = (tableNumber: number, serverId: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      tableNumber,
      items: [],
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
      serverId,
    };

    setOrders([...orders, newOrder]);
    setActiveOrder(newOrder);
    toast.success(`New order created for Table ${tableNumber}`);
  };

  const addItemToOrder = (orderId: string, item: OrderItem) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        // Check if item already exists, if so update quantity
        const existingItemIndex = order.items.findIndex(i => i.menuItemId === item.menuItemId);
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...order.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return { ...order, items: updatedItems, updatedAt: new Date() };
        } else {
          // Add new item
          return { 
            ...order, 
            items: [...order.items, { ...item, id: Date.now().toString() }],
            updatedAt: new Date()
          };
        }
      }
      return order;
    });
    
    setOrders(updatedOrders);

    // Update activeOrder directly with the updated order
    if (activeOrder && activeOrder.id === orderId) {
      const updatedActiveOrder = updatedOrders.find(o => o.id === orderId);
      if (updatedActiveOrder) {
        setActiveOrder(updatedActiveOrder);
      }
    }
    
    toast.success(`Added ${item.name} to order`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status, updatedAt: new Date() };
      }
      return order;
    });
    
    setOrders(updatedOrders);

    // Update activeOrder directly with the updated order
    if (activeOrder && activeOrder.id === orderId) {
      const updatedActiveOrder = updatedOrders.find(o => o.id === orderId);
      if (updatedActiveOrder) {
        setActiveOrder(updatedActiveOrder);
      }
    }

    toast.success(`Order #${orderId} updated to ${status}`);
  };

  const removeItemFromOrder = (orderId: string, itemId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.filter(item => item.id !== itemId),
          updatedAt: new Date()
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);

    // Update activeOrder directly with the updated order
    if (activeOrder && activeOrder.id === orderId) {
      const updatedActiveOrder = updatedOrders.find(o => o.id === orderId);
      if (updatedActiveOrder) {
        setActiveOrder(updatedActiveOrder);
      }
    }
    
    toast.success('Item removed from order');
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      activeOrder,
      setActiveOrder,
      createOrder,
      addItemToOrder,
      updateOrderStatus,
      removeItemFromOrder,
      getOrdersByStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
