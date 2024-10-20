// src/context/serviceUrls.js
const apiGatewayURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const usersServiceURL = `${apiGatewayURL}/users`;
const musiciansServiceURL = `${apiGatewayURL}/musicians`;

export { usersServiceURL, musiciansServiceURL };
