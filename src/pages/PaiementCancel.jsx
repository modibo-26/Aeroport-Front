import { Box, Typography, Button } from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

function PaiementCancel() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 3 }}>
            <Cancel sx={{ fontSize: 80, color: 'error.main' }} />
            <Typography variant="h4" fontWeight="bold">
                Paiement annulé
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Le paiement n'a pas été effectué. Votre réservation est toujours en attente.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/user/reservations')}>
                Retour aux réservations
            </Button>
        </Box>
    );
}

export default PaiementCancel;
