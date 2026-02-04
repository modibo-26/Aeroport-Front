import API from "./api";

export const createVol = (volData) => API.post("/vols", volData);

export const fetchVols = () => API.get("/vols");

export const fetchVolById = (id) => API.get(`/vols/${id}`);

export const editVol = (id, volData) => API.put(`/vols/${id}`, volData);

export const deleteVol = (id) => API.delete(`/vols/${id}`);

export const fetchPlacesDisponibles = (volId) => API.get(`/vols/${volId}/places-disponibles`);

export const updateStatutVol = (id, statut) => API.put(`/vols/${id}/statut`, statut );

export const fetchVolsByDestination = (destination) => API.get(`/vols/destination/${destination}`);
