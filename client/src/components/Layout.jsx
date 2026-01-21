import { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Paper
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Science as BeakerIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Logout as LogoutIcon,
    KeyboardArrowDown as ChevronDownIcon,
    NotificationsNone as BellIcon,
    Shield as ShieldIcon,
    Settings as SettingsIcon,
    HelpOutline as HelpIcon,
    AccountCircle as UserIcon
} from '@mui/icons-material';

const drawerWidth = 280;

function Layout({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        onLogout();
        navigate('/login');
    };

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Clinical Trials', icon: <BeakerIcon />, path: '/trials' },
        { text: 'Participant Hub', icon: <PeopleIcon />, path: '/participants' },
        { text: 'Analytical Reports', icon: <BarChartIcon />, path: '/reports' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: 'sidebar.main',
                        color: 'white',
                        border: 'none',
                    },
                }}
            >
                <Box sx={{ p: 4, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                bgcolor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <img src="/bayer_logo_official.png" alt="Bayer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>Bayer</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: 'sidebar.text', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, mt: 0.5 }}>CTMS Portal</Typography>
                        </Box>
                    </Box>
                </Box>

                <List sx={{ px: 2, flexGrow: 1 }}>
                    <Typography sx={{ px: 2, mb: 1, fontSize: '0.7rem', color: 'sidebar.text', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Menu</Typography>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                sx={{
                                    borderRadius: 2,
                                    color: 'sidebar.text',
                                    '&.active': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        color: 'white'
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>


            </Drawer>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Navbar */}
                <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', px: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
                            <span>Management</span>
                            <span>/</span>
                            <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.85rem' }}>
                                {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 0.5, borderRadius: 10, '&:hover': { bgcolor: 'action.hover' } }} onClick={handleMenu}>
                                <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.1 }}>{user?.username}</Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>{user?.role}</Typography>
                                </Box>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: 'primary.main',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {user?.username?.substring(0, 1).toUpperCase()}
                                </Avatar>
                                <ChevronDownIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            </Box>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                PaperProps={{
                                    elevation: 4,
                                    sx: { mt: 1.5, minWidth: 220, borderRadius: 3, border: '1px solid', borderColor: 'divider' }
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', mb: 1 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' }}>{user?.username}</Typography>
                                </Box>
                                
                                <Divider sx={{ my: 1 }} />
                                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, borderRadius: 1.5, mx: 1, color: 'error.main' }}>
                                    <LogoutIcon fontSize="small" /> Logout Session
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Content Area */}
                <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                    <Outlet />
                </Box>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        p: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                        bgcolor: 'white'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        &copy; {new Date().getFullYear()} Bayer India. All Rights Reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;
