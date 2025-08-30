import { Card, CardContent, Typography } from '@mui/material';

export default function Metric({ label, value, unit }: { label: string; value: string | number | null | undefined; unit?: string }) {
    return (
        <Card sx={{ minWidth: 160 }}>
            <CardContent>
                <Typography variant="overline" color="text.secondary">{label}</Typography>
                <Typography variant="h5">{value ?? '—'} {value != null && unit ? unit : ''}</Typography>
            </CardContent>
        </Card>
    );
}
