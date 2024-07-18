// src/context/serviceUrls.js
const usersServiceURL = process.env.REACT_APP_USERS_SERVICE_URL || 'http://localhost:8020';
const musiciansServiceURL = process.env.REACT_APP_MUSICIANS_SERVICE_URL || 'http://localhost:8000';

export { usersServiceURL, musiciansServiceURL };
