import { Card, CardContent, Stack, Typography } from '@mui/material';
import Metric from './Metric';
import type { WeatherDto } from '../lib/api';

export default function WeatherCard({ data }: { data?: WeatherDto }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Current Weather</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {data?.time ? new Date(data.time).toLocaleString() : '—'}
                </Typography>
                <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                    <Metric label="Temperature" value={data?.temperature} unit="°C" />
                    <Metric label="Wind Speed" value={data?.windSpeed} />
                    <Metric label="Precipitation" value={data?.precipitation} />
                </Stack>
            </CardContent>
        </Card>
    );
}
