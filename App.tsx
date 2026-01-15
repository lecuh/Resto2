
import React, { useMemo } from 'react';
import { useAppStore } from './app/store/useStore';
import { UserRole } from './types';
import Login from './features/auth/Login';
import AdminDashboard from './features/admin/AdminDashboard';
import StaffOrderView from './features/staff/StaffOrderView';
import KitchenBoard from './features/kitchen/KitchenBoard';
import CheckoutView from './features/cashier/CheckoutView';
import CustomerMenu from './features/customer/CustomerMenu';

const App: React.FC = () => {
  const store = useAppStore();

  const renderedContent = useMemo(() => {
    if (!store.user) {
      return <Login onLogin={store.login} />;
    }

    switch (store.user.role) {
      case UserRole.ADMIN:
        return <AdminDashboard store={store} />;
      case UserRole.STAFF:
        return <StaffOrderView store={store} />;
      case UserRole.KITCHEN:
        return <KitchenBoard store={store} />;
      case UserRole.CASHIER:
        return <CheckoutView store={store} />;
      case UserRole.CUSTOMER:
        return <CustomerMenu store={store} />;
      default:
        return <Login onLogin={store.login} />;
    }
  }, [store.user, store.orders, store.menu, store.tables]);

  return (
    <div className="min-h-screen bg-light-gray">
      {renderedContent}
    </div>
  );
};

export default App;
