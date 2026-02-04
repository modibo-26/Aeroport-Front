import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import FlightTakeoff from '@mui/icons-material/FlightTakeoff';
import FlightLand from '@mui/icons-material/FlightLand';
import AccessTime from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function VolCard({ vol }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)

    const getStatutColor = (statut) => {
        switch (statut) {
            case 'A_L_HEURE': return 'success';
            case 'RETARDE': return 'warning';
            case 'ANNULE': return 'error';
            default: return 'default';
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case 'A_L_HEURE': return 'À l\'heure';
            case 'RETARDE': return 'Retardé';
            case 'ANNULE': return 'Annulé';
            default: return statut;
        }
    };

    return (
        <Card sx={{ 
            width: 320, 
            borderRadius: 3, 
            boxShadow: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
            }
        }}>
            <Box sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {vol.compagnie}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                        {vol.numeroVol}
                    </Typography>
                </Box>
                <Chip 
                    label={getStatutLabel(vol.statut)} 
                    color={getStatutColor(vol.statut)}
                    size="small"
                />
            </Box>

            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <FlightTakeoff fontSize="small" color="primary" />
                        <Typography variant="body1" fontWeight="bold">{vol.origine}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(vol.dateDepart), 'HH:mm')}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ 
                        flex: 1, 
                        mx: 1, 
                        borderTop: '1px dashed #ccc',
                        position: 'relative'
                    }}>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                left: '50%', 
                                transform: 'translateX(-50%)',
                                bgcolor: 'white',
                                px: 0.5,
                                color: 'text.secondary'
                            }}
                        >
                            ✈
                        </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                        <FlightLand fontSize="small" color="primary" />
                        <Typography variant="body1" fontWeight="bold">{vol.destination}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(vol.dateArrivee), 'HH:mm')}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                        {format(new Date(vol.dateDepart), 'EEE dd MMM', { locale: fr })}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            À partir de
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            {vol.prixBase} €
                        </Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => navigate(`/vols/${vol.id}`)}
                        sx={{ borderRadius: 2 }}
                    >
                        Voir détails
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default VolCard;
