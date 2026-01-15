
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  KITCHEN = 'KITCHEN',
  CASHIER = 'CASHIER',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  READY = 'READY',
  SERVED = 'SERVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  available: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  waiterName?: string;
}

export interface Table {
  id: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'WAITING';
  capacity: number;
  zone: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'CRITICAL' | 'LOW' | 'HEALTHY';
}
