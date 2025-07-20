import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { loginUser } from '../feature/auth/authSlice';
import type { Auth } from '../feature/auth/authType';
import { useAppDispatch, useAppSelector } from '../hooks';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState<Auth>({ username: '', password: '' });
    const navigate = useNavigate();

    const authData = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (authData.isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [authData.isAuthenticated, navigate]);

    return (
        <AuthLayout>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Login to Your Account
                </Typography>

                <Stack spacing={3} component="form">
                    <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
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
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button variant="contained" fullWidth onClick={(e) => {
                        e.preventDefault();
                        dispatch(loginUser(form))
                    }}>
                        {authData.loading ? 'Logging in...' : 'Login'}
                    </Button>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        fontSize="0.875rem"
                    >
                        <Link href="#" onClick={() => alert('Password reset flow')}>
                            Forgot password?
                        </Link>
                        <Link
                            component="button"
                            onClick={() => navigate('/signup')}
                            underline="hover"
                        >
                            Don’t have an account? Sign up
                        </Link>
                    </Box>
                </Stack>
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
