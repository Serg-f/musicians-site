// src/utils/auth.js
import axios from 'axios';

export const verifyToken = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
        const response = await axios.post('http://localhost:8020/token/verify/', { token });
        return response.status === 200;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
};

export const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return false;

    try {
        const response = await axios.post('http://localhost:8020/token/refresh/', { refresh: refresh_token });
        localStorage.setItem('access_token', response.data.access);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return true;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await axios.get('http://localhost:8020/profile/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
    }
};
