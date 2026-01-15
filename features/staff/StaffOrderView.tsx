
import React, { useState } from 'react';
import { OrderStatus, Order, MenuItem, OrderItem, Table } from '../../types';

const StaffOrderView: React.FC<{ store: any }> = ({ store }) => {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Ordering State
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStep, setOrderStep] = useState<'TABLE' | 'MENU'>('TABLE');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  
  // Details State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filteredOrders = store.orders.filter((o: Order) => {
    if (o.status === OrderStatus.PAID || o.status === OrderStatus.CANCELLED) return false;
    const matchesSearch = o.tableId.includes(search) || o.id.includes(search);
    const matchesFilter = filter === 'ALL' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddToOrder = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: Math.random().toString(),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        note: ""
      }];
    });
  };

  const finalizeOrder = () => {
    if (!selectedTable || cart.length === 0) return;
    store.addItemsToOrder(selectedTable, cart);
    resetOrderState();
  };

  const resetOrderState = () => {
    setIsOrdering(false);
    setOrderStep('TABLE');
    setSelectedTable(null);
    setCart([]);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-light-gray font-display">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-burgundy size-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-bold">restaurant_menu</span>
          </div>
          <h2 className="text-burgundy text-xl font-black uppercase tracking-tighter">Staff Terminal</h2>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsOrdering(true)}
            className="flex items-center gap-2 bg-cheese hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Order</span>
          </button>
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="text-right">
              <p className="text-dark-gray text-xs font-black uppercase">{store.user?.fullName}</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">On Service</p>
            </div>
            <img src={store.user?.avatar} className="size-10 rounded-2xl border-2 border-white shadow-sm ring-1 ring-gray-100" alt="Staff" />
            <button onClick={store.logout} className="p-2 text-gray-400 hover:text-burgundy"><span className="material-symbols-outlined">logout</span></button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col xl:flex-row gap-8 mb-10 justify-between items-start xl:items-end">
          <div>
            <h1 className="text-dark-gray text-4xl font-black uppercase tracking-tighter">Active Floor Orders</h1>
            <p className="text-gray-500 font-bold text-sm mt-1">Real-time synchronization with Kitchen & POS.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kitchen Load</p>
               <div className="flex items-center gap-2">
                 <span className="text-2xl font-black text-burgundy">HIGH</span>
                 <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(i => <div key={i} className={`h-4 w-1 rounded-full ${i <= 4 ? 'bg-burgundy' : 'bg-gray-100'}`}></div>)}
                 </div>
               </div>
             </div>
             <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Open Tickets</p>
               <span className="text-2xl font-black text-dark-gray">{filteredOrders.length}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-full lg:w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold" placeholder="Find Table # or Order ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto p-1">
            {['ALL', OrderStatus.PENDING, OrderStatus.COOKING, OrderStatus.READY].map(s => (
              <button 
                key={s}
                onClick={() => setFilter(s as any)}
                className={`whitespace-nowrap h-11 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${filter === s ? 'bg-burgundy text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400 hover:text-dark-gray'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all group">
              <div className="p-6 flex justify-between items-start bg-burgundy text-white">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">TABLE {order.tableId}</h3>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Ticket #{order.id}</p>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  3m Ago
                </div>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-4">
                  {order.items.slice(0, 3).map(item => (
                    <li key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-burgundy text-sm">{item.quantity}x</span>
                        <span className="text-sm font-bold text-dark-gray">{item.name}</span>
                      </div>
                    </li>
                  ))}
                  {order.items.length > 3 && (
                    <li className="text-[10px] font-black text-gray-400 uppercase tracking-widest">+{order.items.length - 3} more items...</li>
                  )}
                </ul>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    order.status === OrderStatus.PENDING ? 'bg-cheese/10 text-cheese border-cheese/20' :
                    order.status === OrderStatus.COOKING ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-olive/10 text-olive border-olive/20'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-dark-gray font-black">${order.total.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setViewingOrder(order)}
                    className="h-10 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors"
                  >
                    View Details
                  </button>
                  {order.status === OrderStatus.PENDING && (
                    <button 
                      onClick={() => store.updateOrderStatus(order.id, OrderStatus.COOKING)}
                      className="h-10 bg-burgundy text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-red-900 transition-colors"
                    >
                      Fire Ticket
                    </button>
                  )}
                  {order.status === OrderStatus.READY && (
                    <button 
                      onClick={() => store.updateOrderStatus(order.id, OrderStatus.SERVED)}
                      className="h-10 bg-olive text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-green-800 transition-colors"
                    >
                      Mark Served
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* NEW ORDER MODAL */}
      {isOrdering && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
          <header className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {orderStep === 'TABLE' ? 'Select Table' : `Ordering for Table ${selectedTable}`}
              </h2>
              <p className="text-gray-400 font-bold text-sm">Step {orderStep === 'TABLE' ? '1' : '2'} of 2</p>
            </div>
            <button onClick={resetOrderState} className="material-symbols-outlined text-gray-400 hover:text-dark-gray transition-colors text-3xl">close</button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-10">
            {orderStep === 'TABLE' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                {store.tables.map((t: Table) => (
                  <button 
                    key={t.id}
                    onClick={() => { setSelectedTable(t.id); setOrderStep('MENU'); }}
                    className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${
                      t.status === 'OCCUPIED' 
                        ? 'bg-burgundy/5 border-burgundy text-burgundy shadow-inner' 
                        : 'bg-white border-gray-100 text-gray-300 hover:border-cheese hover:text-cheese'
                    }`}
                  >
                    <span className="text-4xl font-black">{t.id}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.status}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto h-full">
                <div className="flex-1 space-y-8">
                  <h3 className="text-xl font-black uppercase tracking-tight text-gray-400">Available Menu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.menu.map((item: MenuItem) => (
                      <button 
                        key={item.id}
                        onClick={() => handleAddToOrder(item)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 text-left hover:border-burgundy transition-all hover:shadow-lg group active:scale-95"
                      >
                        <div className="size-16 rounded-xl bg-cover shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                        <div className="flex-1">
                          <p className="font-bold text-dark-gray">{item.name}</p>
                          <p className="text-burgundy font-black text-sm">${item.price}</p>
                        </div>
                        <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-burgundy group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined">add</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="w-full lg:w-[400px] flex flex-col bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
                  <div className="p-6 bg-white border-b border-gray-100">
                    <h3 className="font-black text-dark-gray uppercase tracking-widest">Ticket Items</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50">
                        <span className="material-symbols-outlined text-6xl">shopping_basket</span>
                        <p className="font-bold uppercase text-[10px] tracking-widest mt-4">Empty Ticket</p>
                      </div>
                    ) : (
                      cart.map(i => (
                        <div key={i.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm animate-in zoom-in-95 duration-200">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-dark-gray">{i.name}</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setCart(prev => prev.map(item => item.id === i.id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))} className="size-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark-gray">-</button>
                              <span className="font-black text-sm w-4 text-center">{i.quantity}</span>
                              <button onClick={() => setCart(prev => prev.map(item => item.id === i.id ? { ...item, quantity: item.quantity + 1 } : item))} className="size-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark-gray">+</button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <input 
                              placeholder="Special note..." 
                              className="flex-1 bg-gray-50 border-none rounded-lg text-[10px] py-2 font-bold focus:ring-burgundy"
                              value={i.note}
                              onChange={(e) => setCart(prev => prev.map(item => item.id === i.id ? { ...item, note: e.target.value } : item))}
                             />
                             <button onClick={() => setCart(prev => prev.filter(item => item.id !== i.id))} className="text-red-400 p-2"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-8 bg-white border-t border-gray-100">
                    <div className="flex justify-between items-end mb-6">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Added Subtotal</p>
                      <p className="text-4xl font-black text-burgundy tracking-tighter">${cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={finalizeOrder}
                      disabled={cart.length === 0}
                      className="w-full py-5 bg-olive text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-olive/20 disabled:opacity-30 active:scale-95 transition-all"
                    >
                      Send to Kitchen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Table {viewingOrder.tableId} Details</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Ticket #{viewingOrder.id} • Assigned to {viewingOrder.waiterName}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="material-symbols-outlined text-gray-400 hover:text-dark-gray">close</button>
            </div>
            <div className="p-8">
               <div className="mb-6 flex justify-between items-center">
                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    viewingOrder.status === OrderStatus.PENDING ? 'bg-cheese/10 text-cheese border-cheese/20' :
                    viewingOrder.status === OrderStatus.COOKING ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-olive/10 text-olive border-olive/20'
                  }`}>
                    Current Status: {viewingOrder.status}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created {new Date(viewingOrder.createdAt).toLocaleTimeString()}</span>
               </div>
               
               <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                 <table className="w-full">
                   <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                     <tr>
                       <th className="text-left pb-4">Item</th>
                       <th className="text-center pb-4">Qty</th>
                       <th className="text-right pb-4">Subtotal</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {viewingOrder.items.map(item => (
                       <tr key={item.id}>
                         <td className="py-4">
                           <p className="font-bold text-dark-gray">{item.name}</p>
                           {item.note && <p className="text-[10px] text-burgundy font-bold uppercase italic mt-0.5">Note: {item.note}</p>}
                         </td>
                         <td className="py-4 text-center font-black text-sm">{item.quantity}</td>
                         <td className="py-4 text-right font-black text-dark-gray">${(item.price * item.quantity).toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-end">
                  <div className="flex gap-4">
                    <button className="flex flex-col items-center gap-1 group">
                      <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-burgundy group-hover:text-white transition-all">
                        <span className="material-symbols-outlined">print</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Kitchen Copy</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group">
                      <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-olive group-hover:text-white transition-all">
                        <span className="material-symbols-outlined">receipt</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Guest Check</span>
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</p>
                    <p className="text-5xl font-black text-burgundy tracking-tighter">${viewingOrder.total.toFixed(2)}</p>
                  </div>
               </div>
               
               <button 
                onClick={() => { setSelectedTable(viewingOrder.tableId); setOrderStep('MENU'); setIsOrdering(true); setViewingOrder(null); }}
                className="w-full mt-10 py-5 bg-cheese text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-cheese/20"
               >
                 Add More Items
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOrderView;
