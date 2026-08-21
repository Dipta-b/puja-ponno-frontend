import React, { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API = API_BASE_URL;

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch(`${API}/api/auth/me`, {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f1e7]">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}