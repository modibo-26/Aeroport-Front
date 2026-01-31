import { login, logout, register } from "../services/authService";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({ 
                id: payload.sub,
                email: payload.email,
                role: payload.role
            });
        }
    }, []);

     const handleRegister = async (userData) => {
        try {
            await register(userData);
            return true
        } catch (error) {
            console.error("Registration failed", error);
        }
    }

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            localStorage.setItem("token", response.data.token);
            const payload = JSON.parse(atob(response.data.token.split(".")[1]));
            setUser({ 
                id: payload.sub,
                email: payload.email,
                role: payload.role
            });
            return response;
        } catch (error) {
            console.error("Login failed", error);
        }
    }

    const handleLogout = async () => {
        try {
            logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, handleRegister, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}