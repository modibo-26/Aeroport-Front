import API from "./api";

export const creerPaiement = (reservationId, passagerId, montant) =>
    API.post(`/paiements?reservationId=${reservationId}&passagerId=${passagerId}&montant=${montant}`);

export const getPaiementByReservation = (reservationId) =>
    API.get(`/paiements/reservation/${reservationId}`);

export const rembourserPaiement = (id) =>
    API.post(`/paiements/${id}/rembourser`);
