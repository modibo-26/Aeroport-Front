import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

function PaiementSuccess() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 3 }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main' }} />
            <Typography variant="h4" fontWeight="bold">
                Paiement réussi !
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Votre réservation a été confirmée avec succès.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/user/reservations')}>
                Voir mes réservations
            </Button>
        </Box>
    );
}

export default PaiementSuccess;
