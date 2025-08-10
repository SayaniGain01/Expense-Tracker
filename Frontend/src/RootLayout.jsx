
import { Outlet } from 'react-router-dom';
import AppContextProvider from './context/AppContext';

export default function RootLayout() {
  return (
    <AppContextProvider>
      <Outlet />
    </AppContextProvider>
  );
}
