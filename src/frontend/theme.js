import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#6d28d9' },
        background: { default: '#eef2ff', paper: '#ffffff' },
        text: { primary: '#111827', secondary: '#6b7280' }
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h6: { fontWeight: 800 }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: { boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 16 }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: { borderRadius: 8 }
            }
        }
    }
});

export default theme;
