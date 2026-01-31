import API from "./api";

export const createReservation = (reservationData) => API.post("/reservations", reservationData);

export const fetchReservationById = (id) => API.get(`/reservations/${id}`);

export const annulerReservation = (id) => API.put(`/reservations/${id}/annuler`);

export const fetchReservationsByPassager = (passagerId) => API.get(`/reservations/passager/${passagerId}`);

export const confirmReservation = (id) => API.put(`/reservations/${id}/confirmer`);

export const fetchByVolId = (volId) => API.get(`/reservations/vol/${volId}`);
