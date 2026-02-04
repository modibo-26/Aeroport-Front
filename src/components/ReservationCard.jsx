import { Card, CardContent, Typography, Button, Box, Chip, Divider } from '@mui/material';
import FlightTakeoff from '@mui/icons-material/FlightTakeoff';
import EventSeat from '@mui/icons-material/EventSeat';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { ConfirmationNumber, FlightLand } from '@mui/icons-material';

function ReservationCard({ reservation, vol, onAnnuler, onConfirmer }) {
    const getStatutColor = (statut) => {
        switch (statut) {
            case 'CONFIRMEE': return 'success';
            case 'EN_ATTENTE': return 'warning';
            case 'ANNULEE': return 'error';
            default: return 'default';
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case 'CONFIRMEE': return 'Confirmée';
            case 'EN_ATTENTE': return 'En attente';
            case 'ANNULEE': return 'Annulée';
            default: return statut;
        }
    };

    return (
        <Card sx={{ maxWidth: 350, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ 
                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                color: 'white',
                p: 2
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Réservation #{reservation.id}
                    </Typography>
                    <Chip 
                        label={getStatutLabel(reservation.statut)} 
                        color={getStatutColor(reservation.statut)}
                        size="small"
                        sx={{ color: 'white' }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ConfirmationNumber color="primary" />
                    <Typography variant="body1">
                        Vol n°{vol.numeroVol}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EventSeat color="primary" />
                    <Typography variant="body1">
                        {reservation.nombrePlaces} place{reservation.nombrePlaces > 1 ? 's' : ''}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FlightTakeoff color="primary" />
                    <Typography variant="body1">
                        {vol.origine}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FlightLand color="primary" />
                    <Typography variant="body1">
                        {vol.destination}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday color="primary" />
                    <Typography variant="body2" color="text.secondary">
                        {format(new Date(vol.dateDepart), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {reservation.statut === 'EN_ATTENTE' && (
                        <>
                            <Button 
                                variant="contained" 
                                color="success"
                                fullWidth
                                onClick={() => onConfirmer(reservation.id)}
                            >
                                Confirmer
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error"
                                fullWidth
                                onClick={() => onAnnuler(reservation.id)}
                            >
                                Annuler
                            </Button>
                        </>
                    )}
                    {reservation.statut === 'CONFIRMEE' && (
                        <Button 
                            variant="outlined" 
                            color="error"
                            fullWidth
                            onClick={() => onAnnuler(reservation.id)}
                        >
                            Annuler
                        </Button>
                    )}
                    {reservation.statut === 'ANNULEE' && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                            Cette réservation a été annulée
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default ReservationCard;
