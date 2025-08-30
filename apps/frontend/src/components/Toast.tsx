import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
    open: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    autoHideMs?: number;
}>;

export default function Toast({ open, type, onClose, children, autoHideMs = 2500 }: Props) {
    return (
        <Snackbar open={open} autoHideDuration={autoHideMs} onClose={onClose}>
            <MuiAlert severity={type} variant="filled">{children}</MuiAlert>
        </Snackbar>
    );
}
