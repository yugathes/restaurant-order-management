
export type Role = 'server' | 'kitchen' | 'manager';

export type User = {
  id: string;
  name: string;
  role: Role;
};

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  serverId: string;
}

export interface Table {
  number: number;
  seats: number;
  status: 'available' | 'occupied';
  currentOrderId?: string;
}
