import axios from 'axios';

// 1. Gateway ka live link (Localhost ko live URL se replace kiya)
const API_BASE_URL = 'https://main-vilhelmina-pitaji-3748f171.koyeb.app';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // 2. Ye zaroori hai taaki browser Auth0 ke session cookies backend tak bhej sake
    withCredentials: true 
});

export default api;