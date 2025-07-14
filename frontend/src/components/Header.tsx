import { Notifications } from '@mui/icons-material';
import { Avatar, IconButton, Typography } from '@mui/material';

export default function Header() {
    return (
        <div className="flex items-center justify-between w-full">
            <Typography
                variant="h6"
                className="text-brand-100"
                component="div"
            >
                BUDGET WISE
            </Typography>
            <div className="flex items-center space-x-4">
                <IconButton
                    className="bg-brand-500 hover:bg-brand-600 text-brand-50 !p-2 rounded"
                >
                    <Notifications className="text-brand-50" />
                </IconButton>
                <Avatar
                    src="/profile.jpg"
                    className="border-2 border-brand-500"
                />
            </div>
        </div>
    );
}
