// src/context/serviceUrls.js
const usersServiceURL = process.env.REACT_APP_USERS_SERVICE_URL || 'https://users-service-2d4imkwuza-ey.a.run.app';
const musiciansServiceURL = process.env.REACT_APP_MUSICIANS_SERVICE_URL || 'https://musicians-service-2d4imkwuza-ey.a.run.app';

export { usersServiceURL, musiciansServiceURL };
