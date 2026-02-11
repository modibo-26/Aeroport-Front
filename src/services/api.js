import axios from "axios";
import { logout } from "./authService";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/",
    headers: {
        "Content-Type": "application/json",
    },
})

// Interceptor à la requete pour ajouter le token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur à la réponse pour les errreurs
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized, redirect to login
            try {
                logout();
            } catch (error) {
                console.error("Logout failed", error);
            }
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;