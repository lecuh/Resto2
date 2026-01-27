
import React, { useState } from 'react';
import { MenuItem, OrderStatus, InventoryItem, OrderItem } from '../../types';

type AdminTab =
  | 'DASHBOARD'
  | 'MENU'
  | 'INVENTORY'
  | 'REPORTS'
  | 'STAFF'
  | 'VOUCHER';

interface InventoryModalState {
  type: 'IMPORT' | 'ADJUST' | 'ADD' | null;
  item: InventoryItem | null;
}

const AdminDashboard: React.FC<{ store: any }> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  
  // UI States
  const [menuSearch, setMenuSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  
  // Menu Modals
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  // Inventory Modals
  const [invModal, setInvModal] = useState<InventoryModalState>({ type: null, item: null });
  const [activeInventoryId, setActiveInventoryId] = useState<string | null>(null);

  // Manual Order States
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [manualCart, setManualCart] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState('1');
  // ================= MOCK DATA FOR DEMO =================

  const mockStaffs = [
    { id: 's1', name: 'Admin Root', role: 'ADMIN', active: true },
    { id: 's2', name: 'Manager Anna', role: 'MANAGER', active: true },
    { id: 's3', name: 'Cashier Tom', role: 'CASHIER', active: true },
    { id: 's4', name: 'Waiter John', role: 'WAITER', active: false },
  ];

  const mockVouchers = [
    // PEOPLE
    { id: 'v1', type: 'PEOPLE', name: 'Group 10+', value: '5%', active: true },
    { id: 'v2', type: 'PEOPLE', name: 'Group 20+', value: '10–15%', active: true },

    // BILL
    { id: 'v3', type: 'BILL', name: 'Bill ≥ 300k', value: '-30,000đ', active: true },
    { id: 'v4', type: 'BILL', name: 'Bill ≥ 700k', value: '-50,000đ', active: true },
    { id: 'v5', type: 'BILL', name: 'Bill ≥ 1.5M', value: '-100,000đ', active: false },

    // FOOD
    { id: 'v6', type: 'FOOD', name: 'Manager Choice', value: '5–50%', active: true },
  ];
  const [staffList, setStaffList] = useState(mockStaffs);
  const [voucherList, setVoucherList] = useState(mockVouchers);



const navItems = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: 'dashboard' },
  { id: 'MENU', label: 'Menu', icon: 'menu_book' },
  { id: 'INVENTORY', label: 'Inventory', icon: 'inventory' },
  { id: 'REPORTS', label: 'Reports', icon: 'analytics' },
  { id: 'STAFF', label: 'Staff', icon: 'group' },
  { id: 'VOUCHER', label: 'Voucher', icon: 'confirmation_number' },
];

  // Manual Ordering Logic
  const addToManualCart = (item: MenuItem) => {
    setManualCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: Math.random().toString(), menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const submitManualOrder = () => {
    if (manualCart.length === 0) return;
    const total = manualCart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    store.addOrder({
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      tableId: selectedTable,
      items: manualCart,
      status: OrderStatus.PENDING,
      total,
      createdAt: new Date().toISOString(),
      waiterName: store.user?.fullName
    });
    setManualCart([]);
    setIsManualOrderOpen(false);
  };

  // Menu Form Logic
  const handleMenuSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item: MenuItem = {
      id: editingMenuItem?.id || Math.random().toString(),
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: editingMenuItem?.image || `https://picsum.photos/seed/${Math.random()}/400/300`,
      available: true
    };

    if (editingMenuItem) store.updateMenuItem(item);
    else store.addMenuItem(item);
    
    setIsMenuModalOpen(false);
    setEditingMenuItem(null);
  };

  // Inventory Logic
  const handleInventoryAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (invModal.type === 'ADD') {
      const stockVal = parseFloat(formData.get('stock') as string);
      let status: 'CRITICAL' | 'LOW' | 'HEALTHY' = 'HEALTHY';
      if (stockVal < 2) status = 'CRITICAL';
      else if (stockVal < 5) status = 'LOW';

      const newItem: InventoryItem = {
        id: `inv-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        unit: formData.get('unit') as string,
        stock: stockVal,
        status: status
      };
      store.addInventoryItem(newItem);
    } else if (invModal.type === 'IMPORT') {
      const item = invModal.item;
      if (!item) return;
      const amount = parseFloat(formData.get('amount') as string);
      store.updateInventoryStock(item.id, amount);
    } else if (invModal.type === 'ADJUST') {
      const item = invModal.item;
      if (!item) return;
      const adjusted: InventoryItem = {
        ...item,
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        unit: formData.get('unit') as string,
      };
      store.adjustInventoryItem(adjusted);
    }

    setInvModal({ type: null, item: null });
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-burgundy/5 text-burgundy rounded-xl"><span className="material-symbols-outlined">payments</span></div>
            <span className="text-xs font-bold text-olive bg-olive/10 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Daily Revenue</p>
          <h3 className="text-2xl font-extrabold text-dark-gray mt-1">$4,850.00</h3>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-burgundy/5 text-burgundy rounded-xl"><span className="material-symbols-outlined">shopping_cart</span></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Active Orders</p>
          <h3 className="text-2xl font-extrabold text-dark-gray mt-1">{store.orders.length}</h3>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-burgundy/5 text-burgundy rounded-xl"><span className="material-symbols-outlined">event_seat</span></div>
            <span className="text-xs font-bold text-olive bg-olive/10 px-2 py-1 rounded-full">82%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Occupancy</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden"><div className="bg-olive h-full w-[82%]"></div></div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-burgundy/5 text-burgundy rounded-xl"><span className="material-symbols-outlined">avg_time</span></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Prep Time</p>
          <h3 className="text-2xl font-extrabold text-dark-gray mt-1">18m</h3>
        </div>
      </div>
      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="p-6 border-b">
            <h3 className="font-black text-lg">Recent Orders</h3>
          </div>
            <div className="p-6">
                {renderOrders()}
            </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold">Revenue Trends</h3>
              <button className="text-sm font-bold text-burgundy hover:underline">View Detailed</button>
            </div>
            <div className="p-6">
              <div className="h-64 w-full bg-gray-50 rounded-xl flex items-end gap-2 p-4">
                {[40, 60, 45, 90, 80, 55, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-burgundy/20 hover:bg-burgundy transition-colors rounded-t-lg" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
           <button 
             onClick={() => setIsManualOrderOpen(true)}
             className="w-full bg-cheese hover:bg-orange-600 text-white p-6 rounded-2xl flex flex-col items-center gap-2 shadow-lg transition-all active:scale-95"
           >
             <span className="material-symbols-outlined text-4xl">add_circle</span>
             <span className="text-lg font-black uppercase tracking-tight">Manual Order</span>
           </button>
           <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
             <h3 className="text-lg font-bold mb-6">Inventory Alerts</h3>
             <div className="space-y-4">
                {store.inventory.filter((i: InventoryItem) => i.status !== 'HEALTHY').slice(0, 3).map((item: InventoryItem) => (
                  <div key={item.id} className={`p-4 border rounded-xl flex justify-between items-center ${item.status === 'CRITICAL' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                    <div>
                      <p className={`text-sm font-bold ${item.status === 'CRITICAL' ? 'text-red-900' : 'text-orange-900'}`}>{item.name}</p>
                      <p className="text-xs text-gray-500">{item.stock} {item.unit}</p>
                    </div>
                    <button 
                      onClick={() => setInvModal({ type: 'IMPORT', item })}
                      className={`px-3 py-1.5 text-white text-[10px] font-black rounded-lg uppercase ${item.status === 'CRITICAL' ? 'bg-red-900' : 'bg-orange-900'}`}
                    >
                      Refill
                    </button>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
  const nextStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING: return OrderStatus.COOKING;
    case OrderStatus.COOKING: return OrderStatus.READY;
    case OrderStatus.READY: return OrderStatus.SERVED;
    default: return status;
  }
  };
// Order UI helpers
const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-gray-100 text-gray-700';
    case OrderStatus.COOKING:
      return 'bg-orange-100 text-orange-700';
    case OrderStatus.READY:
      return 'bg-olive-100 text-olive-700';
    case OrderStatus.SERVED:
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
const renderOrders = () => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
    <table className="w-full table-fixed">
      <thead className="bg-gray-50 text-[11px] font-black uppercase text-gray-400">
        <tr>
          <th className="px-6 py-4 w-[12%] text-left">Order ID</th>
          <th className="px-6 py-4 w-[12%] text-left">Table</th>
          <th className="px-6 py-4 w-[14%] text-left">Items</th>
          <th className="px-6 py-4 w-[14%] text-left">Total</th>
          <th className="px-6 py-4 w-[16%] text-center">Status</th>
          <th className="px-6 py-4 w-[16%] text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {store.orders.map((order: any) => (
          <tr key={order.id} className="border-t last:border-b">
            <td className="px-6 py-4 font-mono text-sm">
              #{order.id}
            </td>

            <td className="px-6 py-4 font-bold">
              Table {order.tableId}
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">
              {order.items.length} items
            </td>

            <td className="px-6 py-4 font-black text-burgundy">
              ${order.total.toFixed(2)}
            </td>

            <td className="px-6 py-4 text-center">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase
                  ${getStatusBadgeClass(order.status)}`}
              >
                {order.status}
              </span>
            </td>

            <td className="px-6 py-4 text-center">
              <button
                disabled={order.status === OrderStatus.SERVED}
                onClick={() =>
                  store.updateOrderStatus(
                    order.id,
                    nextStatus(order.status)
                  )
                }
                className={`min-w-[90px] px-4 py-2 rounded-lg text-xs font-black transition
                  ${
                    order.status === OrderStatus.SERVED
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-olive text-white hover:bg-olive/90'
                  }`}
              >
                {order.status === OrderStatus.SERVED ? 'Done' : 'Advance'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
  const renderMenu = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-black text-dark-gray uppercase tracking-tight">Menu Management</h3>
          <p className="text-gray-500 text-sm">Organize and update your restaurant dishes.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
              placeholder="Search dishes..."
              value={menuSearch}
              onChange={e => setMenuSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setEditingMenuItem(null); setIsMenuModalOpen(true); }}
            className="bg-burgundy text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined">add</span>
            New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {store.menu
          .filter((item: MenuItem) => item.name.toLowerCase().includes(menuSearch.toLowerCase()))
          .map((item: MenuItem) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
              <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => { setEditingMenuItem(item); setIsMenuModalOpen(true); }}
                    className="size-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-dark-gray hover:bg-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={() => { if(confirm(`Delete ${item.name}?`)) store.deleteMenuItem(item.id); }}
                    className="size-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-red-600 hover:bg-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-dark-gray">{item.name}</h4>
                  <span className="text-burgundy font-black">${item.price}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => store.updateMenuItem({ ...item, available: !item.available })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${item.available ? 'bg-olive' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 size-4 bg-white rounded-full transition-all ${item.available ? 'left-5.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-dark-gray uppercase tracking-tight">Inventory Control</h3>
          <p className="text-gray-500 text-sm">Monitor ingredients and equipment stock.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
              placeholder="Search stock..." 
              value={inventorySearch}
              onChange={e => setInventorySearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setInvModal({ type: 'ADD', item: null })}
            className="bg-burgundy text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined">add</span>
            New Item
          </button>
        </div>
      </div>
      <div className="p-0 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-8 py-5">Material</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Level</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {store.inventory
              .filter((i: InventoryItem) => i.name.toLowerCase().includes(inventorySearch.toLowerCase()))
              .map((row: InventoryItem) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 font-bold text-dark-gray">{row.name}</td>
                <td className="px-8 py-5 text-gray-500 text-sm">{row.category}</td>
                <td className="px-8 py-5 font-mono text-sm">{row.stock} {row.unit}</td>
                <td className="px-8 py-5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    row.status === 'CRITICAL' ? 'text-red-600 bg-red-50' : 
                    row.status === 'LOW' ? 'text-orange-600 bg-orange-50' : 'text-olive bg-olive/10'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right relative">
                  <button 
                    onClick={() => setActiveInventoryId(activeInventoryId === row.id ? null : row.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                  >
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                  {activeInventoryId === row.id && (
                    <div className="absolute right-8 top-12 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 w-48 text-left animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={() => { setInvModal({ type: 'IMPORT', item: row }); setActiveInventoryId(null); }}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold"
                      >
                        <span className="material-symbols-outlined text-[18px] text-burgundy">add_box</span> Import Stock
                      </button>
                      <button 
                        onClick={() => { setInvModal({ type: 'ADJUST', item: row }); setActiveInventoryId(null); }}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold"
                      >
                        <span className="material-symbols-outlined text-[18px] text-cheese">settings</span> Adjust Specs
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={() => { if(confirm('Remove this item?')) store.removeInventoryItem(row.id); setActiveInventoryId(null); }}
                        className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm font-bold text-red-600"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span> Delete Record
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  //update khi có BE
const renderStaff = () => (
  <div className="bg-white rounded-2xl shadow-sm p-8 animate-in fade-in">
    <h3 className="text-2xl font-black uppercase mb-6">Staff Management</h3>

    <table className="w-full border-collapse">
      <thead className="text-xs uppercase text-gray-400 font-black">
        <tr>
          <th className="text-left pb-4 px-2">Name</th>
          <th className="text-left pb-4 px-2">Role</th>
          <th className="text-center pb-4 px-2">Status</th>
          <th className="text-right pb-4 px-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {staffList.map(s => (
          <tr key={s.id} className="border-t hover:bg-gray-50 transition-colors">
            <td className="py-4 px-2 font-bold text-gray-800">{s.name}</td>

            <td className="py-4 px-2">
              <select
                value={s.role}
                onChange={e => updateStaffRole(s.id, e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white cursor-pointer outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Waiter">Waiter</option>
                <option value="Kitchen">Kitchen</option>
              </select>
            </td>

            <td className="py-4 px-2 text-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                  s.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s.active ? 'ACTIVE' : 'DISABLED'}
              </span>
            </td>

            <td className="py-4 px-2 text-right">
              <button
                onClick={() => toggleStaffStatus(s.id)}
                className={`font-bold text-sm transition-colors ${
                  s.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                }`}
              >
                {s.active ? 'Disable' : 'Enable'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const updateStaffRole = (id: string, role: string) => {
  setStaffList(prev =>
    prev.map(s => (s.id === id ? { ...s, role } : s))
  );
};
const toggleStaffStatus = (id: string) => {
  setStaffList(prev =>
    prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
  );
};

const renderVoucher = () => (
  <div className="bg-white rounded-2xl shadow-sm p-8 animate-in fade-in">
    <h3 className="text-2xl font-black uppercase mb-6">Voucher Management</h3>

    <table className="w-full border-collapse">
      <thead className="text-xs uppercase text-gray-400 font-black">
        <tr>
          <th className="text-left pb-4 px-2">Name</th>
          <th className="text-left pb-4 px-2">Type</th>
          <th className="text-center pb-4 px-2">Value</th>
          <th className="text-center pb-4 px-2">Status</th>
          <th className="text-right pb-4 px-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {voucherList.map(v => (
          <tr key={v.id} className="border-t hover:bg-gray-50 transition-colors">
            <td className="py-4 px-2 font-bold text-gray-800">{v.name}</td>
            
            <td className="py-4 px-2 text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {v.type}
              </span>
            </td>

            <td className="py-4 px-2 text-center font-mono font-bold text-gray-700">
              {v.value}
            </td>

            <td className="py-4 px-2 text-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                  v.active 
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {v.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </td>

            <td className="py-4 px-2 text-right">
              <button
                onClick={() => toggleVoucher(v.id)}
                className={`text-sm font-bold transition-colors ${
                  v.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                }`}
              >
                {v.active ? 'Disable' : 'Enable'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const toggleVoucher = (id: string) => {
  setVoucherList(prev =>
    prev.map(v => (v.id === id ? { ...v, active: !v.active } : v))
  );
};

      const renderReports = () => (
  <div className="space-y-8 animate-in fade-in">
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h4 className="font-black mb-4">Monthly Revenue</h4>
      <div className="h-64 bg-gray-50 rounded-xl" />
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h4 className="font-black mb-4">Inventory Cost</h4>
      <div className="h-48 bg-gray-50 rounded-xl" />
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h4 className="font-black mb-4">Staff Salary</h4>
      <div className="h-48 bg-gray-50 rounded-xl" />
    </div>
  </div>
);

const renderCurrentView = () => {
  switch (activeTab) {
    case 'DASHBOARD': return renderDashboard();
    case 'MENU': return renderMenu();
    case 'INVENTORY': return renderInventory();
    case 'REPORTS': return renderReports();
    case 'STAFF': return renderStaff();
    case 'VOUCHER': return renderVoucher();
    default: return null;
  }
};

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-light">
      <aside className="w-72 flex-shrink-0 bg-burgundy flex flex-col shadow-2xl z-[60]">
        <div className="h-24 flex items-center gap-3 px-8 border-b border-white/10">
          <div className="bg-white/20 rounded-xl size-10 flex items-center justify-center ring-2 ring-white/10">
            <span className="material-symbols-outlined text-white text-2xl">restaurant</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-black tracking-tighter uppercase leading-none">CulinaAdmin</h1>
            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">PRO Terminal</span>
          </div>
        </div>
        
        <nav className="flex-1 py-10 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'fill' : ''}`}>
                {item.icon}
              </span>
              <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto size-1.5 rounded-full bg-cheese shadow-lg"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4">
          <button 
            onClick={store.logout} 
            className="w-full flex items-center gap-4 px-5 py-4 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all text-sm font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10">
            <img src={store.user?.avatar} className="size-11 rounded-2xl ring-2 ring-cheese/20" alt="Admin" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-white truncate leading-none mb-1">{store.user?.fullName}</span>
              <span className="text-[9px] text-cheese/60 uppercase font-black">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50/50">
        <header className="h-24 flex items-center justify-between px-10 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-[50]">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Culina / {activeTab}</p>
            <h2 className="text-2xl font-black text-dark-gray uppercase tracking-tighter">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 uppercase tracking-widest">
               {new Date().toDateString()}
             </span>
          </div>
        </header>

        <div className="p-10">
          {renderCurrentView()}
        </div>
      </main>

      {/* MODALS */}

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black uppercase tracking-tight">{editingMenuItem ? 'Update Menu' : 'New Dish'}</h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="material-symbols-outlined">close</button>
            </div>
            <form onSubmit={handleMenuSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1">Dish Name</label>
                <input name="name" defaultValue={editingMenuItem?.name} required className="w-full border-gray-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1">Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingMenuItem?.price} required className="w-full border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1">Category</label>
                  <select name="category" defaultValue={editingMenuItem?.category || 'Main Courses'} className="w-full border-gray-200 rounded-xl">
                    <option>Main Courses</option>
                    <option>Appetizers</option>
                    <option>Desserts</option>
                    <option>Drinks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1">Description</label>
                <textarea name="description" defaultValue={editingMenuItem?.description} required className="w-full border-gray-200 rounded-xl min-h-[80px]" />
              </div>
              <button type="submit" className="w-full py-4 bg-burgundy text-white font-black uppercase tracking-widest rounded-2xl shadow-lg">
                Confirm Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Action Modals */}
      {invModal.type && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-tight">
                {invModal.type === 'IMPORT' ? 'Import Stock' : invModal.type === 'ADD' ? 'Add New Material' : 'Adjust Item Details'}
              </h3>
              <button onClick={() => setInvModal({ type: null, item: null })} className="material-symbols-outlined">close</button>
            </div>
            <form onSubmit={handleInventoryAction} className="p-8 space-y-6">
               {invModal.type === 'IMPORT' ? (
                 <div className="space-y-4">
                   <p className="text-gray-500 text-sm">Add stock for <strong>{invModal.item?.name}</strong>.</p>
                   <div>
                     <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Amount to Add ({invModal.item?.unit})</label>
                     <input name="amount" type="number" step="0.1" required className="w-full border-gray-200 rounded-xl text-lg font-bold" autoFocus />
                   </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Material Name</label>
                      <input name="name" defaultValue={invModal.item?.name || ''} required className="w-full border-gray-200 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Category</label>
                        <input name="category" defaultValue={invModal.item?.category || ''} required className="w-full border-gray-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Unit (kg, L, units)</label>
                        <input name="unit" defaultValue={invModal.item?.unit || ''} required className="w-full border-gray-200 rounded-xl" />
                      </div>
                    </div>
                    {invModal.type === 'ADD' && (
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Initial Stock Level</label>
                        <input name="stock" type="number" step="0.1" required className="w-full border-gray-200 rounded-xl text-lg font-bold" />
                      </div>
                    )}
                 </div>
               )}
               <button type="submit" className="w-full py-4 bg-burgundy text-white font-black uppercase tracking-widest rounded-2xl shadow-lg">
                 Confirm
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Manual Order UI */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-[200] flex bg-white animate-in slide-in-from-bottom duration-500 overflow-hidden">
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-white">
              <h3 className="text-2xl font-black uppercase tracking-tight">Direct Ordering</h3>
              <button onClick={() => setIsManualOrderOpen(false)} className="material-symbols-outlined">close</button>
            </div>
            <div className="p-8 space-y-4">
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Assign Table</label>
                <div className="grid grid-cols-4 gap-2">
                  {store.tables.map((t: any) => (
                    <button 
                      key={t.id} 
                      onClick={() => setSelectedTable(t.id)}
                      className={`h-12 rounded-xl font-bold transition-all ${selectedTable === t.id ? 'bg-burgundy text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}
                    >
                      {t.id}
                    </button>
                  ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cart Summary</h4>
              {manualCart.length === 0 ? (
                <div className="h-40 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-300 font-bold uppercase text-xs">Empty</div>
              ) : (
                manualCart.map(i => (
                  <div key={i.id} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-dark-gray">{i.name}</p>
                      <p className="text-xs text-gray-500">{i.quantity} x ${i.price}</p>
                    </div>
                    <button onClick={() => setManualCart(prev => prev.filter(item => item.id !== i.id))} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-8 bg-white border-t border-gray-200">
               <div className="flex justify-between items-end mb-6">
                 <p className="text-xs font-black uppercase text-gray-400">Total Due</p>
                 <p className="text-4xl font-black text-burgundy">${manualCart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</p>
               </div>
               <button onClick={submitManualOrder} className="w-full py-5 bg-cheese text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-cheese/20">
                 Send Order
               </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col p-10 overflow-y-auto">
            <h3 className="text-3xl font-black text-dark-gray uppercase tracking-tighter mb-8">Menu Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.menu.map((item: MenuItem) => (
                <button 
                  key={item.id}
                  onClick={() => item.available && addToManualCart(item)}
                  className={`bg-white border-2 p-4 rounded-3xl text-left transition-all hover:border-burgundy shadow-sm flex gap-4 ${!item.available ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                >
                  <div className="size-16 rounded-2xl bg-cover shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                  <div>
                    <p className="font-bold text-md leading-tight">{item.name}</p>
                    <p className="text-burgundy font-black text-sm">${item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
