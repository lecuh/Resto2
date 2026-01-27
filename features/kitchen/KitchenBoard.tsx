
import React from 'react';
import { OrderStatus, Order } from '../../types';

type KitchenTab = 'ACTIVE' | 'HISTORY' | 'INVENTORY';

const KitchenBoard: React.FC<{ store: any }> = ({ store }) => {
  const [activeTab, setActiveTab] = React.useState<KitchenTab>('ACTIVE');
  const newOrders = store.orders.filter((o: Order) => o.status === OrderStatus.PENDING);
  const preparingOrders = store.orders.filter((o: Order) => o.status === OrderStatus.COOKING);
  const readyOrders = store.orders.filter((o: Order) => o.status === OrderStatus.READY);

  return (
    <div className="flex h-screen bg-[#111111] text-white font-display overflow-hidden">
      <aside className="w-[280px] bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-cheese p-2 rounded-lg"><span className="material-symbols-outlined text-slate-900 font-bold">restaurant_menu</span></div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">KITCHEN SYNC</span>
              <span className="text-[10px] text-cheese font-black uppercase">Live Queue</span>
            </div>
          </div>
          <nav className="space-y-2">
            <button
  onClick={() => setActiveTab('ACTIVE')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-bold
    ${activeTab === 'ACTIVE'
      ? 'bg-white/10 border-white/10 text-white'
      : 'text-gray-400 hover:text-white'}
  `}
>
  <span className="material-symbols-outlined text-cheese">view_kanban</span>
  Active Orders
</button>
            <button
  onClick={() => setActiveTab('HISTORY')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold
    ${activeTab === 'HISTORY'
      ? 'bg-white/10 text-white'
      : 'text-gray-400 hover:text-white'}
  `}
>
  <span className="material-symbols-outlined">history</span>
  History
</button>

            <button
  onClick={() => setActiveTab('INVENTORY')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold
    ${activeTab === 'INVENTORY'
      ? 'bg-white/10 text-white'
      : 'text-gray-400 hover:text-white'}
  `}
>
  <span className="material-symbols-outlined">inventory</span>
  Inventory
</button>

          </nav>
        </div>
        <div className="p-6">
          <button onClick={store.logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 font-bold mb-4 transition-all">
            <span className="material-symbols-outlined">logout</span>Logout
          </button>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="size-10 rounded-xl bg-cheese text-slate-900 flex items-center justify-center font-black">MC</div>
            <div className="flex flex-col"><span className="text-white font-bold text-sm">Marcus Chef</span><span className="text-gray-500 text-[10px] font-black uppercase">Head Chef</span></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-slate-900">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Main Kitchen Station</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="size-2 bg-olive rounded-full"></span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Station 01 • Active</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right"><p className="text-3xl font-black tabular-nums text-burgundy">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p><p className="text-[10px] text-gray-500 uppercase font-black">Service Time</p></div>
            <div className="flex gap-2">
              <button className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined">refresh</span></button>
              <button className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative"><span className="material-symbols-outlined">notifications</span><span className="absolute top-3 right-3 size-2 bg-burgundy rounded-full"></span></button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-x-auto p-8 gap-8 bg-[#1A1A1A]">
            {activeTab === 'ACTIVE' && (
        <>
          {/* New Orders */}
          <div className="flex flex-col min-w-[380px] w-1/3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="size-2 bg-burgundy rounded-full shadow-lg shadow-burgundy/50"></div><h2 className="text-sm font-black uppercase tracking-widest">New Orders</h2></div>
              <span className="bg-burgundy/20 text-burgundy text-[10px] px-3 py-1 rounded-full font-bold uppercase">{newOrders.length} Tickets</span>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto pb-10 scrollbar-hide">
              {newOrders.map(o => (
                <div key={o.id} className="bg-slate-800 border-2 border-burgundy rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-pulse">
                  <div className="p-5 bg-slate-900 flex justify-between">
                    <div><h3 className="text-3xl font-black">Table {o.tableId}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">Ticket #{o.id} • Janet</p></div>
                    <div className="bg-burgundy px-3 py-1 rounded-md text-xs font-black uppercase flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span>22m</div>
                  </div>
                  <div className="p-6 space-y-4">
                    {o.items.map(i => (
                      <div key={i.id} className="flex gap-4 items-start">
                        <div className="size-7 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cheese">{i.quantity}x</div>
                        <div><p className="text-xl font-bold">{i.name}</p><p className="text-xs text-gray-400 italic font-medium">{i.note}</p></div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => store.updateOrderStatus(o.id, OrderStatus.COOKING)} className="m-4 bg-cheese text-slate-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest shadow-lg">Start Prep <span className="material-symbols-outlined">play_arrow</span></button>
                </div>
              ))}
            </div>
          </div>

          {/* Preparing */}
          <div className="flex flex-col min-w-[380px] w-1/3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="size-2 bg-cheese rounded-full shadow-lg shadow-cheese/50"></div><h2 className="text-sm font-black uppercase tracking-widest">Preparing</h2></div>
              <span className="bg-cheese/10 text-cheese text-[10px] px-3 py-1 rounded-full font-bold uppercase">{preparingOrders.length} Tickets</span>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto pb-10 scrollbar-hide">
              {preparingOrders.map(o => (
                <div key={o.id} className="bg-slate-800 border-2 border-cheese rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-5 bg-slate-900 flex justify-between">
                    <div><h3 className="text-3xl font-black text-cheese">Table {o.tableId}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">Ticket #{o.id}</p></div>
                   <svg
                    className="animate-spin h-6 w-6 text-cheese"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  </div>
                  <div className="p-6 space-y-4">
                    {o.items.map(i => (
                      <div key={i.id} className="flex gap-4 items-start">
                        <div className="size-7 rounded bg-cheese/10 border border-cheese/20 flex items-center justify-center font-bold text-cheese">{i.quantity}x</div>
                        <p className="text-xl font-bold">{i.name}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => store.updateOrderStatus(o.id, OrderStatus.READY)} className="m-4 bg-olive text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest">Mark Ready <span className="material-symbols-outlined">check_circle</span></button>
                </div>
              ))}
            </div>
          </div>

          {/* Ready */}
          <div className="flex flex-col min-w-[380px] w-1/3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="size-2 bg-olive rounded-full shadow-lg shadow-olive/50"></div><h2 className="text-sm font-black uppercase tracking-widest">Ready to Serve</h2></div>
              <span className="bg-olive/10 text-olive text-[10px] px-3 py-1 rounded-full font-bold uppercase">{readyOrders.length} Tickets</span>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto pb-10 scrollbar-hide">
              {readyOrders.map(o => (
                <div key={o.id} className="bg-slate-800 border border-olive/30 rounded-2xl overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
                   <div className="p-5 bg-slate-900"><h3 className="text-2xl font-black">Table {o.tableId}</h3><p className="text-[10px] text-gray-500 uppercase mt-1">Ticket #{o.id} • Completed</p></div>
                   <div className="p-6">
                     <p className="text-olive font-black text-xs uppercase flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-sm">notifications_active</span> Waiter Called</p>
                     <div className="space-y-2">
                       {o.items.map(i => <p key={i.id} className="text-sm text-gray-400 line-through">{i.name}</p>)}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
            {activeTab === 'HISTORY' && (
              <div className="text-gray-400 font-bold text-xl">
                Order History (Coming soon)
              </div>
            )}

            {activeTab === 'INVENTORY' && (
              <div className="text-gray-400 font-bold text-xl">
                Inventory Management (Coming soon)
              </div>
              )}</>
            )}</main>
      </div>
    </div>
  );
};

export default KitchenBoard;
