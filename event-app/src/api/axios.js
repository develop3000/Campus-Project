import axios from 'axios';

const api = axios.create({
    baseURL: 'https://campus-project-ljun.onrender.com',
    withCredentials: true
});

export default api; 