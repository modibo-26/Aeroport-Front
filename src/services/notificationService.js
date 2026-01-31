import API from "./api";

export const createNotification = (notificationData) => API.post("/notifications", notificationData);   

export const fetchNotificationByPassager = (passagerId) => API.get(`/notifications/passager/${passagerId}`);

export const markAsRead = (notificationId) => API.put(`/notifications/${notificationId}/lue`);

export const deleteNotification = (notificationId) => API.delete(`/notifications/${notificationId}`);

export const fetchNotificationsByVol = (volId) => API.get(`/notifications/vol/${volId}`);