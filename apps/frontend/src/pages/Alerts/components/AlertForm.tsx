import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';
import { useCreateAlert } from '../../../hooks/useAlerts';
import { type Operator, OPS_MAP, type Parameter, PARAMS } from '../../../lib/alertConsts';
import type { CreateAlertInput } from '../../../lib/alerts';
import { getErrMsg } from '../../../lib/errors';


const DEFAULT_LAT = '32.0853';
const DEFAULT_LON = '34.7818';

export default function AlertForm() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [mode, setMode] = useState<'city' | 'coords'>('coords');
    const [city, setCity] = useState('');
    const [lat, setLat] = useState(DEFAULT_LAT);
    const [lon, setLon] = useState(DEFAULT_LON);
    const [param, setParam] = useState<Parameter>('temperature');
    const [op, setOp] = useState<Operator>('gt');
    const [value, setValue] = useState('30');

    const create = useCreateAlert();

    const onSubmit = () => {
        const body: CreateAlertInput = {
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
                setName(''); setDesc(''); setCity('');
                setLat(DEFAULT_LAT); setLon(DEFAULT_LON);
                setValue('30');
            },
        });
    };

    return (
        <Box>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>General</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 300px', minWidth: 220 }}>
                            <TextField fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} />
                        </Box>
                        <Box sx={{ flex: '2 1 420px', minWidth: 260 }}>
                            <TextField fullWidth label="Description" value={desc} onChange={e => setDesc(e.target.value)} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Condition</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                            <TextField
                                select
                                fullWidth
                                label="Parameter"
                                value={param}
                                onChange={e => setParam((e.target as HTMLInputElement).value as Parameter)}
                            >
                                {PARAMS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </TextField>
                        </Box>

                        <Box sx={{ flex: '0 0 120px', minWidth: 110 }}>
                            <TextField
                                select
                                fullWidth
                                label="Condition"
                                value={op}
                                onChange={e => setOp((e.target as HTMLInputElement).value as Operator)}
                            >
                                {OPS_MAP.map(o => (
                                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box sx={{ flex: '0 0 140px', minWidth: 120 }}>
                            <TextField fullWidth label="Value" type="number" value={value} onChange={e => setValue(e.target.value)} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Location</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                            <TextField
                                select
                                fullWidth
                                label="Location mode"
                                value={mode}
                                onChange={e => setMode((e.target as HTMLInputElement).value as 'city' | 'coords')}
                            >
                                <MenuItem value="coords">Coords</MenuItem>
                                <MenuItem value="city">City</MenuItem>
                            </TextField>
                        </Box>

                        {mode === 'city' ? (
                            <Box sx={{ flex: '2 1 360px', minWidth: 220 }}>
                                <TextField fullWidth label="City" value={city} onChange={e => setCity(e.target.value)} />
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ flex: '0 0 140px', minWidth: 120 }}>
                                    <TextField fullWidth label="Lat" type="number" value={lat} onChange={e => setLat(e.target.value)} />
                                </Box>
                                <Box sx={{ flex: '0 0 140px', minWidth: 120 }}>
                                    <TextField fullWidth label="Lon" type="number" value={lon} onChange={e => setLon(e.target.value)} />
                                </Box>
                            </>
                        )}

                        <Box sx={{ flex: '1 1 160px', minWidth: 140, display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            <Button variant="contained" onClick={onSubmit} disabled={create.isPending}>
                                {create.isPending ? 'Saving…' : 'Create'}
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {create.isError && (
                    <MuiAlert severity="error" variant="outlined" icon={<ErrorOutlineIcon />}>
                        {getErrMsg(create.error)}
                    </MuiAlert>
                )}
            </Stack>
        </Box>
    );
}
