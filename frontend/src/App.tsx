import { useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { fetchNotifications } from './api/notificationsApi';
import { getDemoUserId, setDemoUserId } from './api/client';
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

function ProtectedRoute({ demoUserId }: { demoUserId: string }) {
  return demoUserId ? <AppLayout /> : <Navigate to="/login" replace />;
}

function App() {
  const [demoUserId, setSessionUserIdState] = useState(getDemoUserId());
  const [unseenNotifications, setUnseenNotifications] = useState(0);

  const setSessionUserId = useCallback((value: string) => {
    setDemoUserId(value);
    setSessionUserIdState(value);
  }, []);

  const refreshNotificationCount = useCallback(async () => {
    if (!demoUserId) {
      setUnseenNotifications(0);
      return;
    }
    const notifications = await fetchNotifications();
    setUnseenNotifications(notifications.filter((notification) => !notification.seen).length);
  }, [demoUserId]);

  const contextValue = useMemo(
    () => ({ demoUserId, setSessionUserId, unseenNotifications, refreshNotificationCount }),
    [demoUserId, setSessionUserId, unseenNotifications, refreshNotificationCount],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute demoUserId={demoUserId} />}>
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
