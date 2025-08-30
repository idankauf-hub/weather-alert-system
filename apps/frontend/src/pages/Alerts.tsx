import AddAlertIcon from '@mui/icons-material/AddAlert';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Box, Button, Card, CardContent, IconButton, MenuItem, Snackbar, Stack, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import Spinner from '../components/Spinner';
import { useAlertsList, useCreateAlert, useDeleteAlert, useEvaluateAlert } from '../hooks/useAlerts';
import { useTriggeredIdSet } from '../hooks/useStates';
import { getErrMsg } from '../lib/errors';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PARAMS = ['temperature', 'windSpeed', 'precipitation'] as const;
const OPS = ['gt', 'gte', 'lt', 'lte', 'eq'] as const;

export default function Alerts() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [mode, setMode] = useState<'city' | 'coords'>('coords');
    const [city, setCity] = useState('');
    const [lat, setLat] = useState('32.0853');
    const [lon, setLon] = useState('34.7818');
    const [param, setParam] = useState<typeof PARAMS[number]>('temperature');
    const [op, setOp] = useState<typeof OPS[number]>('gt');
    const [value, setValue] = useState('30');
    const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({ open: false, msg: '', type: 'success' });
    const [evaluatingId, setEvaluatingId] = useState<string | null>(null);


    const list = useAlertsList();
    const create = useCreateAlert();
    const del = useDeleteAlert();
    const evaluate = useEvaluateAlert();
    const { data: triggeredSet } = useTriggeredIdSet();


    const onSubmit = () => {
        const body: any = {
            name: name.trim() || undefined,
            description: desc.trim() || undefined,
            parameter: param,
            threshold: { op, value: Number(value) },
        };
        if (mode === 'city') {
            if (!city.trim()) return;
            body.city = city.trim();
        } else {
            const nlat = Number(lat), nlon = Number(lon);
            if (!Number.isFinite(nlat) || !Number.isFinite(nlon)) return;
            body.lat = nlat; body.lon = nlon;
        }
        create.mutate(body, {
            onSuccess: () => {
                setToast({ open: true, msg: 'Alert created', type: 'success' });
                setName(''); setDesc(''); setCity(''); setLat('32.0853'); setLon('34.7818'); setValue('30');
            },
            onError: (e: any) => setToast({ open: true, msg: getErrMsg(e), type: 'error' })
        });
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h5">Alerts</Typography>

            <Card>
                <CardContent>
                    <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
                        <TextField label="Description" value={desc} onChange={e => setDesc(e.target.value)} sx={{ minWidth: 260 }} />

                        <TextField
                            select label="Parameter" value={param}
                            onChange={e => setParam(e.target.value as any)}
                        >
                            {PARAMS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                        </TextField>

                        <TextField select label="Op" value={op} onChange={e => setOp(e.target.value as any)}>
                            {OPS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                        </TextField>

                        <TextField label="Value" type="number" value={value} onChange={e => setValue(e.target.value)} />

                        <TextField
                            select label="Location mode" value={mode}
                            onChange={e => setMode(e.target.value as any)}
                        >
                            <MenuItem value="coords">Coords</MenuItem>
                            <MenuItem value="city">City</MenuItem>
                        </TextField>

                        {mode === 'city' ? (
                            <TextField label="City" value={city} onChange={e => setCity(e.target.value)} sx={{ minWidth: 220 }} />
                        ) : (
                            <>
                                <TextField label="Lat" type="number" value={lat} onChange={e => setLat(e.target.value)} />
                                <TextField label="Lon" type="number" value={lon} onChange={e => setLon(e.target.value)} />
                            </>
                        )}

                        <Button variant="contained" onClick={onSubmit} disabled={create.isPending}>
                            {create.isPending ? 'Saving…' : 'Create'}
                        </Button>
                    </Stack>

                    {create.isError && (
                        <MuiAlert severity="error" variant="outlined" sx={{ mt: 1 }} icon={<ErrorOutlineIcon />}>
                            {getErrMsg(create.error)}
                        </MuiAlert>
                    )}
                </CardContent>
            </Card>
            <Card sx={{ maxHeight: 420, overflow: 'hidden' }}>
                <CardContent sx={{ pb: 1 }}>
                    <Typography variant="h6" sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper', pb: 1 }}>
                        Saved alerts
                    </Typography>
                </CardContent>

                <Box sx={{ overflowY: 'auto', maxHeight: 360, px: 2, pb: 2 }}>
                    {list.isLoading && <Typography sx={{ px: 1, py: 1 }}>Loading…</Typography>}
                    {list.isError && (
                        <MuiAlert severity="error" variant="outlined" sx={{ mx: 2, my: 1 }} icon={<ErrorOutlineIcon />}>
                            {getErrMsg(list.error)}
                        </MuiAlert>
                    )}

                    {Array.isArray(list.data) && list.data.length ? (
                        <Stack spacing={1}>
                            {list.data.map(a => {
                                const isTriggered = triggeredSet?.has(a?._id);

                                return (
                                    <Card key={a._id} variant="outlined">
                                        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography sx={{ minWidth: 200 }}>{a.name || 'unnamed'}</Typography>
                                            <Typography sx={{ opacity: 0.8 }}>
                                                {a.parameter} {a.threshold.op} {a.threshold.value}
                                            </Typography>
                                            <Typography sx={{ opacity: 0.8 }}>
                                                {a.city ? `city: ${a.city}` : `(${a.lat}, ${a.lon})`}
                                            </Typography>
                                            <Typography sx={{ ml: 'auto', opacity: 0.6 }}>
                                                {new Date(a.createdAt).toLocaleString()}
                                            </Typography>
                                            <Tooltip title={isTriggered ? 'Triggered' : 'All clear'}>
                                                <span>
                                                    <IconButton
                                                        onClick={() => {
                                                            setEvaluatingId(a._id);
                                                            evaluate.mutate(a._id, {
                                                                onSettled: () => setEvaluatingId(null),
                                                            });
                                                        }}
                                                        disabled={evaluatingId === a._id || evaluate.isPending}
                                                        color={isTriggered ? 'success' : 'default'}
                                                    >
                                                        {evaluatingId === a._id ? (
                                                            <Spinner />
                                                        ) : isTriggered ? (
                                                            <NotificationsActiveIcon />
                                                        ) : (
                                                            <AddAlertIcon />
                                                        )}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <IconButton
                                                onClick={() =>
                                                    del.mutate(a._id, {
                                                        onSuccess: () => setToast({ open: true, msg: 'Alert deleted', type: 'success' }),
                                                        onError: (e: any) => setToast({ open: true, msg: getErrMsg(e), type: 'error' })
                                                    })
                                                }
                                                disabled={del.isPending && evaluatingId === a._id}
                                                title="Delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                        </CardContent>
                                    </Card>
                                )
                            }
                            )}
                        </Stack>
                    ) : (
                        !list.isLoading && <Typography sx={{ px: 1, py: 1 }}>No alerts yet</Typography>
                    )}
                </Box>
            </Card>
            <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast(s => ({ ...s, open: false }))}>
                <MuiAlert severity={toast.type} variant="filled">{toast.msg}</MuiAlert>
            </Snackbar>

        </Stack>

    );
}
