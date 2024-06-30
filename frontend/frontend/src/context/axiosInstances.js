// src/axiosInstances.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8020/',
});

const axiosInstanceNoAuth = axios.create({
    baseURL: 'http://localhost:8020/',
});

const setAuthorizationHeader = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export { axiosInstance, axiosInstanceNoAuth, setAuthorizationHeader };
