import AddAlertIcon from '@mui/icons-material/AddAlert';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import type { useState } from 'react';
import Spinner from '../../../components/Spinner';
import Toast from '../../../components/Toast';
import { useDeleteAlert, useEvaluateAlert } from '../../../hooks/useAlerts';
import type { getErrMsg } from '../../../lib/errors';


type Props = {
    alert: any;
    isTriggered: boolean;
};

export default function AlertListItem({ alert, isTriggered }: Props) {
    const [evaluating, setEvaluating] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
        open: false, msg: '', type: 'success',
    });

    const evaluate = useEvaluateAlert();
    const del = useDeleteAlert();

    const onEvaluate = () => {
        setEvaluating(true);
        evaluate.mutate(alert._id, {
            onSuccess: () => setToast({ open: true, msg: 'Checked', type: 'success' }),
            onError: (e: any) => setToast({ open: true, msg: getErrMsg(e), type: 'error' }),
            onSettled: () => setEvaluating(false),
        });
    };

    const onDelete = () => {
        del.mutate(alert._id, {
            onSuccess: () => setToast({ open: true, msg: 'Alert deleted', type: 'success' }),
            onError: (e: any) => setToast({ open: true, msg: getErrMsg(e), type: 'error' }),
        });
    };

    return (
        <>
            <Card variant="outlined">
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography sx={{ minWidth: 200 }}>{alert.name || 'unnamed'}</Typography>
                    <Typography sx={{ opacity: 0.8 }}>
                        {alert.parameter} {alert.threshold.op} {alert.threshold.value}
                    </Typography>
                    <Typography sx={{ opacity: 0.8 }}>
                        {alert.city ? `city: ${alert.city}` : `(${alert.lat}, ${alert.lon})`}
                    </Typography>
                    <Typography sx={{ ml: 'auto', opacity: 0.6 }}>
                        {new Date(alert.createdAt).toLocaleString()}
                    </Typography>

                    <Tooltip title={isTriggered ? 'Triggered' : 'All clear'}>
                        <span>
                            <IconButton
                                onClick={onEvaluate}
                                disabled={evaluating || evaluate.isPending}
                                color={isTriggered ? 'success' : 'default'}
                            >
                                {evaluating ? <Spinner /> : isTriggered ? <NotificationsActiveIcon /> : <AddAlertIcon />}
                            </IconButton>
                        </span>
                    </Tooltip>

                    <IconButton onClick={onDelete} disabled={del.isPending} title="Delete">
                        <DeleteIcon />
                    </IconButton>
                </CardContent>
            </Card>

            <Toast open={toast.open} type={toast.type} onClose={() => setToast(s => ({ ...s, open: false }))}>
                {toast.msg}
            </Toast>
        </>
    );
}
