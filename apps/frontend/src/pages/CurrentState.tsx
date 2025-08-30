
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import Spinner from '../components/Spinner';
import { useCurrentStates } from '../hooks/useStates';

export default function CurrentState() {
    const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useCurrentStates();

    const lastUpdated =
        dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" gap={2}>
                <Typography variant="h5" sx={{ flex: 1 }}>Current State</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Last updated: {lastUpdated}
                </Typography>
                <Tooltip title="Refresh now">
                    <span>
                        <Button
                            variant="outlined"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            startIcon={isFetching ? <Spinner /> : <RefreshIcon />}
                        >
                            {isFetching ? 'Refreshing…' : 'Refresh'}
                        </Button>
                    </span>
                </Tooltip>
            </Stack>

            {isLoading && <Typography>Loading…</Typography>}
            {isError && <Typography color="error">{String(error)}</Typography>}

            {!isLoading && !isError && (!data || data.length === 0) && (
                <Card>
                    <CardContent>
                        <Typography variant="h5">All Clear</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            No alerts are currently triggered.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {data?.map(item => (
                <Card key={item.alert._id}>
                    <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography sx={{ minWidth: 200 }}>{item.alert.name || 'unnamed'}</Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                            {item.alert.parameter} {item.alert.threshold.op} {item.alert.threshold.value}
                        </Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                            {item.alert.city ? `city: ${item.alert.city}` : `(${item.alert.lat}, ${item.alert.lon})`}
                        </Typography>
                        <Typography sx={{ ml: 'auto', opacity: 0.8 }}>
                            observed: {item.state.observedValue} • {new Date(item.state.checkedAt).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}
