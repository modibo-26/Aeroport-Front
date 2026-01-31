import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor to include the token in headers
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

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized, redirect to login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;