import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';
import { useAuth } from './context/AuthContext';
import RequireAuth from './RequireAuth';

export default function App() {
  const { user, clearAuth } = useAuth();
  const nav = useNavigate();



  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1 }}>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/alerts">Alerts</Button>
              <Button color="inherit" component={Link} to="/state">Current State</Button>
            </>
          )}
          <Box sx={{ flex: 1 }} />
          {user ? (
            <>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>{user.email}</Typography>
              <Button
                color="inherit"
                onClick={() => {
                  clearAuth();
                  nav('/signin', { replace: true });
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/signin">Sign in</Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <RequireAuth>
          <Outlet />
        </RequireAuth>
      </Container>
    </>
  );
}
