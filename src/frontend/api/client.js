import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true
});

function getErrorMessage(error, fallback) {
    return error.response?.data?.error || fallback;
}

export { getErrorMessage };
export default api;
