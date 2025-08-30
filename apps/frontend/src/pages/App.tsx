import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function App() {
    const { user, clearAuth } = useAuth();
    const qc = useQueryClient();

    const nav = useNavigate();

    const LogOut = () => {
        clearAuth();
        qc.clear();
        nav('/signin', { replace: true });
    }
    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ gap: 1 }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/alerts">Alerts</Button>
                    <Button color="inherit" component={Link} to="/state">Current State</Button>
                    <Box sx={{ flex: 1 }} />
                    {user ? (
                        <>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>{user.email}</Typography>
                            <Button color="inherit" onClick={LogOut}>Logout</Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/signin">Sign in</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 3 }}>
                <Outlet />
            </Container>
        </>
    );
}