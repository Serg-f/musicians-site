import axios from 'axios';
import { usersServiceURL } from './serviceUrls';

const axiosInstance = axios.create({
    baseURL: `${usersServiceURL}/`,
});

const axiosInstanceNoAuth = axios.create({
    baseURL: `${usersServiceURL}/`,
});

const setAuthorizationHeader = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export { axiosInstance, axiosInstanceNoAuth, setAuthorizationHeader };
