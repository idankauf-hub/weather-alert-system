import { useState } from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';
import { useWeather } from '../hooks/useWeather';
import WeatherCard from '../components/WeatherCard';


const DEFAULT_LAT = '32.0853';
const DEFAULT_LON = '34.7818';

export default function Home() {
    const [latInput, setLatInput] = useState(DEFAULT_LAT);
    const [lonInput, setLonInput] = useState(DEFAULT_LON);
    const [coords, setCoords] = useState({ lat: 32.0853, lon: 34.7818 });

    const { data, isFetching, error } = useWeather(coords.lat, coords.lon);

    return (
        <Stack spacing={2}>
            <Typography variant="h5">Home</Typography>

            <Stack direction="row" spacing={2}>
                <TextField
                    label="Latitude"
                    type="number"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                />
                <TextField
                    label="Longitude"
                    type="number"
                    value={lonInput}
                    onChange={(e) => setLonInput(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        const lat = Number(latInput);
                        const lon = Number(lonInput);
                        if (Number.isFinite(lat) && Number.isFinite(lon)) {
                            setCoords({ lat, lon });
                        }
                    }}
                >
                    Update
                </Button>
            </Stack>

            {error && <Typography color="error">{error.message}</Typography>}
            {isFetching && <Typography>Loading…</Typography>}

            <WeatherCard data={data} />
        </Stack>
    );
}
