import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { login, register } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function SignIn() {
    const [email, setEmail] = useState('demo@local.com');
    const [name, setName] = useState('Demo');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const { setAuth } = useAuth();
    const nav = useNavigate();
    const qc = useQueryClient();


    const doRegister = async () => {
        setErr(null); setLoading(true);
        try {
            const res = await register(email, name);
            setAuth(res);
            qc.clear();
            nav('/');
        } catch (e: any) {
            setErr(e.message ?? 'Failed');
        } finally { setLoading(false); }
    };

    const doLogin = async () => {
        setErr(null); setLoading(true);
        try {
            const res = await login(email);
            setAuth(res);
            qc.clear();
            nav('/');
        } catch (e: any) {
            setErr(e.message ?? 'Failed');
        } finally { setLoading(false); }
    };

    return (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
            <Card sx={{ minWidth: 360 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h6">Sign in</Typography>
                        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField label="Name (for register)" value={name} onChange={e => setName(e.target.value)} />
                        {err && <Typography color="error">{err}</Typography>}
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={doRegister} disabled={loading}>Register</Button>
                            <Button onClick={doLogin} disabled={loading}>Login</Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
