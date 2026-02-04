import { createTheme } from "@mui/material";

const theme = createTheme({ 
    palette: {
        primary: {
            main: '#1565c0'
        },
        secondary: {
            main: '#ff6f00'
        },
        background: {
            default: '#f5f7fa',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Robotto", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides:  {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme