
import React, { useState } from 'react';
import { User, UserRole } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const PREDEFINED_USERS = [
  { username: 'admin', password: '123', role: UserRole.ADMIN, name: 'Alex Thompson' },
  { username: 'staff', password: '123', role: UserRole.STAFF, name: 'Sarah Jenkins' },
  { username: 'kitchen', password: '123', role: UserRole.KITCHEN, name: 'Marcus Chef' },
  { username: 'cashier', password: '123', role: UserRole.CASHIER, name: 'Michael Cash' },
  { username: 'customer', password: '123', role: UserRole.CUSTOMER, name: 'Guest Table 05' },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PREDEFINED_USERS.find(u => u.username === username && u.password === password);
    if (found) {
      onLogin({
        id: found.username,
        username: found.username,
        fullName: found.name,
        role: found.role,
        avatar: `https://i.pravatar.cc/150?u=${found.username}`
      });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-light-gray relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://picsum.photos/seed/restaurant/1920/1080")', backgroundSize: 'cover' }}></div>
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10">
        <div className="hidden md:flex flex-col justify-between w-5/12 p-12 bg-burgundy text-white">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <span className="material-symbols-outlined text-4xl">restaurant</span>
              <h1 className="text-2xl font-bold tracking-tight">RestoManager</h1>
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight mb-6">
              Excellence in every <span className="text-cheese">service</span>.
            </h2>
            <p className="text-white/70 text-lg">The complete kitchen and floor management system.</p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cheese animate-pulse"></span>
              <span className="text-sm font-semibold uppercase tracking-wider">System Online</span>
            </div>
            <p className="text-xs text-white/50">Version 2.0.4-Stable</p>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-dark-gray mb-2">Login</h3>
          <p className="text-gray-500 mb-8">Enter your credentials to access the system.</p>
          
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-dark-gray text-xs font-bold uppercase mb-2">Username</label>
              <input 
                className="w-full rounded-xl border-gray-200 h-14 px-4 focus:ring-burgundy focus:border-burgundy transition-all"
                placeholder="Try: admin, staff, kitchen..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-dark-gray text-xs font-bold uppercase mb-2">Password</label>
              <input 
                className="w-full rounded-xl border-gray-200 h-14 px-4 focus:ring-burgundy focus:border-burgundy transition-all"
                type="password"
                placeholder="•••••••• (123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
            
            <button className="h-14 bg-cheese hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 uppercase tracking-wide">
              <span>Log In</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-12 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Demo Accounts (Pass: 123):</p>
            <div className="flex flex-wrap gap-2">
              {['admin', 'staff', 'kitchen', 'cashier', 'customer'].map(role => (
                <button 
                  key={role}
                  onClick={() => { setUsername(role); setPassword('123'); }}
                  className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-burgundy hover:bg-burgundy hover:text-white transition-all uppercase"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
