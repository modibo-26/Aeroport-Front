import { useContext, useEffect, useState } from "react";
import { annulerReservation, confirmReservation, fetchReservationsByPassager } from "../services/reservationService";
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

    const handleConfirmer = async (id) => {
        await confirmReservation(id);
        showSnackbar('Réservation confirmée !', 'success');
        setReservations(refreshReservations(id, "CONFIRMEE"));
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
                onConfirmer={handleConfirmer}
            />
        ))}
    </Box>
            
    </div>
    );
}

export default UserReservations;