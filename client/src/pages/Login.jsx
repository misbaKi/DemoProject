import { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Paper,
    Divider,
    Fade
} from '@mui/material';
import {
    LockOutlined as LockIcon,
    PersonOutline as UserIcon,
    ShieldOutlined as ShieldIcon,
    VerifiedUser as VerifiedIcon
} from '@mui/icons-material';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { username, password });
            onLogin(data.user, data.token);
            toast.success('Identity verified: Welcome to Bayer CTMS.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Access Denied: Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at top right, #003359, #001a2d)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Glows */}
            <Box sx={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(0, 188, 255, 0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />
            <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '30%', height: '30%', background: 'rgba(107, 190, 68, 0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />

            <Fade in={true} timeout={800}>
                <Card sx={{ width: '100%', maxWidth: 440, p: 5, borderRadius: 6, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: 'none' }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: '50%',
                                bgcolor: 'white',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                mb: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                border: '3px solid #f8fafc'
                            }}
                        >
                            <img src="/bayer_logo_official.png" alt="Bayer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: '-0.04em' }}>Clinical Portal</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Trial Management Access</Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: 1 }}>Researcher Username</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="ID-Number / Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <UserIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3, bgcolor: '#f8fafc', height: 52 }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: 1 }}>Secure Access Key</Typography>
                            <TextField
                                fullWidth
                                type="password"
                                variant="outlined"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3, bgcolor: '#f8fafc', height: 52 }
                                }}
                            />
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            sx={{ py: 2, borderRadius: 3, fontSize: '1rem', fontWeight: 700 }}
                        >
                            {loading ? 'Authenticating...' : 'Sign In To Workbench'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'secondary.main' }}>
                        <VerifiedIcon sx={{ fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Enterprise Secure Auth</Typography>
                    </Box>
                </Card>
            </Fade>

            <Box sx={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon sx={{ fontSize: 14 }} />
                &copy; {new Date().getFullYear()} Bayer AG. Internal Clinical Investigation Network.
            </Box>
        </Box>
    );
}

export default Login;
