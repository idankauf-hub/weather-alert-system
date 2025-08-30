import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useAlertsList } from '../../../hooks/useAlerts';
import { useTriggeredIdSet } from '../../../hooks/useStates';
import { getErrMsg } from '../../../lib/errors';
import AlertListItem from './AlertListItem';

export default function AlertsList() {
    const list = useAlertsList();
    const { data: triggeredSet } = useTriggeredIdSet();

    return (
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
                        {list.data.map(a => (
                            <AlertListItem key={a._id} alert={a} isTriggered={!!triggeredSet?.has(a._id)} />
                        ))}
                    </Stack>
                ) : (
                    !list.isLoading && <Typography sx={{ px: 1, py: 1 }}>No alerts yet</Typography>
                )}
            </Box>
        </Card>
    );
}
