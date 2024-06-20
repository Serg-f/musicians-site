// src/context/AuthContext.js
import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const setAuthorizationHeader = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const getUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8020/profile/');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
        }
    };

    const refreshToken = useCallback(async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) return false;

        try {
            const response = await axios.post('http://localhost:8020/token/refresh/', { refresh: refresh_token });
            const newToken = response.data.access;
            localStorage.setItem('access_token', newToken);
            setAuthorizationHeader(newToken);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }, []);

    const verifyAuth = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        setAuthorizationHeader(token);

        try {
            const response = await axios.post('http://localhost:8020/token/verify/', { token });
            if (response.status === 200) {
                const profile = await getUserProfile();
                setUser(profile);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            const refreshed = await refreshToken();
            if (refreshed) {
                const profile = await getUserProfile();
                setUser(profile);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }
    }, [refreshToken]);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthorizationHeader(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, verifyAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
