
import { useState } from 'react';
import { User, Order, MenuItem, Table, OrderStatus, InventoryItem, OrderItem } from '../../types';

// Mock Data
const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Truffle Burger', price: 18, category: 'Main Courses', description: 'Wagyu beef patty, truffle aioli, swiss cheese.', image: 'https://picsum.photos/seed/burger/400/300', available: true },
  { id: '2', name: 'Caesar Salad', price: 12, category: 'Appetizers', description: 'Romaine, parmesan, croutons.', image: 'https://picsum.photos/seed/salad/400/300', available: true },
  { id: '3', name: 'Margherita Pizza', price: 14, category: 'Main Courses', description: 'Fresh basil, mozzarella, tomato sauce.', image: 'https://picsum.photos/seed/pizza/400/300', available: true },
  { id: '4', name: 'Spicy Miso Ramen', price: 15, category: 'Main Courses', description: 'Rich pork broth, miso paste, chashu pork.', image: 'https://picsum.photos/seed/ramen/400/300', available: true },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'San Marzano Tomatoes', category: 'Produce', stock: 2.5, unit: 'kg', status: 'CRITICAL' },
  { id: 'inv2', name: 'Ribeye Steak', category: 'Meat', stock: 4, unit: 'units', status: 'LOW' },
  { id: 'inv3', name: 'Whole Milk', category: 'Dairy', stock: 12, unit: 'L', status: 'HEALTHY' },
  { id: 'inv4', name: 'Arborio Rice', category: 'Grains', stock: 25, unit: 'kg', status: 'HEALTHY' },
  { id: 'inv5', name: 'Fresh Basil', category: 'Herbs', stock: 0.8, unit: 'kg', status: 'LOW' },
];

const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  status: i % 4 === 0 ? 'OCCUPIED' : 'AVAILABLE',
  capacity: 4,
  zone: 'Main Hall'
}));

const INITIAL_ORDERS: Order[] = [
  { id: '1024', tableId: '4', status: OrderStatus.COOKING, total: 34.5, createdAt: new Date().toISOString(), waiterName: 'Sarah Jenkins', items: [{id: 'oi1', menuItemId: '1', name: 'Truffle Burger', price: 18, quantity: 1, note: "No onions"}] },
  { id: '1025', tableId: '12', status: OrderStatus.READY, total: 18, createdAt: new Date().toISOString(), waiterName: 'Sarah Jenkins', items: [{id: 'oi2', menuItemId: '2', name: 'Caesar Salad', price: 12, quantity: 1}] },
];

export const useAppStore = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('resto_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('resto_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resto_user');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Mark table as occupied
    setTables(prev => prev.map(t => t.id === newOrder.tableId ? { ...t, status: 'OCCUPIED' } : t));
  };

  const addItemsToOrder = (tableId: string, newItems: OrderItem[]) => {
    const existingOrder = orders.find(o => o.tableId === tableId && o.status !== OrderStatus.PAID && o.status !== OrderStatus.CANCELLED);
    
    if (existingOrder) {
      setOrders(prev => prev.map(o => {
        if (o.id === existingOrder.id) {
          const updatedItems = [...o.items, ...newItems];
          const updatedTotal = updatedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
          return { ...o, items: updatedItems, total: updatedTotal, status: OrderStatus.PENDING }; // Send back to kitchen
        }
        return o;
      }));
    } else {
      // Create new order if none exists
      const total = newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      addOrder({
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        tableId,
        items: newItems,
        status: OrderStatus.PENDING,
        total,
        createdAt: new Date().toISOString(),
        waiterName: user?.fullName
      });
    }
  };

  // Menu Actions
  const addMenuItem = (item: MenuItem) => setMenu(prev => [...prev, item]);
  const updateMenuItem = (item: MenuItem) => setMenu(prev => prev.map(m => m.id === item.id ? item : m));
  const deleteMenuItem = (id: string) => setMenu(prev => prev.filter(m => m.id !== id));

  // Inventory Actions
  const addInventoryItem = (item: InventoryItem) => setInventory(prev => [...prev, item]);
  const updateInventoryStock = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + amount);
        let status: 'CRITICAL' | 'LOW' | 'HEALTHY' = 'HEALTHY';
        if (newStock < 2) status = 'CRITICAL';
        else if (newStock < 5) status = 'LOW';
        return { ...item, stock: newStock, status };
      }
      return item;
    }));
  };

  const adjustInventoryItem = (item: InventoryItem) => setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  const removeInventoryItem = (id: string) => setInventory(prev => prev.filter(i => i.id !== id));

  return {
    user,
    login,
    logout,
    orders,
    menu,
    tables,
    inventory,
    updateOrderStatus,
    addOrder,
    addItemsToOrder,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addInventoryItem,
    updateInventoryStock,
    adjustInventoryItem,
    removeInventoryItem,
    setMenu,
    setTables
  };
};
