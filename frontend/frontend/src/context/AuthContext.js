import React, { createContext, useState, useCallback, useEffect } from 'react';
import { axiosInstance, setAuthorizationHeader } from './axiosInstances';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get('profile/');
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
            const response = await axiosInstance.post('token/refresh/', { refresh: refresh_token });
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
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            console.log("verifyAuth: No token found");
            setLoading(false);
            return;
        }

        setAuthorizationHeader(token);

        try {
            const response = await axiosInstance.post('token/verify/', { token });
            if (response.status === 200) {
                const profile = await getUserProfile();
                setUser(profile);
                setIsAuthenticated(true);
                console.log("verifyAuth: User is authenticated");
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            const refreshed = await refreshToken();
            if (refreshed) {
                const profile = await getUserProfile();
                setUser(profile);
                setIsAuthenticated(true);
                console.log("verifyAuth: Token refreshed, user is authenticated");
            } else {
                setIsAuthenticated(false);
                console.log("verifyAuth: Token verification and refresh failed");
            }
        } finally {
            setLoading(false);
        }
    }, [refreshToken]);

    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthorizationHeader(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, verifyAuth, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
