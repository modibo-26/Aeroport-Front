import { useContext, useEffect, useState } from "react";
import { createVol, fetchVols } from "../services/volService";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import VolCard from "../components/VolCard";
import { AuthContext } from "../context/AuthContext";

function Vols() {

    const { user } = useContext(AuthContext)

    const [loading, setLoading] = useState(true);
    const [vols, setVols] = useState([]);
    const [origine, setOrigine] = useState('');
    const [destination, setDestination] = useState('');
    const [origines, setOrigines] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [newVol, setNewVol] = useState({});

    const volsFiltered = vols.filter(vol =>
        (origine ? vol.origine === origine : true) &&
        (destination ? vol.destination === destination : true)
    );

    useEffect(() => {
        fetchVols().then(response => {
            setVols(response.data);
            setOrigines([...new Set(response.data.map(vol => vol.origine))]);
            setDestinations([...new Set(response.data.map(vol => vol.destination))]);
        }).catch(error => {
            console.error("Error fetching vols:", error);
        });
        setLoading(false);
    }, []);

    const handleCreateVol = async () => {
        try {
            await createVol(newVol);
            setOpenCreate(false);
            setNewVol({});  
            fetchVols().then(res => setVols(res.data))
        } catch (error) {
            console.error("Error creating vol:", error);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <FormControl fullWidth sx={{mt: 2, mb: 2 }}>
                {/* Future form controls can be added here */}
                <InputLabel htmlFor="depart-select">Départ de</InputLabel>
                <Select
                    labelId="depart-select-label"
                    id="depart-select"
                    value={origine}
                    label="Départ de"
                    onChange={(e) => setOrigine(e.target.value)}
                >
                    <MenuItem value=''>---</MenuItem>
                    {origines.map(origine => (
                        <MenuItem key={origine} value={origine}>{origine}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{mt: 2, mb: 2 }}>
                {/* Future form controls can be added here */}
                <InputLabel htmlFor="destination-select">Destination</InputLabel>
                <Select
                    labelId="destination-select-label"
                    id="destination-select"
                    value={destination}
                    label="Destination"
                    onChange={(e) => setDestination(e.target.value)}
                >
                    <MenuItem value=''>---</MenuItem>
                    {destinations.map(destination => (
                        <MenuItem key={destination} value={destination}>{destination}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {user?.role === 'ADMIN' && (
                <Button variant="contained" onClick={() => setOpenCreate(true)} sx={{ mb: 2}}>
                    Créer un vol
                </Button>
            )}

            <Typography variant="h5" mb={2}>Nombres de vols : {volsFiltered.length}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 4 }}>
                {volsFiltered.map(vol => (
                    <VolCard key={vol.id} vol={vol} />
                ))}
            </Box>

            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Créer un vol</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Numéro de vol"
                        fullWidth
                        margin="normal"
                        value={newVol.numeroVol}
                        onChange={(e) => setNewVol({...newVol, numeroVol: e.target.value})}
                    />
                    <TextField
                        label="Compagnie"
                        fullWidth
                        margin="normal"
                        value={newVol.compagnie}
                        onChange={(e) => setNewVol({...newVol, compagnie: e.target.value})}
                    />
                    <TextField
                        label="Origine"
                        fullWidth
                        margin="normal"
                        value={newVol.origine}
                        onChange={(e) => setNewVol({...newVol, origine: e.target.value})}
                    />
                    <TextField
                        label="Destination"
                        fullWidth
                        margin="normal"
                        value={newVol.destination}
                        onChange={(e) => setNewVol({...newVol, destination: e.target.value})}
                    />
                    <TextField
                        label="Date de départ"
                        type="datetime-local"
                        fullWidth
                        margin="normal"
                        value={newVol.dateDepart}
                        onChange={(e) => setNewVol({...newVol, dateDepart: e.target.value})}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Date d'arrivée"
                        type="datetime-local"
                        fullWidth
                        margin="normal"
                        value={newVol.dateArrivee}
                        onChange={(e) => setNewVol({...newVol, dateArrivee: e.target.value})}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Places disponibles"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={newVol.placesDisponibles}
                        onChange={(e) => setNewVol({...newVol, placesDisponibles: e.target.value})}
                    />
                    <TextField
                        label="Prix de base"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={newVol.prixBase}
                        onChange={(e) => setNewVol({...newVol, prixBase: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
                    <Button onClick={handleCreateVol} variant="contained">Créer</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Vols;