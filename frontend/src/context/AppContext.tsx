import { createContext, useContext } from 'react';

export interface AppContextValue {
  demoUserId: string;
  setSessionUserId: (value: string) => void;
  unseenNotifications: number;
  refreshNotificationCount: () => Promise<void>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContext');
  }
  return context;
}
