import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api' || 'https://curamed-auth-api-973580931654.europe-north1.run.app',
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;