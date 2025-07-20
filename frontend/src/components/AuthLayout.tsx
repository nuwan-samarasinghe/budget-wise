import { Box, Container, Paper } from '@mui/material';
import React from 'react';
import authImage from '../assets/auth-image.png';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Left: Form content */}
            <Box
                component={Paper}
                elevation={6}
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        {children}
                    </Box>
                </Container>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'block' },
                    backgroundImage: `url(${authImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </Box>
    );
};

export default AuthLayout;
