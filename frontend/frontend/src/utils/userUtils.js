// src/utils/userUtils.js
import { axiosInstanceNoAuth } from '../context/axiosInstances';

export const fetchUsers = async () => {
    try {
        const response = await axiosInstanceNoAuth.get('http://localhost:8020/users/');
        const users = response.data;
        localStorage.setItem('usersCache', JSON.stringify(users));
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};
