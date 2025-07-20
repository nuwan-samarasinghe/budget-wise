import { Alert, Snackbar } from '@mui/material';
import { closeNotification } from '../feature/notification/notificationSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

const GlobalNotification = () => {
    const dispatch = useAppDispatch();
    const { open, message, type } = useAppSelector((state) => state.notification);

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => dispatch(closeNotification())}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity={type} onClose={() => dispatch(closeNotification())} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalNotification;
