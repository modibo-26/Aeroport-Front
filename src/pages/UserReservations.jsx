import { useContext, useEffect, useState } from "react";
import { annulerReservation, fetchReservationsByPassager } from "../services/reservationService";
import { creerPaiement } from "../services/paiementService";
import { Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import ReservationCard from "../components/ReservationCard";
import { fetchVolById } from "../services/volService";
import { SnackbarContext } from "../context/SnackbarContext";

function UserReservations() {

    const {user} = useContext(AuthContext);
    const {showSnackbar} = useContext(SnackbarContext)

    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [vols, setVols] = useState([]) 


    useEffect(() => {
        fetchReservationsByPassager(user.id).then(async (res) => {
            setReservations(res.data);
            const volIds = [...new Set(res.data.map(r =>  r.volId))];
            const volsData = await Promise.all(volIds.map(id => fetchVolById(id)))
            const volsMap = {};
            volsData.forEach(v => volsMap[v.data.id] = v.data);
            setVols(volsMap);
        }).catch(error => {
            console.error("Error fetching user reservations:", error);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [user]);

    const refreshReservations = (id, statut) => {
        return reservations.map(r => {
            return r.id === id ? {...r, statut: statut} : r;
        });
    };

    const handleAnnuler = async (id) => {
        await annulerReservation(id);
        setReservations(refreshReservations(id, "ANNULEE"));
        showSnackbar('Réservation annulée !', 'success');
    };

    const handlePayer = async (reservationId, montant) => {
        try {
            const response = await creerPaiement(reservationId, user.id, montant);
            window.location.href = response.data;
        } catch (error) {
            console.error("Erreur lors du paiement:", error);
            showSnackbar('Erreur lors du paiement', 'error');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (<div>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 4 }}>
        {reservations.map(res => (
            <ReservationCard
                key={res.id} 
                reservation={res} 
                vol={vols[res.volId]}
                onAnnuler={handleAnnuler}
                onPayer={handlePayer}
            />
        ))}
    </Box>
            
    </div>
    );
}

export default UserReservations;