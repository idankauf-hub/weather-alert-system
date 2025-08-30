import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';
import { useCreateAlert } from '../../../hooks/useAlerts';
import { type Operator, OPS, type Parameter, PARAMS } from '../../../lib/alertConsts';
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
        <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Description" value={desc} onChange={e => setDesc(e.target.value)} sx={{ minWidth: 260 }} />

            <TextField select label="Parameter" value={param} onChange={e => setParam((e.target as HTMLInputElement).value as Parameter)}>
                {PARAMS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>

            <TextField select label="Op" value={op} onChange={e => setOp((e.target as HTMLInputElement).value as Operator)}>
                {OPS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>

            <TextField label="Value" type="number" value={value} onChange={e => setValue(e.target.value)} />

            <TextField select label="Location mode" value={mode} onChange={e => setMode((e.target as HTMLInputElement).value as 'city' | 'coords')}>
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

            {create.isError && (
                <MuiAlert severity="error" variant="outlined" sx={{ mt: 1 }} icon={<ErrorOutlineIcon />}>
                    {getErrMsg(create.error)}
                </MuiAlert>
            )}
        </Stack>
    );
}
