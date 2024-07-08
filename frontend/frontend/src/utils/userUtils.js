import { axiosInstanceNoAuth } from '../context/axiosInstances';
import { usersServiceURL } from '../context/serviceUrls';

export const fetchUsers = async () => {
    try {
        const response = await axiosInstanceNoAuth.get(`${usersServiceURL}/users/`);
        const users = response.data;
        localStorage.setItem('usersCache', JSON.stringify(users));
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};
