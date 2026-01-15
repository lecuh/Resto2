
import React, { useState } from 'react';
import { getAIFoodSuggestions, getAIReservationGuide } from '../../services/geminiService';
import { MenuItem, OrderStatus } from '../../types';

const CustomerMenu: React.FC<{ store: any }> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<'MENU' | 'AI' | 'STATUS'>('MENU');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);

  const askAI = async (type: 'FOOD' | 'GUIDE') => {
    if (!query) return;
    setLoadingAI(true);
    try {
      const res = type === 'FOOD' ? await getAIFoodSuggestions(query, store.menu) : await getAIReservationGuide(query);
      setAiResponse(res || "AI could not generate a response.");
    } catch (e) {
      setAiResponse("Error connecting to Gemini AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-light-gray flex flex-col">
      <header className="bg-burgundy text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">restaurant</span>
          <h1 className="text-xl font-black uppercase tracking-tight">Gourmet Haven</h1>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20"><span className="material-symbols-outlined text-[16px]">qr_code</span> Table 05</button>
          <button onClick={store.logout} className="material-symbols-outlined hover:text-cheese transition-colors">logout</button>
        </div>
      </header>

      <div className="sticky top-[64px] z-40 bg-white border-b border-gray-100 flex shadow-sm">
        <button onClick={() => setActiveTab('MENU')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'MENU' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-400'}`}>Menu</button>
        <button onClick={() => setActiveTab('AI')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'AI' ? 'text-cheese border-b-2 border-cheese' : 'text-gray-400'}`}>AI Assistant</button>
        <button onClick={() => setActiveTab('STATUS')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'STATUS' ? 'text-olive border-b-2 border-olive' : 'text-gray-400'}`}>My Order</button>
      </div>

      <main className="flex-1 p-6 pb-24 overflow-y-auto max-w-2xl mx-auto w-full">
        {activeTab === 'MENU' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-burgundy">Today's Selection</h2>
            <div className="grid grid-cols-1 gap-4">
              {store.menu.map((item: MenuItem) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex p-3 gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="size-24 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-dark-gray">{item.name}</h3>
                      <span className="text-burgundy font-black text-sm">${item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 flex-1">{item.description}</p>
                    <button onClick={() => addToCart(item)} className="mt-2 h-8 bg-cheese hover:bg-orange-600 text-white font-bold rounded-lg text-[10px] uppercase shadow-sm">Add to order</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'AI' && (
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex items-center gap-3 mb-4 text-cheese">
                  <span className="material-symbols-outlined">smart_toy</span>
                  <h2 className="text-lg font-black uppercase tracking-tight">Smart Concierge</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">"What's good today?" or "How do I book a table for 10 people?"</p>
                <div className="space-y-4">
                  <textarea 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:ring-cheese focus:border-cheese p-4 text-sm min-h-[100px]" 
                    placeholder="Ask me anything about the menu or restaurant..."
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button disabled={loadingAI} onClick={() => askAI('FOOD')} className="h-12 bg-burgundy text-white rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50">Smart Suggestion</button>
                    <button disabled={loadingAI} onClick={() => askAI('GUIDE')} className="h-12 bg-olive text-white rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50">Booking Info</button>
                  </div>
                </div>
             </div>

             {aiResponse && (
               <div className="bg-white p-6 rounded-2xl border-l-4 border-cheese shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="flex justify-between items-start mb-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-cheese">AI RESPONSE</span>
                   <button onClick={() => setAiResponse('')} className="material-symbols-outlined text-gray-300 hover:text-gray-500">close</button>
                 </div>
                 <div className="prose prose-sm max-w-none text-gray-700">
                    {aiResponse}
                 </div>
               </div>
             )}

             {loadingAI && (
               <div className="flex flex-col items-center justify-center p-12 gap-4">
                 <div className="size-12 rounded-full border-4 border-cheese border-t-transparent animate-spin"></div>
                 <p className="text-cheese font-black text-xs uppercase tracking-widest animate-pulse">Consulting the Kitchen...</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'STATUS' && (
          <div className="space-y-6 text-center">
             <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center gap-6 shadow-sm">
                <div className="size-20 rounded-full bg-olive/10 text-olive flex items-center justify-center"><span className="material-symbols-outlined text-4xl">skillet</span></div>
                <div><h3 className="text-xl font-black text-dark-gray">Preparing your feast</h3><p className="text-gray-500 text-sm mt-1">Our chefs are working on your items.</p></div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-olive h-full w-[65%] animate-pulse"></div></div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 text-left">
                <h4 className="font-bold mb-4">Current Order</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><p className="text-sm">Truffle Burger x1</p><span className="text-xs font-bold text-cheese uppercase">Cooking</span></div>
                  <div className="flex justify-between items-center"><p className="text-sm">Coca Cola x2</p><span className="text-xs font-bold text-olive uppercase">Ready</span></div>
                </div>
             </div>
          </div>
        )}
      </main>

      {cart.length > 0 && activeTab === 'MENU' && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-300">
          <button className="w-full bg-burgundy hover:bg-red-900 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-lg">
            <div className="flex items-center gap-3">
              <span className="bg-cheese text-slate-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">{cart.length}</span>
              <span>Checkout Order</span>
            </div>
            <span>${cart.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
