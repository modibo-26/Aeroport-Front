import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editVol, fetchVolById, updateStatutVol } from "../services/volService";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { AccessTime, AirlineSeatReclineNormal, FlightLand, FlightTakeoff } from '@mui/icons-material'
import { format} from 'date-fns';
import { fr } from 'date-fns/locale';
import { createReservation, fetchByVolId } from "../services/reservationService";
import { SnackbarContext } from "../context/SnackbarContext";

function VolDetails() {

    const {user} = useContext(AuthContext);
    const { showSnackbar } = useContext(SnackbarContext)
    const {id} = useParams();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [vol, setVol] = useState(null);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false)
    const [nombrePlaces, setNombrePlaces] = useState(1);
    const [editVolData, setEditVol] = useState({});
    const [openReservations, setOpenReservations] = useState(false)
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        fetchVolById(id).then(response => {
            setVol(response.data);
        }).catch(error => {
            console.error("Error fetching vol details:", error);
        }).finally(() => {
            setLoading(false)
        });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleReserver = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user)
        setOpen(true);
    }

    const handleConfirmReservation = async () => {
        try {
            console.log(vol.placesDisponibles)
            await createReservation({volId : vol.id, passagerId : user.id, nombrePlaces})
            console.log(vol.placesDisponibles)
            setOpen(false)
            showSnackbar('Vol réservé avec succès !', 'success');
            navigate('/user/reservations')
        } catch (error) {
            console.error('Error reservation')
        }
    }

    const handleOpenEdit = () => {
        setEditVol({...vol});
        setOpenEdit(true);
    }

    const handleEditVol = async () => {
        try {
            await editVol(vol.id, editVolData);
            setOpenEdit(false);
            showSnackbar('Vol modifié!', 'success');
            // refresh le vol
            refreshVols();
        } catch (error) {
            console.error("Error modification:", error);
        }
    };

    const handleStatutChange = async (statut) => {
        try {
            await updateStatutVol(vol.id, statut)
            showSnackbar('Statut changé avec succès !', 'success');
            refreshVols();
        } catch (error) {
            console.error("Error statut change:", error);
        }
    }

    const handleOpenReservations = async () => {
        try {
            const res = await fetchByVolId(vol.id);
            setReservations(res.data);
            setOpenReservations(true);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const refreshVols = async () => {
        try {
            fetchVolById(id).then(res => setVol(res.data));
        } catch (error) {
            console.error("Error refresh vols:", error);
        }
    }

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
            <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 3 }}>
                <Box sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white',
                    p: 3
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            {vol.compagnie}
                        </Typography>
                        <Chip 
                            label={getStatutLabel(vol.statut)} 
                            color={getStatutColor(vol.statut)}
                            size="small"
                        />
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                        {vol.numeroVol}
                    </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <FlightTakeoff color="primary" />
                            <Typography variant="h6" fontWeight="bold">{vol.origine}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {format(new Date(vol.dateDepart), 'HH:mm', { locale: fr })}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ flex: 1, mx: 2, borderTop: '2px dashed #ccc' }} />
                        
                        <Box sx={{ textAlign: 'center' }}>
                            <FlightLand color="primary" />
                            <Typography variant="h6" fontWeight="bold">{vol.destination}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {format(new Date(vol.dateArrivee), 'HH:mm', { locale: fr })}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {format(new Date(vol.dateDepart), 'EEEE dd MMMM yyyy', { locale: fr })}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AirlineSeatReclineNormal fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {vol.placesDisponibles} places disponibles
                            </Typography>
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            {vol.prixBase} €
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            onClick={handleReserver}
                            disabled={vol.statut === 'ANNULE' || vol.placesDisponibles === 0}
                            sx={{ borderRadius: 2, py: 1.5 }}
                        >
                            {vol.statut === 'ANNULE' ? 'Vol annulé' : 
                            vol.placesDisponibles === 0 ? 'Complet' : 'Réserver'}
                        </Button>
                        {user?.role === 'ADMIN' && (
                            <>
                                <Button variant="outlined" onClick={handleOpenEdit}>
                                    Modifier
                                </Button>
                                <Button variant="outlined" onClick={handleOpenReservations}>
                                    Réservations
                                </Button>
                                <FormControl size="small" sx={{ minWidth: 120}}>
                                    <Select
                                        value={vol.statut} onChange={(e) => handleStatutChange(e.target.value)}
                                    >
                                        <MenuItem value="A_L_HEURE">À l'heure</MenuItem>
                                        <MenuItem value="RETARDE">Rétardé</MenuItem>
                                        <MenuItem value="ANNULE">Annulé</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>

                </CardContent>
            </Card>
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Modifier le vol</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Numéro de vol"
                        fullWidth
                        margin="normal"
                        value={editVolData.numeroVol || ''}
                        onChange={(e) => setEditVol({...editVolData, numeroVol: e.target.value})}
                    />
                    <TextField
                        label="Compagnie"
                        fullWidth
                        margin="normal"
                        value={editVolData.compagnie || ''}
                        onChange={(e) => setEditVol({...editVolData, compagnie: e.target.value})}
                    />
                    <TextField
                        label="Origine"
                        fullWidth
                        margin="normal"
                        value={editVolData.origine || ''}
                        onChange={(e) => setEditVol({...editVolData, origine: e.target.value})}
                    />
                    <TextField
                        label="Destination"
                        fullWidth
                        margin="normal"
                        value={editVolData.destination || ''}
                        onChange={(e) => setEditVol({...editVolData, destination: e.target.value})}
                    />
                    <TextField
                        label="Date de départ"
                        type="datetime-local"
                        fullWidth
                        margin="normal"
                        value={editVolData.dateDepart?.slice(0, 16) || ''}
                        onChange={(e) => setEditVol({...editVolData, dateDepart: e.target.value})}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Date d'arrivée"
                        type="datetime-local"
                        fullWidth
                        margin="normal"
                        value={editVolData.dateArrivee?.slice(0, 16) || ''}
                        onChange={(e) => setEditVol({...editVolData, dateArrivee: e.target.value})}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Places disponibles"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editVolData.placesDisponibles || ''}
                        onChange={(e) => setEditVol({...editVolData, placesDisponibles: e.target.value})}
                    />
                    <TextField
                        label="Prix de base"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editVolData.prixBase || ''}
                        onChange={(e) => setEditVol({...editVolData, prixBase: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
                    <Button onClick={handleEditVol} variant="contained">Enregistrer</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Réserver un vol</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Nombre de places"
                            type="number"
                            slotProps={{ htmlInput: {min: 1, max: vol.placesDisponibles}}}
                            value={nombrePlaces}
                            onChange={(e) => setNombrePlaces(Math.min(Math.max(1, e.target.value), vol.placesDisponibles))}
                            fullWidth
                        />
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            fullWidth 
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            onClick={handleConfirmReservation}
                        >
                            Confirmer la réservation
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={openReservations} onClose={() => setOpenReservations(false)} maxWidth="md" fullWidth>
                <DialogTitle>Réservations du vol {vol.numeroVol}</DialogTitle>
                <DialogContent>
                    {reservations.length === 0 ? (
                        <Typography>Aucune réservation pour ce vol</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Passager ID</TableCell>
                                        <TableCell>Places</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reservations.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.id}</TableCell>
                                            <TableCell>{r.passagerId}</TableCell>
                                            <TableCell>{r.nombrePlaces}</TableCell>
                                            <TableCell>{r.statut}</TableCell>
                                            <TableCell>{format(new Date(r.dateReservation), 'dd/MM/yyyy HH:mm', { locale: fr })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReservations(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default VolDetails;