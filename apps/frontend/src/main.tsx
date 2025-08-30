import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import App from './App';
import Spinner from './components/Spinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Alerts from './pages/Alerts/Alerts';
import CurrentState from './pages/CurrentState';

const qc = new QueryClient();

function Gate({ children }: { children: React.ReactNode }) {
  const { ready } = useAuth();
  if (!ready) return <Spinner />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: '/signin', element: <SignIn /> },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'state', element: <CurrentState /> }
    ],
  },
  { path: '*', loader: () => redirect('/signin') },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Gate>
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Gate>
    </AuthProvider>
  </React.StrictMode>
);
