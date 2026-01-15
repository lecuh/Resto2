
import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';

const CheckoutView: React.FC<{ store: any }> = ({ store }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const activeOrders = store.orders.filter((o: Order) => o.status !== OrderStatus.PAID && o.status !== OrderStatus.CANCELLED);
  
  const selectedOrder = activeOrders.find((o: Order) => o.id === selectedOrderId) || activeOrders[0];

  return (
    <div className="flex h-screen bg-light-gray font-display overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-24 bg-slate-900 flex flex-col items-center py-8 shrink-0 h-full border-r border-white/5">
        <div className="mb-10 text-cheese">
          <span className="material-symbols-outlined text-4xl">restaurant</span>
        </div>
        
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="relative">
            <img src={store.user?.avatar} className="size-12 rounded-2xl border-2 border-burgundy shadow-lg" alt="User Avatar" />
            <div className="absolute -bottom-1 -right-1 size-4 bg-olive rounded-full border-2 border-slate-900"></div>
          </div>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Cashier</span>
        </div>

        <nav className="flex flex-col gap-6 flex-1">
          <button className="w-14 h-14 flex items-center justify-center rounded-2xl text-white bg-burgundy shadow-lg shadow-burgundy/20 transition-all scale-110">
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
          </button>
          <button className="w-14 h-14 flex items-center justify-center rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">dashboard</span>
          </button>
          <button className="w-14 h-14 flex items-center justify-center rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">analytics</span>
          </button>
        </nav>

        {/* Improved Logout Button */}
        <button 
          onClick={store.logout} 
          className="mt-auto w-14 h-14 flex items-center justify-center rounded-2xl text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white transition-all shadow-sm group"
          title="Sign Out"
        >
          <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-300">logout</span>
        </button>
      </aside>

      <main className="flex-1 flex overflow-hidden">
        {/* Orders List Section */}
        <section className="w-[420px] bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h1 className="text-2xl font-black text-dark-gray uppercase tracking-tighter">Live Orders</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Payment Terminal</p>
            </div>
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-black text-burgundy uppercase shadow-sm">{activeOrders.length} Waiting</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {activeOrders.length > 0 ? (
              activeOrders.map(o => (
                <div 
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group ${selectedOrder?.id === o.id ? 'border-burgundy bg-burgundy/[0.02] shadow-md' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-black text-lg transition-colors ${selectedOrder?.id === o.id ? 'text-burgundy' : 'text-dark-gray'}`}>Table {o.tableId}</h3>
                    <span className="text-burgundy font-black text-lg">${o.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{o.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      o.status === OrderStatus.READY ? 'bg-olive/10 text-olive' : 'bg-cheese/10 text-cheese'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4 opacity-50">
                <span className="material-symbols-outlined text-6xl">cloud_done</span>
                <p className="font-black uppercase text-xs tracking-widest">All orders cleared</p>
              </div>
            )}
          </div>
        </section>

        {/* Order Detail & Checkout Section */}
        <section className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {selectedOrder ? (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-4xl font-black text-dark-gray tracking-tighter uppercase">Table {selectedOrder.tableId}</h2>
                    <span className="bg-olive text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-sm shadow-olive/20">Verified</span>
                  </div>
                  <p className="text-gray-500 font-bold text-sm">Order #{selectedOrder.id} • {selectedOrder.items.length} Items Summary</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-gray-600 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    Print
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-gray-600 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">split_screen</span>
                    Split
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <table className="w-full text-left">
                  <thead className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] border-b-2 border-gray-50">
                    <tr>
                      <th className="pb-6">Item Description</th>
                      <th className="pb-6 text-center">Qty</th>
                      <th className="pb-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedOrder.items.map(item => (
                      <tr key={item.id} className="group">
                        <td className="py-6">
                          <p className="font-black text-dark-gray text-lg">{item.name}</p>
                          <p className="text-xs text-gray-400 font-bold">Category: Main</p>
                        </td>
                        <td className="py-6 text-center">
                          <span className="bg-gray-50 text-dark-gray px-4 py-2 rounded-xl font-black text-sm border border-gray-100">{item.quantity}</span>
                        </td>
                        <td className="py-6 text-right font-black text-dark-gray text-lg">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-10 bg-gray-50 border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Summary</p>
                      <div className="flex gap-6 text-sm font-bold text-gray-500">
                        <p>Subtotal: ${(selectedOrder.total * 0.9).toFixed(2)}</p>
                        <p>Tax (10%): ${(selectedOrder.total * 0.1).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-1">Total Amount</p>
                      <p className="text-6xl font-black text-burgundy tracking-tighter">${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <button 
                      onClick={() => store.updateOrderStatus(selectedOrder.id, OrderStatus.PAID)} 
                      className="group bg-cheese hover:bg-orange-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 uppercase tracking-widest shadow-xl shadow-cheese/20 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">payments</span>
                      <div className="text-left">
                        <p className="text-[10px] opacity-80 leading-none mb-1">Method 01</p>
                        <p className="text-lg">Cash Payment</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => store.updateOrderStatus(selectedOrder.id, OrderStatus.PAID)} 
                      className="group bg-slate-900 hover:bg-black text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all active:scale-95 border-b-4 border-slate-700 active:border-b-0"
                    >
                      <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">credit_card</span>
                      <div className="text-left">
                        <p className="text-[10px] opacity-80 leading-none mb-1">Method 02</p>
                        <p className="text-lg">Card / Digital</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center flex-col text-gray-200 gap-6 bg-gray-50/50">
              <div className="size-32 rounded-full border-8 border-dashed border-gray-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-200">point_of_sale</span>
              </div>
              <div className="text-center">
                <p className="font-black text-xl text-gray-400 uppercase tracking-tighter">Terminal Standby</p>
                <p className="text-gray-400 font-bold text-sm mt-1">Select an active order to begin checkout</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CheckoutView;
