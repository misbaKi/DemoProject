import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00BCFF', // Bayer Blue
            dark: '#0098d4',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#6BBE44', // Bayer Green
            contrastText: '#ffffff',
        },
        background: {
            default: '#f4f7f9',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a2b3b',
            secondary: '#64748b',
        },
        sidebar: {
            main: '#003359', // Bayer Dark Blue
            text: '#94a3b8',
            active: '#ffffff',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.025em',
        },
        h2: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 800,
            letterSpacing: '-0.025em',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '8px 20px',
                },
                containedPrimary: {
                    boxShadow: '0 4px 6px -1px rgba(0, 188, 255, 0.2)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 188, 255, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: 16,
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                },
            },
        },
    },
});

export default theme;
