import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { ready, user } = useAuth();
    if (!ready) return <Spinner />;
    if (!user) return <Navigate to="/signin" replace />;
    return <>{children}</>;
}
