import { useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { fetchNotifications } from './api/notificationsApi';
import { getUserId, setUserId } from './api/client';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppContext } from './context/AppContext';
import { DashboardPage } from './pages/DashboardPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

function ProtectedRoute({ userId }: { userId: string }) {
  return userId ? <AppLayout /> : <Navigate to="/login" replace />;
}

function App() {
  const [userId, setUserIdState] = useState(getUserId());
  const [unseenNotifications, setUnseenNotifications] = useState(0);

  const setUserIdFn = useCallback((value: string) => {
    setUserId(value);
    setUserIdState(value);
  }, []);

  const refreshNotificationCount = useCallback(async () => {
    if (!userId) {
      setUnseenNotifications(0);
      return;
    }
    const notifications = await fetchNotifications();
    setUnseenNotifications(notifications.filter((notification) => !notification.seen).length);
  }, [userId]);

  const contextValue = useMemo(
    () => ({ userId, setUserId: setUserIdFn, unseenNotifications, refreshNotificationCount }),
    [userId, setUserIdFn, unseenNotifications, refreshNotificationCount],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute userId={userId} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App
