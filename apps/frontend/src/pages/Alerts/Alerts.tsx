import { Stack, Typography, Card, CardContent } from '@mui/material';
import AlertForm from './components/AlertForm';
import AlertsList from './components/AlertsList';


export default function Alerts() {
    return (
        <Stack spacing={3}>
            <Typography variant="h5">Alerts</Typography>

            <Card>
                <CardContent>
                    <AlertForm />
                </CardContent>
            </Card>

            <AlertsList />
        </Stack>
    );
}
