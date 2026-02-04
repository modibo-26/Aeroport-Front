import { Alert, Snackbar } from "@mui/material";
import { createContext, useState } from "react";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message:'', severity: 'succes' })

    const  showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }

    const handleClose = () => {
        setSnackbar({...snackbar, open: false});
    }

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity={snackbar.severity} onClose={handleClose}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider> 
    )
}