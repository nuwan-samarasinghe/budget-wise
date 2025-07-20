import {
    Email,
    Lock,
    Person,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <AuthLayout>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Create Your Account
                </Typography>

                <Stack spacing={3} component="form">
                    <TextField
                        label="Name"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((s) => !s)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button variant="contained" fullWidth>
                        Sign Up
                    </Button>

                    <Box textAlign="right" fontSize="0.875rem">
                        <Link
                            component="button"
                            onClick={() => navigate('/login')}
                            underline="hover"
                        >
                            Already have an account? Login
                        </Link>
                    </Box>
                </Stack>
            </Box>
        </AuthLayout>
    );
};

export default SignupPage;
